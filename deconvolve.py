#!/usr/bin/env python

### takes in a D and deconvolves it into R and S
from numpy import *
from scipy import *
from numpy.linalg import *
import numpy
import time

def collect_costs(outdir):
    import os
    
    costs = dict()
    done = False
    num=2
    maxnum=0
    while done==False:
        directory = "%s/%d_clones" % (outdir,num)
        if os.path.isdir(directory):
            #print "%s is a directory" % directory
            cost_list = []
            list_done=False
            soln=0
            while list_done==False:
                filename="%s/cost_%d" % (directory,soln)
                if os.path.exists(filename):
                    #print "%s is a file" % filename
                    f = open(filename,'r')
                    content=f.readlines()
                    cost_list.append(content[0])
                    f.close()
                else:
                    #print "%s is not a file" % filename
                    list_done=True
            
                soln+=1

            costs[num]=cost_list
            maxnum=num
            num+=1
        else:
            done=True
            #print "%s is not a directory" % directory
    
    f_costs=open("%s/costs.txt" % outdir,'w')
    
    for i in xrange(2,maxnum+1):
        mylist=costs[i]
        
        for j in xrange(len(mylist)):
            f_costs.write("%s\t" % mylist[j])
        f_costs.write("\n")
    
    f_costs.close()
    print "Collected costs in %s/costs.txt" % outdir


def check_file(filename,outdir):
    print "checking file %s" % (filename)
    D=loadmatrix(filename)
    numsignals=D.shape[0]
    numbins=D.shape[1]
    print "Data indicates %d samples, and the genome is split into %d bins" % (numsignals,numbins)
    print "(If this is false, make sure the input file has the samples as rows and the bins as columns)"
    
    if numsignals < 2:
        print "There must be at least 2 samples from a tumor to run this program."
    
    f = open('%s/info.txt' % outdir,'w')
    f.write("samples\t%d \nbins\t%d" % (numsignals,numbins))
    f.write("\n")
    f.close()
    
def read_info(filename):
    f = open(filename,'r')
    numsamples = 0
    numbins = 0
    for line in f:
        neat = (line.strip()).split()
        if neat[0]=="samples":
            numsamples = int(neat[1])
        if neat[0]=="bins":
            numbins = int(neat[1])
    if numsamples==0 or numbins==0:
        print "error, info file %s did not contain non-zero samples and bins counts" % filename
    return numsamples, numbins

def run_deconvolve_from_file(filename,outdir,numclones=2,testing=False,progress_file=""):
    if progress_file != "":
        print "Printing progress to %s" % progress_file
    
    testing = bool(testing)
    
    D=loadmatrix(filename)
    print D.shape
    numclones = int(numclones)
    costs,allS,allR = deconvolve(D,numclones,testing=testing,progress_file=progress_file)
    #print best_R
    #print costs.shape
    #print allS.shape
    #
    #print "Unique costs"
    
    indices = costs.argsort()
    sorted_costs = costs[indices]
    sorted_S = allS[indices]
    sorted_R = allR[indices]
    
    cost_set = list()
    S_set = list()
    R_set = list()
    for i in xrange(len(sorted_costs)):
        
        c =  sorted_costs[i]
        S = sorted_S[i]
        R = sorted_R[i]
        if c not in cost_set:
            #print "added %f" % c
            cost_set.append(c)
            S_set.append(S)
            R_set.append(R)
            #print mean(S)
    
    print "length of solutions set: %d" % (len(cost_set))
    num_solns_to_display = 5
    if num_solns_to_display > len(cost_set):
        num_solns_to_display = len(cost_set)
        print "showing all solutions"
    
    ####################################################################################################
    ## still need to check intelligently for duplicate solutions using calc_S_similarity
    
    ####################################################################################################
    
    
    #############################################
    ########### check if outdir exists ##########
    #############################################
    import os
    if os.path.isdir(outdir)==False:
        print "Error in deconvolve.py: run_deconvolve_from_file(): outdir %s does not exist" % (outdir)
        return
    
    
    for i in xrange(num_solns_to_display):
        S = S_set[i]
        R = R_set[i]
        matrixtofile(S,"%s/S_%d" % (outdir,i), use_float=False)
        matrixtofile(R,"%s/R_%d" % (outdir,i), use_float=True)
        
        f = open("%s/cost_%d" % (outdir,i),'w')
        f.write("%.10f" % cost_set[i])
        f.close()

def loadmatrix(filename):
    # load a matrix from the file
    import numpy as np
    f = open(filename,'r')
    
    content = f.readlines()
    f.close()
    
    #print "%d contigs" % num
    data = []
    for line in content:
        bare=line.strip()
        if (bare != ""):
            data.append(map(float,bare.split()))
    
    data = np.array(data)
        
        
    if data.shape[0]==1:
        data=data[0]
    print data.shape
    
    
    return data


def matrixtofile(X,filename,use_float=True):
    # write a matrix to a file with the given filename
   
    if len(X.shape)==2:
        f2 = open(filename,'w')
        for line in X:
            for item in line:
                if use_float:
                    f2.write("%f\t" % item)
                else:
                    f2.write("%d\t" % item)
            f2.write('\n')
        f2.close()
    elif len(X.shape)==1:
        f2 = open(filename,'w')
        for item in X:
            if use_float:
                f2.write("%f\t" % item)
            else:
                f2.write("%d\t" % item)
        f2.close()
    else:
        print "array must be 1- or 2-dimensional"
        
 
def deconvolve(D, numclones, testing=False, max_falling_iterations=15,progress_file=""):
    print "in deconvolve()"
    print D.shape
    before = time.time()
    last_update_time=time.time()
    
    numsources=numclones
    numsignals=D.shape[0]
    numbins=D.shape[1]
    
    
    numtrials = 10000
    
    if numsources==4:
        numtrials = 50000
    if numsources==5:
        numtrials = 1000000
    
    if testing==True:
        numtrials=100 
    
    print "running %d random initializations" % (numtrials)
    
    print "number of samples: %d" % numsignals
    print "hypothetical number of clones: %d" % numsources
    print "number of bins in genome: %d" % numbins
    
    costs = []
    numfalls=[]
    allS=[]
    allR=[]
    
    best_cost=10000000000000
    best_R=array([])
    best_S=array([])
    
   
    for i in xrange(numtrials):       
        
        R=generate_random_R(numsignals,numsources)
        S=abs(around((pinv(R).dot(D))))
        
        
        iterationcounter=0
        diff=10
        
        while diff > 0.00000001 and iterationcounter < max_falling_iterations:
            previousS=S
        
            R=D.dot(pinv(S))
            
            ############### Normalize R again ##########################
            
            # normalize rows of R to total 1 again
            R=abs(R)
            row_sums = R.sum(axis=1)
            R = R / row_sums[:, numpy.newaxis]
            ############## Solve for S #################################
            ############## Round S to nearest integers #################
            
            
            # Solve for S and round it to nearest positive integers
            S=abs(around((pinv(R).dot(D))))
    
            ############## Adjust R to fit after S is rounded ##########
            
            
            
            
            diff = calc_S_similarity(previousS,S)
            
            iterationcounter+=1
        
        
        
        cost = sum((R.dot(S)-D)**2)
        

        if cost < best_cost:
            best_cost=cost
            best_R=R
            best_S=S
        
        costs.append(cost)
        numfalls.append(iterationcounter)
        allS.append(S)
        allR.append(R)
        
    
        if i==100:
            estimate=(time.time()-before)*numtrials/100.0
            print "estimated run-time for %d trials: %d seconds or %d minutes" % (numtrials,estimate,estimate/60.0)
        if (i+1) % (int(numtrials/100))==0:
            print "progress: %d%%" % ((i+1)*100/numtrials)
            now=time.time()
            if now-last_update_time>1.0: #update every second
                print "update"
                last_update_time=time.time()
                f=open(progress_file,'a')
                f.write("clones\t%d\tprogress\t%d\n" % (numclones, i*100.0/numtrials))
                f.close()
    
    f=open(progress_file,'a')
    f.write("clones\t%d\tprogress\t%d\n" % (numclones, 100))
    f.close()
    seconds=time.time()-before
    print "elapsed time: %d minutes, %d seconds" % (seconds/60, seconds%60)
    
    costs=array(costs)
    allS=array(allS)
    allR=array(allR)
    #return costs, numfalls, best_R, best_cost, best_S,allS
    return costs,allS,allR



def generate_random_R(numsignals,numsources):
    R=rand(numsignals,numsources)
    
    for i in xrange(5):
        jiggle=rand(*R.shape)
        negatives=(rand(*R.shape)<0.5)*-2.0+1 #creates array of -1 and +1 to multiply jiggle array
        R=abs(R+jiggle*negatives)
        
        row_sums = R.sum(axis=1)
        R = R / row_sums[:, numpy.newaxis]
    
    return R
    
def generate_random_S(numsources,numbins,distribution=[]): 
    if len(distribution)>0:
        indices=floor(rand(numsources*numbins)*len(distribution))
        indices=indices.astype(int)
        randomset=distribution[indices]
        randomset=array(randomset)
        randomset.shape=(numsources,numbins)
        S=abs(around(randomset))
        return S
    else:
        S=abs(around(random.normal(2,1,size=[numsources,numbins])))
        return S
    

    
def sort_S(S):
    indices1=argsort(mean(S,axis=1))
    S1=S[indices1]
    return S1

def sort_R(R):
    if R.shape[1]==1:
        return R
    
    indices1=argsort(R[:,0])
    R1=R[indices1,:]
    
    indices2=argsort(R1[0])
    R2=R1[:,indices2]
    return R2
    
    
def calc_R_similarity(R1,R2):
    r1=sort_R(R1)
    r2=sort_R(R2)
    
    diff=sum((r1-r2)**2)
    return diff

def calc_S_similarity(S1,S2):
    s1=sort_S(S1)
    s2=sort_S(S2)
    
    diff=sum((s1-s2)**2)
    return diff



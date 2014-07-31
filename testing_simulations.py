#!/usr/bin/env python
import pylab
import numpy

import matplotlib.pyplot as plt
import shutil
import os

from numpy import *
from scipy import *
from numpy.linalg import *
import time
import os



def copycat(D, numclones, testing=False, max_falling_iterations=15,progress_file="",outdir="",filename_sim="",maxnumtrials=100):
    if outdir!="":
        filename="%s/abort" % (outdir)
        if os.path.exists(filename):
            print "deconvolve aborted from abort file in output directory"
            return
            
    print "in deconvolve()"
    print D.shape
    before = time.time()
    last_update_time=time.time()

    numsources=numclones
    numsignals=D.shape[0]
    numbins=D.shape[1]


    #maxnumtrials = 10000
    #
    #if numsources==4:
    #    maxnumtrials = 50000
    #if numsources==5:
    #    maxnumtrials = 1000000
    #if numsources > 5:
    #    print "CANNOT RUN WITH MORE THAN 5 CLONES. IT WOULD TAKE TOO LONG"
    #if testing==True:
    #    maxnumtrials=100

    print "running %d random initializations" % (maxnumtrials)

    print "number of samples: %d" % numsignals
    print "hypothetical number of clones: %d" % numsources
    print "number of bins in genome: %d" % numbins

    
    #numfalls=[]
    #costs = []
    #
    #allS=[]
    #allR=[]

    #best_cost=10000000000000
    #best_R=array([])
    #best_S=array([])
    #
    #allS=array([])
    #allR=array([])
    
    
    
    
    
    num_best_solns_to_store=10
    
    
    best_cost=array([1000000000000000000.0]*num_best_solns_to_store)
    best_R=[0.0]*num_best_solns_to_store
    best_S=[0]*num_best_solns_to_store
    count_occurrence=[0]*num_best_solns_to_store
    print best_cost
    print best_R
    print best_S
    
    #######################################
    if filename_sim=="":
        filename_sim="user_data/testing/simulations/costs_over_trials.txt"
    f_sim=open(filename_sim,'w')
    f_sim.write("trial number, lowest cost, occurrence of lowest cost\n")
    #######################################
    
    #################
    i=0
    alldone=False
    while i < maxnumtrials and alldone==False:
        #################

        R=generate_random_R(numsignals,numsources)
        #S=abs(around((pinv(R).dot(D))))
        S=abs(around(( numpy.dot(pinv(R), D))))


        iterationcounter=0
        diff=10

        while diff > 0.00000001 and iterationcounter < max_falling_iterations:
            previousS=S

            #R=D.dot(pinv(S))
            R=numpy.dot(D,pinv(S))


            ############### Normalize R again ##########################

            # normalize rows of R to total 1 again
            R=abs(R)
            row_sums = R.sum(axis=1)
            R = R / row_sums[:, numpy.newaxis]
            ############## Solve for S #################################
            ############## Round S to nearest integers #################


            # Solve for S and round it to nearest positive integers
            #S=abs(around((pinv(R).dot(D))))
            S=abs(around(( numpy.dot(pinv(R), D))))

            ############## Adjust R to fit after S is rounded ##########




            diff = calc_S_similarity(previousS,S)

            iterationcounter+=1



        #cost = sum((R.dot(S)-D)**2)
        cost = sum((numpy.dot(R,S)-D)**2)



        #if cost < best_cost:
        #    best_cost=cost
        #    best_R=R
        #    best_S=S
        
        #costs.append(cost)
        ##numfalls.append(iterationcounter)
        #allS.append(S)
        #allR.append(R)
        
        # compare new soln to the costs of the previously stored solutions
        # store cost if it is better than the worst solution we have stored
        worst_index=argmax(best_cost)
        
        if cost < best_cost[worst_index]: #if the cost matches a previously found solution, just count that we saw that solution again
            found=False
            for j in xrange(len(best_cost)):
                if abs(cost - best_cost[j])<0.000001 and calc_S_similarity(S,best_S[j]) < 0.00000001:
                    count_occurrence[j]+=1
                    found=True

            if found==False: # if this is a completely new solution, record it as a replacement for the worst previous
                best_cost[worst_index]=cost
                best_R[worst_index]=R
                best_S[worst_index]=S
                count_occurrence[worst_index]=1
                
############################
            best_index=numpy.argmin(best_cost)
            


            
            
            f_sim.write("%d, %.6f,%d\n" % (i,best_cost[best_index],count_occurrence[best_index]))
            
            if count_occurrence[best_index] >= 10:
                if sum(count_occurrence)-count_occurrence[best_index] >= 20:
                    alldone=True
                    print "Best solution has occurred 10 times: solution accepted"
                    
            if count_occurrence[best_index] >= 300:
                alldone=True
                print "Best solution has occurred 300 times: solution accepted"




############################

        if i==50:
            estimate=(time.time()-before)*maxnumtrials/50.0
            print "estimated run-time for %d trials: %d seconds or %d minutes" % (maxnumtrials,estimate,estimate/60.0)
        if (i+1) % (int(maxnumtrials/100.0))==0:
            percent=(i+1)*100.0/maxnumtrials
            
            print "progress: %d%%" % (percent)
            now=time.time()
            if now-last_update_time>1.0: #update every second
                print "updating progress.txt"
                last_update_time=time.time()
                if progress_file != "":
                    f=open(progress_file,'a')
                    f.write("clones\t%d\tprogress\t%d\n" % (numclones, i*100.0/maxnumtrials))
                    f.close()
            if outdir!="":
                filename="%s/abort" % (outdir)
                if os.path.exists(filename):
                    i=maxnumtrials
        
    #################
        i+=1
    #################
    f_sim.close()
    
    
    if progress_file != "":
        f=open(progress_file,'a')
        f.write("clones\t%d\tprogress\t%d\n" % (numclones, 100))
        f.close()
    seconds=time.time()-before
    print "elapsed time: %d minutes, %d seconds" % (seconds/60, seconds%60)
    
    good_costs=[]
    good_R=[]
    good_S=[]
    good_counts=[]
    for indx in xrange(len(best_S)):
        if type(best_S[indx])==numpy.ndarray:
            good_costs.append(best_cost[indx])
            good_S.append(best_S[indx])
            good_R.append(best_R[indx])
            good_counts.append(count_occurrence[indx])
    best_cost=array(good_costs)
    best_S=array(good_S)
    best_R=array(good_R)
    count_occurrence=array(good_counts)
    print "Found %d unique solutions" % (len(good_costs))
    #return costs, numfalls, best_R, best_cost, best_S,allS
    return best_cost,best_S,best_R,count_occurrence




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

def matrixtofile(X,filename,use_float=True,csv=False):
    # write a matrix to a file with the given filename

    delim="\t"
    if csv==True:
        delim=","

    if len(X.shape)==2:
        f2 = open(filename,'w')
        for line in X:
            for item in line:
                if use_float:
                    f2.write("%f%s" % (item,delim))
                else:
                    f2.write("%d%s" % (item,delim))
            f2.write('\n')
        f2.close()
    elif len(X.shape)==1:
        f2 = open(filename,'w')
        for item in X:
            if use_float:
                f2.write("%f%s" % (item,delim))
            else:
                f2.write("%d%s" % (item,delim))
        f2.close()
    else:
        print "array must be 1- or 2-dimensional"








def getRS(directory):
    R=loadmatrix(directory+"R.txt")
    S=loadmatrix(directory+"S.txt")
    return R,S


def generate_noisy_D(R,S, noise_std=0):
    D=R.dot(S)
    noise=0
    if noise_std > 0:
        noise=random.normal(0,noise_std,size=D.shape)
    
    D=D+noise
    return D
    
    



def test1():
    random_sim=True
    noise_STD=0.02
    #directory="user_data/testing/simulations/test1/"
    directory="user_data/testing/simulations/random/"
    
    
    
    
    
    
    R=0
    S=0
    numsignals=0
    numsources=0
    numbins=0
    ####################################################################################
    ##                    Generate random data
    ####################################################################################
    if random_sim==True:
        numsignals=5
        numsources=3
        numbins=5000
        R=generate_random_R(numsignals,numsources)
        S=generate_random_S(numsources,numbins)
        
    
    ####################################################################################
    ##                    Import data from file
    ####################################################################################
    else:
        
    
        R,S = getRS(directory);
        
    
    
    ####################################################################################
    ##                    Calculate dimensions and check fit
    ####################################################################################
    numsignals,numsources=R.shape;
    numsources2,numbins=S.shape
    
    if numsources!=numsources2:
        print "ERROR, R AND S MUST HAVE SAME NUMBER OF CLONES/SOURCES"
        return;
    
   
    
    
    ####################################################################################
    ##                    Calculate D with or without noise
    ####################################################################################
    
    D=generate_noisy_D(R,S, noise_std=noise_STD)
    
    clean_input_D=generate_noisy_D(R,S, noise_std=0)
    
    
    ####################################################################################
    ##                    Generate model and run algorithm
    ####################################################################################
    
    best_cost,best_S,best_R,count_occurrence=copycat(D, numclones=numsources, testing=False, max_falling_iterations=15,progress_file="",outdir="",maxnumtrials=2000,filename_sim=directory+"cost_occurrence.txt")
    
    
    best_indices=numpy.argsort(best_cost)
    index=best_indices[0]
    print best_cost[best_indices]
    print count_occurrence[best_indices]
    
    output_S = best_S[index]
    output_R = best_R[index]
    output_D = numpy.dot(output_R,output_S)
    
    
    diff = calc_S_similarity(output_D,clean_input_D)
    
    print diff
    
    diff = sum((output_D - clean_input_D)**2)
    
    print diff
    
    
    
    
    
    



test1()










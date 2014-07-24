#!/usr/bin/env python
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.mlab import *
from numpy import *
from scipy import *
from numpy.linalg import *
from matplotlib.ticker import MaxNLocator
import numpy
    
import colorsys # for pseudocolor function

import time
import pylab






def cost_value_plot(costs,filename=""):    
    
    print costs.shape
    
    x=arange(2,costs.shape[0]+2)
    
    plt.figure()
    
    y=numpy.min(costs,axis=1)
    bottom=numpy.min(costs,axis=1)
    top=numpy.max(costs,axis=1)
    
    #plt.errorbar(x, y, yerr=[y-bottom,top-y], fmt='b-o',ecolor='g')
    plt.plot(x,y)
    
    #plt.title("Cost range of best solutions for each number of clones tested")
    plt.ylabel("cost")
    plt.xlabel("number of clones")
    plt.xticks(x)
    plt.ylim( (0,max(y)*1.05))
    
    if filename=="":
        plt.show()
    else:
        pylab.savefig(filename)
        plt.close()

    
    
def plot_R(R,title="",filename=""):
    
    R1=sort_R(R)
    stack_bar_plot(R1,title=title,filename=filename)

def plot_S(S,chromosomes=[],title="Copy number profiles",filename=""):
    S1=sort_S(S)
    plotcells(S1,chromosomes=chromosomes,title=title,filename=filename)
    

def Smap(R_answer,S_answer,precision = 10,max_falling_iterations=1,filename=""):
    S_collection = []
    
    r1_collection = []
    r2_collection = []
    S_collection.append(S_answer)
    r1_collection.append([])
    r2_collection.append([])
    
    row,col=R_answer.shape
    if row!=2 or col!=2:
        print "R_answer must be a 2 by 2 array"
        return
    before = time.time()
   
    D=R_answer.dot(S_answer)
    S=S_answer
    
    for i in xrange(precision):
        r1=i*1.0/precision
        for j in xrange(precision):
            r2=j*1.0/precision
            R=array([[r1,1-r1],[r2,1-r2]])
            
            # normalize rows of R to total 1
            row_sums = R.sum(axis=1)
            R = R / row_sums[:, numpy.newaxis]
            R,S=fall(R,D,max_falling_iterations=max_falling_iterations)
            
            found=False
            for m in xrange(len(S_collection)):
                s=S_collection[m]
                diff = calc_S_similarity(s,S)
                if diff < 0.0001:
                    found=True
                    r1_collection[m].append(r1)
                    r2_collection[m].append(r2)
                    break
            if found==False:
                S_collection.append(S)
                r1_collection.append([])
                r2_collection.append([])
                r1_collection[i].append(r1)
                r2_collection[i].append(r2)
        print "progress: %d of %d rows complete" % (i+1,precision)
    print "finished generating data for Smap in %d seconds" % (time.time()-before)
    
    print "%d different S copy number profiles when we do %d iterations" % (len(S_collection),max_falling_iterations)
    
    
    N=len(S_collection)
    colors = get_random_colors(N)
    colors[0]=[0,0,0]
    
    
    
    plt.figure()   
    for i in xrange(len(S_collection)):
        plt.plot(r1_collection[i],r2_collection[i],'s',color=colors[i],mec=colors[i])
    if filename=="":
        plt.show()
    else:
        pylab.savefig(filename)
    return S_collection,r1_collection,r2_collection
 


def fall(normalized_R,D,verbose=False,max_falling_iterations=15):

    R=normalized_R
    S=abs(around((pinv(R).dot(D))))
    iterationcounter=0
    diff = 10
    while diff > 0.0001 and iterationcounter<max_falling_iterations:
        previousS=S
       
        ############## Solve for S #################################
        ############## Round S to nearest integers #################
        
        
        # Solve for S and round it to nearest positive integers
        S=abs(around((pinv(R).dot(D))))

        ############## Adjust R to fit after S is rounded ##########
        
        R=D.dot(pinv(S))
        
        ############### Normalize R again ##########################
        
        # normalize rows of R to total 1 again
        R=abs(R)
        row_sums = R.sum(axis=1)
        R = R / row_sums[:, numpy.newaxis]

        if verbose:
            print R
        
        
        diff = calc_S_similarity(previousS,S)
        if verbose:
            if diff<0.00000001:
                print "match"
                #return R,S
            else:
                print "changed"
        iterationcounter+=1
        
    if max_falling_iterations<1:
         S=abs(around((pinv(R).dot(D))))
    return R,S



def get_random_colors(num,pastels=False):
    if pastels==True:
        colors=(1-rand(num,3)/2)
        return colors
    else:
        colors=rand(num,3)
        return colors



def plotcells(data,chromosomes=[],title="Copy number profile",filename=""):
    data=array(data)
    if len(data.shape)==2:
        numcells=data.shape[0]
        numbins=data.shape[1]
    elif len(data.shape)==1:
        numcells=1
        numbins=data.shape[0]
    else:
        print "dimensions of data must be 1 or 2"
        return
        
   
    chrom=unique(chromosomes)
    use_colours=len(chromosomes) >= numbins

    if use_colours:
        chromosomes=chromosomes[0:numbins]
        cols=loadmatrix("colors.txt")
        cols=cols[0:len(chrom)]
        
    myrange=arange(0,numbins)
    standard=ones(numbins)*2
    if numcells>1:
        f, (ax) = plt.subplots(len(data), sharex=True, sharey=True)
        
        ax[0].plot(standard,'r')
        i=0
        if use_colours==True:
                
            for j in xrange(len(chrom)):
                indices=chromosomes==chrom[j]
                ax[i].plot(myrange[indices],data[i,indices],color=cols[j],linewidth=4)
                ax[i].grid(True)#########################
                ya = ax[i].get_yaxis()

                ya.set_major_locator(MaxNLocator(integer=True))
                
        else:
            ax[i].plot(data[i])
            ax[i].grid(True)#########################
            ya = ax[i].get_yaxis()

            ya.set_major_locator(MaxNLocator(integer=True))
        ax[0].set_title(title)
        for i in xrange(1,numcells):
            ax[i].plot(standard,'r')
            ax[i].grid(True)#########################
            ya = ax[i].get_yaxis()

            ya.set_major_locator(MaxNLocator(integer=True))
        
            if use_colours==True:
                
                for j in xrange(len(chrom)):
                    indices=chromosomes==chrom[j]
                    ax[i].plot(myrange[indices],data[i,indices],color=cols[j],linewidth=4)
                    ax[i].grid(True)#########################
                    ya = ax[i].get_yaxis()

                    ya.set_major_locator(MaxNLocator(integer=True))
            else:
                ax[i].plot(data[i])
                ax[i].grid(True)#########################
                ya = ax[i].get_yaxis()

                ya.set_major_locator(MaxNLocator(integer=True))
        # Fine-tune figure; make subplots close to each other and hide x ticks for
        # all but bottom plot.
        f.subplots_adjust(hspace=0)
        
        plt.setp([a.get_xticklabels() for a in f.axes[:-1]], visible=False)
        plt.xlabel('Genome position in bins')
        
        if filename=="":
            plt.show()
        else:
            pylab.savefig(filename)
            plt.close()
    else:
        f, ax = plt.subplots(1, sharex=True, sharey=True)
        ax.plot(standard,'r')
       
        if use_colours==True:
            for j in xrange(len(chrom)):
                
                indices=chromosomes==chrom[j]
                ax.plot(myrange[indices],data[indices],color=cols[j],linewidth=4)
        else:
            ax.plot(data[0])
        ax.set_title(title)
        
        
        # Fine-tune figure; make subplots close to each other and hide x ticks for
        # all but bottom plot.
        f.subplots_adjust(hspace=0)
        plt.setp([a.get_xticklabels() for a in f.axes[:-1]], visible=False)
        ax = plt.gca()########################
        ax.grid(True)#########################
        ya = ax.get_yaxis()
        ya.set_major_locator(MaxNLocator(integer=True))
        plt.xlabel('Genome position in bins')
        plt.ylabel("Copy Number")
        
        if filename=="":
            plt.show()
        else:
            pylab.savefig(filename)
            plt.close()
         
      
               
def plot_1_cell(cell_data,filename=""):
    standard=ones(len(cell_data))*2
    
    f, ax = plt.subplots()
    ax.plot(standard,'r')
    ax.plot(cell_data)
    ax = plt.gca()########################
    ax.grid(True)#########################
    ax.set_title('Copy number')
    plt.ylabel("Copy number")
    plt.xlabel('Genome position in bins')
    if filename=="":
        plt.show()
    else:
        pylab.savefig(filename)

def tiedrank(X,axis=-1):
    Y=array(X)
    i,j=Y.shape
    if axis==-1:
        Y.shape=(i*j)
        r = ranklist(Y)
        r.shape=(i,j)
        return r
    elif axis==0:
        Y=Y.T
        r=[]
        for row in Y:
            r.append(ranklist(row))
        r=array(r)
        return r.T
    elif axis==1:
        r=[]
        for row in Y:
            r.append(ranklist(row))
        r=array(r)
        return r
    else:
        return Y
        
def ranklist(X):
    a = np.array(X)

    r = np.array(a.argsort().argsort(), dtype=float)
    f = a==a
    for i in xrange(len(a)):
        if not f[i]: continue
        s = a == a[i]
        ls = np.sum(s)
        if ls > 1:
            tr = np.sum(r[s])
            r[s] = float(tr)/ls
        f[s] = False
    
    return r

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
        
    
  
def loadmatrix(filename):
    # load a matrix from the file
    import numpy as np
    f = open(filename,'r')
    
    content = f.readlines()
    f.close()
    
    
    #print "%d contigs" % num
    data = []
    for line in content:
        data.append(map(float,line.split()))
    
    data = np.array(data)
        
        
    if data.shape[0]==1:
        data=data[0]
    return data

    

def heatmap(data,title = '',large=False,use_rank=False,inverted=False,filename=""):
    # heatmap function for visualizing data during debugging, was very slow on matrices over 800 by 800, so don't use for large matrices like the whole genome. 
    
    
    import matplotlib.pyplot as plt
    import numpy as np
    X=array(data)
    
    if use_rank:
        X=tiedrank(X)
    
    if len(X) < 2:
        print 'plotting %s: too few dimensions' % title
        return
    if len(X[0]) < 2:
        print 'plotting %s: too few dimensions' % title
        return
    #if len(X)> 800 and large==False:
    #    print "warning: this is a large matrix and may take a long time. Please specificy large=True if you are sure you want to attempt to construct a heatmap of this matrix. Otherwise, you can call this function on a smaller version/piece of the matrix"
    #    return
    # heatmap:
    fig, ax = plt.subplots()
    
    #ax.pcolor(X, cmap=plt.cm.Blues)
    ax.imshow(X,cmap=plt.cm.Blues)
    ax.set_xticks(np.arange(X.shape[0]/10,X.shape[0]*11/10,X.shape[0]/10), minor=False)
    ax.set_yticks(np.arange(X.shape[0]/10,X.shape[1]*11/10,X.shape[0]/10), minor=False)
    ax.set_xticklabels(frange(0.1,1.1,0.1))
    ax.set_yticklabels(frange(0.1,1.1,0.1))
    ax.invert_yaxis()
    #ax.xaxis.tick_top()
    ax.set_title(title)
    
    if filename=="":
        plt.show()
    else:
        pylab.savefig(filename)

def costmap(R_answer,S_answer,precision=100,title="costmap",use_rank=False,num_echoes_to_indicate=0,max_falling_iterations=1,plot_it=True,filename=""):  
    row,col=R_answer.shape
    if row!=2 or col!=2:
        print "R_answer must be a 2 by 2 array"
        return
    before = time.time()
    #R_answer=array([[R1,1-R1],[R2,1-R2]])
    D=R_answer.dot(S_answer)
    S=S_answer
    
    #r=frange(1.0/precision,1,1.0/precision)
    
    #R_best = 0
    #S_best = 0
    cost_best = 1000
    
    costs=zeros([precision,precision])
    bef = time.time()
    for i in xrange(precision):
        
        r1=i*1.0/precision
        for j in xrange(precision):
            r2=j*1.0/precision
            R=array([[r1,1-r1],[r2,1-r2]])
            
            # normalize rows of R to total 1
            row_sums = R.sum(axis=1)
            R = R / row_sums[:, numpy.newaxis]
            
            
            #####################
            R,S=fall(R,D,max_falling_iterations=max_falling_iterations)
            #####################
            
            
       
            # calculate cost
            cost=sum((R.dot(S)-D)**2)
            costs[i,j]=cost
            if cost < cost_best:
                cost_best=cost
                #R_best=R
                #S_best=S
        if i==5:
            estimate=(time.time()-bef)*precision/5.0
            print "estimated run-time for %d rows: %d seconds or %d minutes" % (precision,estimate,estimate/60.0)
        print "progress: %d of %d rows complete" % (i+1,precision)
    print "finished generating data for heatmap in %d seconds" % (time.time()-before)
    
    matrixtofile(costs,"costmap iterations %d time %d" % (max_falling_iterations,time.time()))
    if plot_it:
        heatmap(log10(costs),title=title,use_rank=use_rank)
        if num_echoes_to_indicate > -1:
            plt.plot(R_answer[1,1]*precision,R_answer[0,1]*precision,'bo')
            plt.plot(R_answer[1,0]*precision,R_answer[0,0]*precision,'bo')
        if num_echoes_to_indicate > 0:
            for i in xrange(1,num_echoes_to_indicate):
                divisor=i+1
                plt.plot(R_answer[1,1]/divisor*precision,R_answer[0,1]/divisor*precision,'r.')
                plt.plot((1-R_answer[1,1]/divisor)*precision,(1-R_answer[0,1]/divisor)*precision,'r.')
        plt.plot()
        if filename=="":
            plt.show()
        else:
            pylab.savefig(filename)
    return array(costs)


def quivermap(R_answer,S_answer,precision=20,title="quivermap",num_echoes_to_indicate=0,plot_it=True,max_falling_iterations=1,filename=""):  
    row,col=R_answer.shape
    if row!=2 or col!=2:
        print "R_answer must be a 2 by 2 array"
        return
    before = time.time()
    #R_answer=array([[R1,1-R1],[R2,1-R2]])
    D=R_answer.dot(S_answer)
    S=S_answer
    

    ticks = arange(precision)*1.0/precision
    

    X,Y=meshgrid(ticks,ticks)
    
    U=zeros(X.shape)
    V=zeros(Y.shape)
  
    for i in xrange(precision):
        r1=i*1.0/precision
        for j in xrange(precision):
            r2=j*1.0/precision
            R=array([[r1,1-r1],[r2,1-r2]])
            
            #####################
            R,S=fall(R,D,max_falling_iterations=max_falling_iterations)
            #####################
            U[i,j]=(R[0,0]-r1)
            V[i,j]=(R[1,0]-r2)
                
        print "progress: %d of %d rows complete" % (i+1,precision)
    print "finished generating data for quiver plot in %d seconds" % (time.time()-before)
    U=array(U)
    V=array(V)
    now=time.time()
    matrixtofile(U,"quiver U time %d" % now)
    matrixtofile(V,"quiver V time %d" % now)
    if plot_it:
        plt.figure()
        Q = plt.quiver(X, Y,U,V,angles='xy', scale_units='xy', scale=1)
        #l,r,b,t = plt.axis()
        #dx, dy = r-l, t-b
        #plt.axis([l-0.05*dx, r+0.05*dx, b-0.05*dy, t+0.05*dy])
        
        plt.title('Flow')
        plt.show()
        if num_echoes_to_indicate > -1:
            plt.plot(R_answer[1,1],R_answer[0,1],'bo')
            plt.plot(R_answer[1,0],R_answer[0,0],'bo')
        if num_echoes_to_indicate > 0:
            for i in xrange(1,num_echoes_to_indicate):
                divisor=i+1
                plt.plot(R_answer[1,1]/divisor,R_answer[0,1]/divisor,'r.')
                plt.plot((1-R_answer[1,1]/divisor),(1-R_answer[0,1]/divisor),'r.')
        plt.plot()
        if filename=="":
            plt.show()
        else:
            pylab.savefig(filename)
    return U,V

def cost_and_quiver(R_answer,costs,U,V,use_rank=False,num_echoes_to_indicate=0,title="costmap with quiver plot",filename=""):
    N=len(U)
    costprecision=costs.shape[0]
    print "precision = %d" % N
    ticks = arange(N)*1.0/N*costprecision
    # costmap

    heatmap(log10(costs),title=title,use_rank=use_rank)

    X,Y=meshgrid(ticks,ticks)
    
    # quiver:
    
    
    plt.quiver(X, Y,U*costprecision,V*costprecision,angles='xy', scale_units='xy', scale=1)
    #l,r,b,t = plt.axis()
    #dx, dy = r-l, t-b
    #plt.axis([l-0.05*dx, r+0.05*dx, b-0.05*dy, t+0.05*dy])
    
    plt.title(title)
    if num_echoes_to_indicate > -1:
        plt.plot(R_answer[1,1]*costprecision,R_answer[0,1]*costprecision,'bo')
        plt.plot(R_answer[1,0]*costprecision,R_answer[0,0]*costprecision,'bo')
    if num_echoes_to_indicate > 0:
        for i in xrange(1,num_echoes_to_indicate):
            divisor=i+1
            plt.plot(R_answer[1,1]/divisor*costprecision,R_answer[0,1]/divisor*costprecision,'r.')
            plt.plot((1-R_answer[1,1]/divisor*costprecision),(1-R_answer[0,1]/divisor*costprecision),'r.')
    plt.plot()
    if filename=="":
        plt.show()
    else:
        pylab.savefig(filename)



def costmap_from_D(D,precision=100,title="costmap",use_rank=False,max_falling_iterations=1,plot_it=True,filename=""):  
    row = D.shape[0]
    if row!=2:
        print "D must be a 2 by N array"
        return
    before = time.time()
    
    cost_best = 100000
    
    costs=zeros([precision,precision])
    for i in xrange(precision):
        r1=i*1.0/precision
        for j in xrange(precision):
            r2=j*1.0/precision
            R=array([[r1,1-r1],[r2,1-r2]])
            
            # normalize rows of R to total 1
            row_sums = R.sum(axis=1)
            R = R / row_sums[:, numpy.newaxis]
            
            
            #####################
            R,S=fall(R,D,max_falling_iterations=max_falling_iterations)
            #####################
            
            
       
            # calculate cost
            cost=sum((R.dot(S)-D)**2)
            costs[i,j]=cost
            if cost < cost_best:
                cost_best=cost
                
        print "progress: %d of %d rows complete" % (i+1,precision)
    print "finished generating data for heatmap in %d seconds" % (time.time()-before)
    
    matrixtofile(costs,"costmap iterations %d time %d" % (max_falling_iterations,time.time()))
    if plot_it:
        heatmap(log10(costs),title=title,use_rank=use_rank)
        
    return array(costs)


def pseudocolor(val, minval,maxval):
    
    h = (float(val-minval) / (maxval-minval)) * 120
    r, g, b = colorsys.hsv_to_rgb(h/360, 1., 1.) 
    return r,g,b
    
def stack_bar_plot(R,title="",filename=""):
    numsamples,numclones=R.shape
    # numsamples becomes the number of stacks
    # numclones becomes the number of segments within each stack
    
    
    N = numsamples
 
    
    ind = np.arange(N)    # the x locations for the groups
    width = 0.5       # the width of the bars: can also be len(x) sequence
    
    
    clonenames=[]
    for i in xrange(numclones):
        clonenames.append("Clone %d" % (i+1))
    samplenames=[]
    for i in xrange(numsamples):
        samplenames.append("Sample %d" % (i+1))
    
    plt.figure()
    

    p1=[]
    for i in xrange(numclones):
        if i==0:
            p2=plt.bar(ind, R[:,i], width, color=pseudocolor(i,0,N))
        else:
            p2=plt.bar(ind, R[:,i], width, color=pseudocolor(i,0,N), bottom=sum(R[:,0:i],axis=1))
        p1.append(p2)
    
    plt.ylabel('Fraction of sample')
    plt.title('Proportions of Clones in Samples')
    plt.xticks(ind+width/2., samplenames )
    plt.yticks(np.arange(0,1.1,0.1))
    plt.title(title)
    plt.legend( p1, clonenames )
    
    if filename=="":
        plt.show()
    else:
        pylab.savefig(filename)
        plt.close()

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
    
def generate_noisy_D(R,S, noise_std=0):
    D=R.dot(S)
    noise=0
    if noise_std > 0:
        noise=random.normal(0,noise_std,size=D.shape)
    
    D=D+noise
    return D
    
    
    
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


#!/usr/bin/env python

import plotting
reload(plotting)

import os
import shutil
import numpy
from numpy.linalg import *

os.environ[ 'MPLCONFIGDIR' ] = '/mnt/data/copycat/mplconfig/'

def plot_D(outdir,Dfilename):
    #########################################################################
    #### input D plotted for comparison to results                                                
    #########################################################################
    
    filename=Dfilename
    
    D_answer=plotting.loadmatrix(filename)
    plotting.plotcells(D_answer,filename="%s/D_answer.png" % (outdir))


def make_plots(outdir,Dfilename,numclones=0):
    numclones=int(numclones)
    if os.path.isdir(outdir)==False:
        print "Directory does not exist: %s" % outdir
        return
    
    print "Dfilename in make_plots.py: %s" % Dfilename
    #########################################################################
    ########   costs                                                
    #########################################################################
    
    filename="%s/costs.txt" % outdir
    if os.path.isfile(filename):
        costs = plotting.loadmatrix(filename)
        plotting.cost_value_plot(costs,filename="%s/costs.png" % outdir)
    print "Top solutions cost plot done"
    
    #########################################################################
    ########   input D plotted for comparison to results                                                
    #########################################################################
    print "Before plotting D"
    plot_D(outdir,Dfilename)
    print "After plotting D"
    #########################################################################
    ########   grab S and R, calculate D inferred from solutions                                         
    #########################################################################
    
    done = False
    num=2
    if numclones==0:
        num=2
    else:
        num=numclones
        
    while done==False:
        directory = "%s/%d_clones" % (outdir,num)
        if os.path.isdir(directory):
            print "%s is a directory" % directory
            list_done=False
            soln=0
            while list_done==False:
                #cost is only one number and doesn't need its own plot
                R=0
                S=0
                #grab R
                filename="%s/R_%d" % (directory,soln)    
                if os.path.exists(filename):  
                    print "%s is a file" % filename
                    R=plotting.loadmatrix(filename)
                    plotting.plot_R(R,filename="%s.png" % filename)
                else:
                    #print "%s is not a file" % filename
                    list_done=True
                #grab S
                filename="%s/S_%d" % (directory,soln)    
                if os.path.exists(filename):  
                    print "%s is a file" % filename
                    S=plotting.loadmatrix(filename)
                    plotting.plot_S(S, filename="%s.png" % filename)
                else:
                    #print "%s is not a file" % filename
                    list_done=True
                    
                #calculate inferred D
                    
                if list_done==False:
                    #D=R.dot(S)
                    D=numpy.dot(R,S)
                    filename="%s/D_%d" % (directory,soln) 
                    plotting.matrixtofile(D,filename,use_float=True)
                    plotting.plotcells(D,filename="%s.png" % filename)
                    
                soln+=1
            num+=1
            if numclones==0:
                done=True
        else:
            done=True
            #print "%s is not a directory" % directory
    



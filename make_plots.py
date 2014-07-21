#!/usr/bin/env python

import plotting
reload(plotting)

import os
import shutil 

def plot_D(outdir,Dfilename):
    #########################################################################
    ########   input D plotted for comparison to results                                                
    #########################################################################
    
    filename=Dfilename
    D_answer=plotting.loadmatrix(filename)
    plotting.plotcells(D_answer,filename="%s/D_answer.png" % (outdir))


def make_plots(outdir,Dfilename):
    if os.path.isdir(outdir)==False:
        print "Directory does not exist: %s" % outdir
        return
    
    
    
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
    
    plot_D(outdir,Dfilename)
    
    #########################################################################
    ########   grab S and R, calculate D inferred from solutions                                         
    #########################################################################
    
    done = False
    num=2
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
                    D=R.dot(S)
                    filename="%s/D_%d" % (directory,soln) 
                    plotting.matrixtofile(D,filename,use_float=True)
                    plotting.plotcells(D,filename="%s.png" % filename)
                    
                soln+=1
            num+=1
        else:
            done=True
            #print "%s is not a directory" % directory
    



#!/usr/bin/env python
import plotting
reload(plotting)
import deconvolve as dec
reload(dec)

import pylab
import numpy


import matplotlib.pyplot as plt
import shutil
import os
 
 
def test_deconvolve_from_file():
    
    Dfilename = "test1_D.txt"
    outdir = "user_data/testing/"
    subdir= "3_clones/"
    if not os.path.exists(outdir+Dfilename):
        shutil.copyfile(Dfilename,outdir+Dfilename)
    if not os.path.exists(outdir+subdir):
        os.makedirs(outdir+subdir)
    print Dfilename
   
    
    
    print outdir
    progress_file=outdir+"progress.txt"
    
    dec.run_deconvolve_from_file(outdir+Dfilename,outdir+subdir,numclones=3,progress_file="%sprogress.txt" % outdir,testing=True,general_directory="%s" % (outdir))
    
    
    
test_deconvolve_from_file()


def test_deconvolve():
    Dfilename = "test1_D.txt"
    outdir = "user_data/testing/"
    subdir= "3_clones/"
    if not os.path.exists(outdir+Dfilename):
        shutil.copyfile(Dfilename,outdir+Dfilename)
    if not os.path.exists(outdir+subdir):
        os.makedirs(outdir+subdir)
    print Dfilename
   
    
    
    print outdir
    progress_file=outdir+"progress.txt"
    




    costs,best_S,best_R,count_occurrence = dec.deconvolve(dec.loadmatrix(outdir+Dfilename), numclones=3, testing=True, max_falling_iterations=15,progress_file=progress_file,outdir=outdir)
    print costs.shape
    print best_S.shape
    print best_R.shape
    print min(costs)
    print costs
    print count_occurrence
#test_deconvolve()
    
def test2():
    A=[0.0]*10
    print A
    
    for i in xrange(10):
        A[i]=(10-i)*10.0
    A=numpy.array(A)
    print A
    index=numpy.argsort(A)
    print A[index]
    
    
#test2()
def test_arrays():
    A =numpy.zeros([10,3])
    print A
    print A.T
#test_arrays()

def plotting_test():
    #
    #D=plotting.loadmatrix("test1_D.txt")
    #R=plotting.loadmatrix("test1_R_answer.txt")
    #plotting.plot_R(R,filename="bar.png")
    #
    
    R=plotting.loadmatrix("user_data/003/5_clones/R_0")
    plotting.plot_R(R)
    
#plotting_test()
    


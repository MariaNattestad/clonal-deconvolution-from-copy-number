#!/usr/bin/env python
import deconvolve as dec
reload(dec)
import plotting
reload(plotting)
import pylab



import matplotlib.pyplot as plt
 
 
 
def test():
    #test1:
    filename = "test1_D.txt"
    print filename
    outdir = "user_data/29384234/"
    print outdir
    costs,allS = dec.run_deconvolve_from_file(filename,outdir,numclones=2,numtrials=100)
    
    
    
    
def plotting_test():
    
    D=plotting.loadmatrix("test1_D.txt")
    R=plotting.loadmatrix("test1_R_answer.txt")
    plotting.plot_R(R,filename="bar.png")
    
    
    
plotting_test()
    


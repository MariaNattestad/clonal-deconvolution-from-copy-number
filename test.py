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
    outdir = "user_data/yksbSYmai8lLaz8HnTHl/"
    print outdir
    costs,allS = dec.run_deconvolve_from_file(filename,outdir,numclones=2,progress_file="%sprogress.txt" % outdir,testing=True)
    
    
    
test ()


def plotting_test():
    #
    #D=plotting.loadmatrix("test1_D.txt")
    #R=plotting.loadmatrix("test1_R_answer.txt")
    #plotting.plot_R(R,filename="bar.png")
    #
    
    R=plotting.loadmatrix("user_data/003/5_clones/R_0")
    plotting.plot_R(R)
    
#plotting_test()
    


#!/usr/bin/env python
import deconvolve as dec
reload(dec)
import plotting

def test():
    #test1:
    filename = "test1_D.txt"
    print filename
    outdir = "user_data/29384234/"
    print outdir
    costs,allS = dec.run_deconvolve_from_file(filename,outdir,numclones=2,numtrials=100)
    
    
    
    
def plotting_test():
    D=plotting.loadmatrix("test1_D.txt")
    plotting.plot_S(D)
    savefig('foo.png')
    
plotting_test()
    


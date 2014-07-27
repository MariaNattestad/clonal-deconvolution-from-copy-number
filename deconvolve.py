#!/usr/bin/env python

### takes in a D and deconvolves it into R and S
from numpy import *
from scipy import *
from numpy.linalg import *
import numpy
import time
import os

def collect_costs(outdir):
	import os

	costs = dict()
	done = False
	num=2
	maxnum=0
	max_num_solns=0
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
					if (soln+1) > max_num_solns:
						max_num_solns=soln+1
				else:
					#print "%s is not a file" % filename
					list_done=True

				soln+=1
			
			costs[num]=cost_list
			maxnum=num+1
			num+=1
		else:
			done=True
			#print "%s is not a directory" % directory

	#f_costs=open("%s/costs.txt" % outdir,'w')
	#f_min_costs=open("%s/min_costs.txt" % outdir,'w')
	#
	#for i in xrange(2,maxnum+1):
	#	mylist=costs[i]
	#
	#	for j in xrange(len(mylist)):
	#		f_costs.write("%s\t" % (mylist[j]))
	#	f_costs.write("\n")
	#
	#	f_min_costs.write("%d,%s\n" % (i,mylist[0]))
	#f_costs.close()
	#
	#f_min_costs.close()
	#print "Collected costs in %s/costs.txt" % outdir
	
	f_costs=open("%s/costs.csv" % outdir,'w')
	
	header = "number of clones,cost of best model"
	for i in xrange(1,max_num_solns):
		header+=",cost of model %d" % (i+1)
	
	f_costs.write(header+"\n")
	for i in xrange(2,maxnum):
		f_costs.write("%d"% i )
		mylist=costs[i]
		
		for j in xrange(max_num_solns):
			if j < len(mylist):
				f_costs.write(",%s" % (mylist[j]))
			else:
				f_costs.write(",")
		f_costs.write("\n")
	f_costs.close()
	
	print "Collected costs in %s/costs.csv" % outdir
	

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

def run_deconvolve_from_file(filename,outdir,numclones=2,testing=False,progress_file="",general_directory="user_data/testing/"):
	
	import os
	if progress_file != "":
		print "Printing progress to %s" % progress_file
		
		if os.path.exists(progress_file)==False:
			f=open(progress_file,'w')
			f.write("")
			f.close()

	if testing=="False" or testing=="false":
		testing=False
	elif testing=="True" or testing=="true":
		testing=True
	else:
		print "Cannot understand testing=%s: expecting True/true or False/false" % testing


	D_input=loadmatrix(filename)
	print D_input.shape
	numclones = int(numclones)
	
	numsamples=D_input.shape[0]
	numbins=D_input.shape[1]
	
	costs,allS,allR,count_occurrence = deconvolve(D_input,numclones,testing=testing,progress_file=progress_file)
	#print best_R
	#print costs.shape
	#print allS.shape
	#
	#print "Unique costs"
	
	indices = costs.argsort()
	sorted_costs = costs[indices]
	sorted_S = allS[indices]
	sorted_R = allR[indices]

	print "length of solutions set: %d" % (len(sorted_costs))
	num_solns_to_display = 5
	if num_solns_to_display > len(sorted_costs):
		num_solns_to_display = len(sorted_costs)
		print "showing all solutions"
		
		

	#############################################
	########### check if outdir exists ##########
	#############################################
	import os
	if os.path.isdir(outdir)==False:
		print "Error in deconvolve.py: run_deconvolve_from_file(): outdir %s does not exist" % (outdir)
		return


	for i in xrange(num_solns_to_display):
		S = sorted_S[i]
		
		R = sorted_R[i]
		D=numpy.dot(R,S)
		
#		Write R to file
		f=open("%s/%d_clones_R_soln_%d.csv" % (outdir,numclones,i),'w')
		header="sample"
		
		for j in xrange(numclones):
			header+=",clone %d" % (j+1)
		f.write(header+"\n")
		for s in xrange(numsamples):
			line=R[s]
			f.write("%d" % (s+1))
			for c in xrange(numclones):
				f.write(",%.6f" % (line[c]))
			f.write("\n")
		f.close()
		
		
		S=S.T
		D=D.T
		D_input=D_input.T
		
		
		#		Write S to file
		f=open("%s/%d_clones_S_soln_%d.csv" % (outdir,numclones,i),'w')
		header="bins"
		
		for c in xrange(numclones):
			header+=",clone %d" % (c+1)
		f.write(header+"\n")
		for b in xrange(numbins):
			line=S[b]
			f.write("bin %d" % (b+1))
			for c in xrange(numclones):
				f.write(",%d" % (line[c]))
			f.write("\n")
		f.close()
		
		
		
		
		#		Write D to file
		f=open("%s/%d_clones_D_soln_%d.csv" % (outdir,numclones,i),'w')
		header="bins"
		
		for s in xrange(numsamples):
			header+=",sample %d" % (s+1)
		f.write(header+"\n")
		for b in xrange(numbins):
			line=D[b]
			f.write("bin %d" % (b+1))
			for s in xrange(numsamples):
				f.write(",%.6f" % (line[s]))
			f.write("\n")
		f.close()



##	Write D_input to file but only if it doesn't exist already

	D_input_filename="%s/D_input.csv" % (general_directory)
	if True: #os.path.exists(D_input_filename)==False:
		f=open(D_input_filename,'w')
		header="bins"
		
		for s in xrange(numsamples):
			header+=",sample %d" % (s+1)
		f.write(header+"\n")
		for b in xrange(numbins):
			line=D_input[b]
			f.write("bin %d" % (b+1))
			for s in xrange(numsamples):
				f.write(",%.6f" % (line[s]))
			f.write("\n")
		f.close()

#		
#		
#		
##		Write S to file
#		f=open("%s/%d_clones_S_soln_%d.csv" % (outdir,numclones,i),'w')
#		header="bins"
#		
#		for j in xrange(numbins):
#			header+=",%d" % (j+1)
#		f.write(header+"\n")
#		for c in xrange(numclones):
#			line=S[c]
#			f.write("clone %d" % (c+1))
#			for b in xrange(numbins):
#				f.write(",%d" % (line[b]))
#			f.write("\n")
#		f.close()
#		
#
##		Write D to file
#		f=open("%s/%d_clones_D_soln_%d.csv" % (outdir,numclones,i),'w')
#		header="bins"
#		
#		for j in xrange(numbins):
#			header+=",%d" % (j+1)
#		f.write(header+"\n")
#		for s in xrange(numsamples):
#			line=D[s]
#			f.write("sample %d" % (s+1))
#			for b in xrange(numbins):
#				f.write(",%.6f" % (line[b]))
#			f.write("\n")
#		f.close()
#		
##		Write D_input to file but only if it doesn't exist already
#
#		
#		D_input_filename="%s/D_input.csv" % (general_directory)
#		if os.path.exists(D_input_filename)==False:
#			f=open(D_input_filename,'w')
#			header="bins"
#			
#			for j in xrange(numbins):
#				header+=",%d" % (j+1)
#			f.write(header+"\n")
#			for s in xrange(numsamples):
#				line=D_input[s]
#				f.write("sample %d" % (s+1))
#				for b in xrange(numbins):
#					f.write(",%.6f" % (line[b]))
#				f.write("\n")
#			f.close()
#		

		f = open("%s/cost_%d" % (outdir,i),'w')
		f.write("%.10f" % sorted_costs[i])
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

def deconvolve(D, numclones, testing=False, max_falling_iterations=15,progress_file="",outdir=""):
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


	numtrials = 10000

	if numsources==4:
		numtrials = 50000
	if numsources==5:
		numtrials = 1000000
	if numsources > 5:
		print "CANNOT RUN WITH MORE THAN 5 CLONES. IT WOULD TAKE TOO LONG"
	if testing==True:
		numtrials=100

	print "running %d random initializations" % (numtrials)

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
	
	
	
	for i in xrange(numtrials):

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
		#	best_cost=cost
		#	best_R=R
		#	best_S=S
		
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
		
		
		
		
		
		if i==50:
			estimate=(time.time()-before)*numtrials/50.0
			print "estimated run-time for %d trials: %d seconds or %d minutes" % (numtrials,estimate,estimate/60.0)
		if (i+1) % (int(numtrials/100.0))==0:
			percent=(i+1)*100.0/numtrials
			
			print "progress: %d%%" % (percent)
			now=time.time()
			if now-last_update_time>1.0: #update every second
				print "updating progress.txt"
				last_update_time=time.time()
				f=open(progress_file,'a')
				f.write("clones\t%d\tprogress\t%d\n" % (numclones, i*100.0/numtrials))
				f.close()
			if outdir!="":
				filename="%s/abort" % (outdir)
				if os.path.exists(filename):
					i=numtrials
				
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

def tab_to_csv(filename):
	f = open(filename,'r')
	f2=open("%s.csv" % filename,'w')

	firstline=True
	for line in f:
		bare=line.strip()
		if (bare != ""):
			data=bare.split()

		csv_line=""
		for item in data:
			csv_line+=item + ","
		if firstline==True:
			f2.write(csv_line)
			firstline=False
		else:
			f2.write("\n%s" % (csv_line))

	f.close()
	f2.close()

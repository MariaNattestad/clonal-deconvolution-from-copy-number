<!DOCTYPE html>

<html>

<!--    NAVIGATION BAR-->
<?php include "header.html";?>
 
 
 <!--    TITLES   -->
<div id="header_bar" class="jumbotron">
    <h1>CopyCAT</h1>
    <h3>
        Copy number Clonal Analysis of Tumors
    </h3>
    </div>

<p>



<!--INSTRUCTIONS-->

<div class="center">
    <div class="panel panel-info">
      <div class="panel-heading">
	<h3 class="panel-title">Instructions</h3>
      </div>
      <div class="panel-body">
	<p>
	    Upload a text file containing copy number data of at least 2 samples from the same tumor. For a tumor made up of N clones, you need at least N samples to have enough information to distill the copy number profiles of those N clones. 
	</p>
	<p>
	    File format: One sample per line. Copy numbers separated by tabs or spaces across each line. Each sample should be separated into the same number of bins; therefore, the lines in the file should also have the same number of items. The number of bins across the genome should be approximately in the thousands for most reliable results.
	</p>
	<p>
	<strong> Example file:</strong>
	</p>
	<div class="highlight">
	    <pre>
1.977422    1.977422    1.977422    1.977422    1.977422    1.977422    1.977422    1.977422     .....->   
1.953893    1.953893    1.953893    1.953893    1.953893    1.953893    1.953893    1.953893     .....->   
1.989060    1.989060    1.989060    1.989060    1.989060    1.989060    1.989060    1.989060     .....->  
1.902800    1.902800    1.902800    1.902800    1.902800    1.902800    1.902800    1.902800     .....->
1.954846    1.954846    1.954846    1.954846    1.954846    1.954846    1.954846    1.954846     .....->
	    </pre>
	    <p>
		 5 samples, 5000 bins: example 1 from Examples menu above
	    </p>
	   
	</div>
	
	
	
	
      </div>
    </div>
  <!--</div><!-- /.col-sm-4 -->
  </div>
</p>



<div class="row">
    <div class="col-lg-6">
	<!--    DROPZONE   -->
	
	<div class="center"> 
	<form action="file_upload.php"
	    class="dropzone"
	    id="Dfile-dropzone">
	    <input type="hidden" name="code_hidden" value="">
	</form>
	
	<!--    SUBMIT BUTTON with hidden field to transport code to next page   -->
	<!--<form name="input_code_form" action="analysis.php" id="analysis_form" method="get">-->
	<!--<!--		<!--    set from within copycat.js-->
	<!--</form>-->
	<form name="input_code_form" action="run.php" id="analysis_form" method="post">
	<!--		<!--    set from within copycat.js-->
	</form>
	
	</div>  
	<p>
    </div>   
  
    <div class="col-lg-6">  
    <!--View analysis later-->
    
    
    <div id="codepanel" class="center">
	<div class="panel panel-info">
	  <div class="panel-heading">
	    <h3 class="panel-title">View analysis later</h3>
	  </div>
	  <div id="code" class="panel-body">
	  </div>
	</div>
      </div>
    </p>
    
    </div>
</div>
    
    
    

<!--scripts at the end of the file so they don't slow down the html loading-->
<script src="js/copycat.js"></script>
<script src="js/dropzone.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
    
</script>
</body>
</html>

<!DOCTYPE html>

<html>


<!--    NAVIGATION BAR-->
    <?php include "header.html";?>
    
    
    
<!--    GRAY AREA -- jumbotron   -->
    <div id="header_bar" class="jumbotron">
        
        <div class="row">
            <!--LEFT-->
            <div class="col-lg-6">
                <h1>CopyCAT</h1>
                <h3>
                    Copy number Clonal Analysis of Tumors
                </h3>
                <br/>
                <h3 id="status">
                    
                </h3>
            </div>   
             
            <!--RIGHT-->   
            <div class="col-lg-6">  
                <!--View analysis later-->
                
                
                
                <div id="codepanel" class="center">
                    <div class="panel panel-info">
                      <div class="panel-heading">
                        <h3 class="panel-title">View analysis later</h3>
                      </div>
                      <div id="code" class="panel-body">
                        <?php
                            $code=$_GET["code"];
                            $url="http://qb.cshl.edu/copycat/analysis.php?code=$code";
			    
                            echo "Return to view your results at any time: <input type=\"text\" class=\"form-control\" value=\"$url\"></input>";
                        ?>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!--centered middle of body-->
    <div class="center" id="landing_for_progress_bars">
<!--PROGRESS BARS-->
<!-- Made by copycat_analysis.js after consulting check_progress.php -->
    </div>
    <input type="hidden" value="0" id="best_solution">
	
	    
    <div class="center" id="landing_for_cost_plot" style="width:80%; margin-left:10%; margin-right:10%;">
    <!--COST PLOT-->
    </div>
	
    <div class = "center" id="results" style="visibility: hidden;">
	
	<div class="panel panel-info center">
	  <div class="panel-heading">
	    <h3 class="panel-title">Solution information</h3>
	  </div>
	  <div class="panel-body">
	    <div id="plot_info">
		While the program finishes running on all numbers of clones, you can look at the solutions we found so far. Click the buttons above when they turn green to see the results for each number of clones.
	    </div>
	  </div>
	  <a href="" download class="btn btn-primary" id="download_all_data"  role="button">Download all data from all solutions</a>
	</div>
	    
	
	<div class="thumbnail plot_frame"">
		<div id="landing_for_current_S" class="plot_img"></div>
		<div class="caption">
		<h2>Copy number profiles of clones</h3>
		<p>The copy number profiles of the clones that best reproduce the original input data.</p>
		<p><a href="" download class="btn btn-primary" id="down_img_S" role="button">Download plot image</a>
			<a href="" download class="btn btn-default" id="down_txt_S"  role="button">Download data file</a>
		</p>
		</div>
	
	</div>
	<div class="thumbnail plot_frame"">
		<div id="landing_for_current_R" class="plot_img"></div>
		<div class="caption">
		<h2>Ratios of clones per sample</h3>
		<p>The ratios of each clone in each sample, showing how each sample is a mixture of the clones.</p>
		<p><a href="" download class="btn btn-primary" id="down_img_R" role="button">Download plot image</a>
			<a href="" download class="btn btn-default" id="down_txt_R" role="button">Download data file</a>
		</p>
		</div>
	
	</div>

	
	
	
	    <div class="thumbnail plot_frame"">
		<div id="landing_for_current_D" class="plot_img"></div>
		<div class="caption">
		    <h2>Inferred sample profiles</h3>
		    <p>Copy number profiles of samples as inferred from the model. If the model is good, this should match the original input profiles very well.</p>
		    <p><a href="" download class="btn btn-primary" id="down_img_D" role="button">Download plot image</a>
			<a href="" download class="btn btn-default" id="down_txt_D" role="button">Download data file</a>
		    </p>
		</div>
	    
	    </div>
	
	
	   <div class="thumbnail plot_frame"">
		<div id="landing_for_answer_D" class="plot_img"></div>
		<div class="caption">
		    <h2>Input sample profiles</h3>
		    <p>Copy number profiles of samples directly from original input data (this is the same for all solutions).</p>
		    <p><a href="" download class="btn btn-primary" id="down_img_D_answer" role="button">Download plot image</a>
			<a href="" download class="btn btn-default" id="down_txt_D_answer" role="button">Download data file</a>
		    </p>
		</div>
	    
	    </div>
	
	

    
    </div>    <!--end of results-->
   
    </div>    <!--end of centered middle of body-->
    
    
    <div id="chart_cost"></div> <!--For experimenting with Google charts API-->
    <div id="chart_R"></div> <!--For experimenting with Google charts API-->
    <div id="chart_S"></div> <!--For experimenting with Google charts API-->
    <div id="chart_D"></div> <!--For experimenting with Google charts API-->
    
    
<!--   jquery must be first because bootstrap depends on it   -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/dygraph-combined.js"></script>
<script src="js/copycat_analysis.js"></script>

<script src="js/jquery.csv-0.71.min.js"></script>

<script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">

      // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart']});

    </script>



<div id="landing_for_D_diff"></div>
</body>
</html>





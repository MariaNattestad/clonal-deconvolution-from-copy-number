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
                            $url="http://localhost/copy_number/analysis.php?code=$code";
                            echo "Return to view your results at any time: <a href=\"$url\">$url</a>";
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
    
    <input type="hidden" id="alldone" value="false">
        
        
        
    <div class="center" id="landing_for_cost_plot">
    <!--COST PLOT-->
    <canvas id="cost_plot_canvas" height="400px" width="400px"></canvas>
    </div>
    

    <div class="center" id="landing_for_current_S">
        <!--S PLOT-->
        S
    </div>
    <div class="center" id="landing_for_current_R">
        <!--R PLOT-->
        R
    </div>
    <div class="center" id="landing_for_current_D">
        <!--D PLOT-->
        D
    </div>
    <div class="center" id="landing_for_answer_D">
        <!--S PLOT-->
        D_answer
    </div>
    
    
    
    
    
    
    
</div>
    
    
    
    
    
    
    <!--end of centered middle of body-->
    </div>   
    
<!--   jquery must be first because bootstrap depends on it   -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/dygraph-combined.js"></script>
<script src="js/copycat_analysis.js"></script>


</body>
</html>





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
    
    <p>
        
       <?php
        //    $code=$_GET["code"];
        //    echo $code;
        //    $filename="user_data/$code/info.txt";
        //    if (file_exists($filename)) {
        //        echo "<img class=\"cost_plot\" src=\"user_data/$code/costs.png\">";
        //        echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/S_0.png\">";
        //        echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/R_0.png\">";
        //        echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/D_0.png\">";
        //        echo "<img class=\"cost_plot\" src=\"user_data/$code/D_answer.png\">";
        //    }
        ?>
        
        
        
    </p>
    
    
    
    
    
</div>
    
    
    
    
    
    
    <!--end of centered middle of body-->
    </div>   
    
<!--   jquery must be first because bootstrap depends on it   -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
<script src="js/copycat_analysis.js"></script>
</body>
</html>





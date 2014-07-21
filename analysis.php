<!DOCTYPE html>

<html>


<!--    NAVIGATION BAR-->
    <?php include "header.html";?>
    
    
<!--    GRAY AREA -- jumbotron   -->
    <div id="header_bar" class="jumbotron">
        
        <div class="row">
            <!--LEFT-->
            <div class="col-lg-6">
                <h1>Copycat Results</h1>
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
    <div class="center">
<!--PROGRESS BAR-->
    <div class="progress" id="progress-bar">
        <div class="progress-bar progress-bar-striped active"  role="progressbar" aria-valuenow="0" aria-valuemin="10" aria-valuemax="100" style="width: 0%">
            2 clones 0%
        </div>
        <div class="progress-bar progress-bar-striped active"  role="progressbar" aria-valuenow="0" aria-valuemin="10" aria-valuemax="100" style="width: 0%">
            3 clones 0%
        </div>
    </div>
    <p>
        
        <?php
            $filename="user_data/$code/info.txt";
            if (file_exists($filename)) {
                echo "old query";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/costs.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/S_0.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/R_0.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/D_0.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/D_answer.png\">";
                
            } else {
                echo "new query: ";
                echo $code;
                echo "<p>";
                echo shell_exec("./prepare_copycat -c $code > prepare_copycat.log"); 
                echo shell_exec("./run_copycat -d -c $code > run_copycat.log &" );
                echo "</p>";
            }
        ?>
        
        
        
    </p>
    
    
    
    
    
    
</div>
    
    
    
    
    
    
    <!--end of centered middle of body-->
    </div>   
    
<!--   jquery must be first because bootstrap depends on it   -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="js/bootstrap.min.js"></script>
</body>
</html>





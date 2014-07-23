var analysis_path="http://localhost/copy_number/analysis.php?code=";

//var costChart;



//////////////////////////////////////////////////////////////
/////// For analysis page:
//////////////////////////////////////////////////////////////

function showProgress() {
    var run_id_code=getUrlVars()["code"];
    var prog=0;
    
//  remember ajax is asynchronous, so only the stuff inside the success: part will be called after retrieving information. If I put something after the statement, it can't use the info from check_progress.php because it is executed before this php script is called

    jQuery.ajax({ 
        type:"POST",
        url: "check_progress.php",
        dataType: 'json',
        data: {code: run_id_code},
        success: function (obj) {
            if ( !('error' in obj) ) {
                prog=obj;
                
                //alert(prog);
                //alert(prog.length);
                // prog is progress in percent
                
                var message = " ";
                var btn_colors=[];
                var colors=[];
                var alldone=true;
                
                for (i = 2; i < prog.length; i++) {
                    var disabled="disabled";
                    var active="active";
                    var success="progress-bar-striped";
                    if (prog[i]>=100) {
                        colors[i]="success";
                        btn_colors[i]="success";
                        disabled="";
                        active="";
                        success="progress-bar-success";
                    }
                    else if (prog[i]>=50) {
                        colors[i]="warning";
                        btn_colors[i]="default";
                        alldone=false;
                        console.log("alldone=false");
                        
                    }
                    else {
                        colors[i]="default";
                        btn_colors[i]="default";
                        alldone=false;
                        console.log("alldone=false");
                    }
                    
                    message = message + "<div class=\"row\"><div class=\"col-md-2\">     <button id=\"" + i + "_clones_button\" type=\"button\" class=\"" + disabled + " btn btn-" + btn_colors[i] + "\">"+ i +" clones</button></div>       <div class=\"col-lg-10\"><div class=\"progress\" id=\"progress-bar\"><div class=\"progress-bar " + success +" " + active + "\"  role=\"progressbar\" aria-valuenow=\"" + prog[i] + "\" aria-valuemin=\"5\" aria-valuemax=\"100\" style=\"width: " + prog[i] + "%\"><span id=\"progress_shown_values\">" + prog[i] + "%</span></div></div></div></div>";
                }
                
                
                
                document.getElementById("landing_for_progress_bars").innerHTML = message;
            }
            else {
                alert("ERROR in getting json data back from check_progress.php to copycat_analysis.js");
                console.log(obj.error);
                alert(obj.error);
                
            }
            
            
            
            if (alldone==true) {
                document.getElementById("alldone").value="true";
                
        
                document.getElementById("landing_for_progress_bars").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Analysis Complete!</strong> </div>';
                
                
                
            }
        }
        
    });
          
            
    var alldone=document.getElementById("alldone").value;
    if (alldone=="true") {
        
        
        document.getElementById("landing_for_answer_D").innerHTML = "ALL DONE";
    
        document.getElementById("landing_for_current_S").innerHTML = "<img class=\"S_plot\" src=\"user_data/$code/3_clones/S_0.png\">";
        document.getElementById("landing_for_current_R").innerHTML = "<img class=\"R_plot\" src=\"user_data/$code/3_clones/R_0.png\">";
        
        document.getElementById("landing_for_current_D").innerHTML = "D current";
        make_cost_plot()
       
    }
    else {
        setTimeout(function() {showProgress()},1000);
    }
    
    
    
}






function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function test() {
    var run_id_code=getUrlVars()["code"];
    alert(run_id_code);
}

$(document).ready(function() {showProgress();});


function repeat() {
    showProgress();
    alert(makeid());
    setTimeout(repeat(),3000);
}





function make_cost_plot() {
    
    var run_id_code=getUrlVars()["code"];
    
//    remember ajax is asynchronous, so only the stuff inside the success: part will be called after retrieving information. If I put something after the statement, it can't use the info from check_progress.php because it is executed before this php script is called

    jQuery.ajax({ 
        type:"POST",
        url: "grab_cost_data.php",
        dataType: 'json',
        data: {code: run_id_code},
        success: function (obj) {
            if ( !('error' in obj) ) {
                
                var array = [];
                var log_array=[];
                for (i=2;i < obj.length; ++i) {
                    array.push(obj[i]);
                    log_array.push(Math.log(obj[i]));
                } //remove the first two elements: 0 clones and 1 clone make no sense
                
                
                //var ctx = document.getElementById("cost_plot_canvas").getContext("2d");
                //var data = {
                //    labels: ["2 clones", "3 clones", "4 clones", "5 clones"],
                //datasets: [
                //    {
                //        label: "My Second dataset",
                //        fillColor: "rgba(151,187,205,0.2)",
                //        strokeColor: "rgba(151,187,205,1)",
                //        pointColor: "rgba(151,187,205,1)",
                //        pointStrokeColor: "#fff",
                //        pointHighlightFill: "#fff",
                //        pointHighlightStroke: "rgba(151,187,205,1)",
                //        data: log_array
                //    }
                //]
                //};
                //var options = {
                //    bezierCurve : false
                //};
                //costChart = new Chart(ctx).Line(data,options);
                //
                //
                //document.getElementById("cost_plot_canvas").onclick = function(evt) {
                //    var activePoints = costChart.getPointsAtEvent(evt);
                //    
                //    console.log(activePoints[0].label);
                //    
                //    
                //    
                //}

                
                g = new Dygraph(
                
                    // containing div
                    document.getElementById("landing_for_cost_plot"),
                
                    // CSV or path to a CSV file.
                    "user_data/"+run_id_code+"/min_costs.txt",
                    
                    {
                        animatedZooms: true,
                        title: "cost",
                        drawAxesAtZero: true,
                        includeZero: true,
                        fillGraph: true,
                        highlightCircleSize: 5,
                        pointClickCallback: function(event,point) {
                            alert(point.xval);
                        },
                        logscale: false,
                        drawPoints: true,
                        labels: ["clones","cost"],
                        xRangePad: 10,
                        yRangePad: 10,
                        
                        axisLineColor: "rgb(220, 220, 220)",
                        drawGrid: true,
                        gridLineColor: "rgb(220, 220, 220)",
                        xlabel: "Number of clones in tumor model",
                        ylabel: "cost (model vs data inaccuracy score)",
                        legend: "always",
                    }
                
                  );
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
            }
        }
    });
    
   
}










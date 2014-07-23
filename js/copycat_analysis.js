var analysis_path="http://localhost/copy_number/analysis.php?code=";





//////////////////////////////////////////////////////////////
/////// For analysis page:
//////////////////////////////////////////////////////////////

function showProgress() {
    var run_id_code=getUrlVars()["code"];
    var prog=0;
    
//    remember ajax is asynchronous, so only the stuff inside the success: part will be called after retrieving information. If I put something after the statement, it can't use the info from check_progress.php because it is executed before this php script is called

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
                
                
            }
        }
        
    });
          
            
    var alldone=document.getElementById("alldone").value;
    if (alldone=="true") {
         document.getElementById("landing_for_answer_D").innerHTML = "ALL DONE";
    
        document.getElementById("landing_for_cost_plot").innerHTML = "<img class=\"cost_plot\" src=\"user_data/$code/costs.png\">";
        document.getElementById("landing_for_current_S").innerHTML = "<img class=\"S_plot\" src=\"user_data/$code/3_clones/S_0.png\">";
        document.getElementById("landing_for_current_R").innerHTML = "<img class=\"R_plot\" src=\"user_data/$code/3_clones/R_0.png\">";
        
        document.getElementById("landing_for_current_D").innerHTML = "D current";
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




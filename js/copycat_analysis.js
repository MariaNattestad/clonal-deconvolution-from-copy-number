var analysis_path="http://localhost/copy_number/analysis.php?code=";





//////////////////////////////////////////////////////////////
/////// For analysis page:
//////////////////////////////////////////////////////////////

function showProgress() {
    var run_id_code=getUrlVars()["code"];
    var prog=0;
   
    
    jQuery.ajax({
        type:"POST",
        url: "check_progress.php",
        dataType: 'json',
        data: {code: run_id_code},
        success: function (obj, textstatus) {
            if ( !('error' in obj) ) {
                prog=obj.prog2;
                // prog is progress in percent
                document.getElementById("progress-bar").innerHTML = "<div class=\"progress-bar progress-bar-striped active\"  role=\"progressbar\" aria-valuenow=\"" + prog + "\" aria-valuemin=\"3\" aria-valuemax=\"100\" style=\"width: " + prog + "%\">" + prog + "%</div>";
            }
            else {
                alert("ERror");
                console.log(obj.error);
                alert(obj.error);
                
            }
        }
        
    });
    
    
    
    
    
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

$(document).ready(showProgress());

//setInterval(showProgress(),1000);





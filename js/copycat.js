var analysis_path="analysis.php?code="


//////////////////////////////////////////////////////////////
/////// For index page:
//////////////////////////////////////////////////////////////
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function showCode() {
    var code = makeid();
    var url = analysis_path + code
    document.getElementById("code").innerHTML = "Return to view your results at any time: <input type=\"text\" class=\"form-control\" value=\"http://qb.cshl.edu/copycat/" + url + "\"></input>";
    document.getElementById("analysis_form").innerHTML = '<input type="hidden" name="code" value="' + code + '"><button type="submit" id="submit_button" class="btn btn-lg btn-primary">Submit</button>';
    document.getElementById("analysis_form_testing").innerHTML = '<input type="hidden" name="code" value="' + code + '"><button type="submit" id="submit_button_testing" class="btn btn-lg btn-primary">Dry-run</button>';
    document.getElementById("Dfile-dropzone").innerHTML = '<input type="hidden" name="code_hidden" value=' + code + '>';
}

window.onload = showCode();




//////////////////////////////////////////////////////////////
/////// For analysis page:
//////////////////////////////////////////////////////////////
//function showProgress() {
//    var prog = 5;
//    document.getElementById("progress-bar").innerHTML = "<div class=\"progress-bar progress-bar-striped active\"  role=\"progressbar\" aria-valuenow=\"" + prog + "\" aria-valuemin=\"3\" aria-valuemax=\"100\" style=\"width: " + prog + "%\">" + prog + "%</div>";
//}
//
//window.onload = showProgress();
//
//

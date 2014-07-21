var analysis_path="http://localhost/copy_number/analysis.php?code="

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
    document.getElementById("code").innerHTML = "Return to view your results at any time: <a href=\"" + url + "\">" + url + "</a>";
    document.getElementById("analysis_form").innerHTML = '<input type="hidden" name="code" value="' + code + '"><button type="submit" id="submit_button" class="btn btn-lg btn-primary">Submit</button>';
    document.getElementById("Dfile-dropzone").innerHTML = '<input type="hidden" name="code_hidden" value=' + code + '>';
}

window.onload = showCode();


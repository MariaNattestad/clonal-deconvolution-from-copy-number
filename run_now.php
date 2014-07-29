<html>
    <body>
        
<?php
    $debug=""; //put -d here when testing
    
    
    if( !isset($_POST['code']) ) { echo 'ERROR: No code passed to run.php';}
    $code=$_POST["code"];
    $url="analysis.php?code=$code";
    $filename="user_uploads/$code";
    $oldmask = umask(0);
    mkdir("user_data/$code");
    umask($oldmask);
    
    echo shell_exec("./prepare_copycat -c $code &> user_data/$code/prepare_copycat.log"); 
    echo shell_exec("./run_copycat $debug -c $code &> user_data/$code/run_copycat.log &");
    header('Location: '.$url);
?>
    </body>
</html>

<form name="input_code_form" action="run.php" id="analysis_form" method="post">
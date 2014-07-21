<?php
    $aResult = array();
    if( !isset($_POST['code']) ) { $aResult['error'] = 'ERROR: No code passed to run.php';}
    $code=$_POST["code"];
    $url="http://localhost/copy_number/analysis.php?code=$code";
    
    echo shell_exec("./prepare_copycat -c $code > prepare_copycat.log"); 
    echo shell_exec("./run_copycat -d -c $code > run_copycat.log &" );
    json_encode($aResult);

    header("Location: $url");
    exit;
    

?>

  

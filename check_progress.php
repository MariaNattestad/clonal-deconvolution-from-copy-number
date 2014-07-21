<?php
    $code=$_POST['code'];
    //echo shell_exec("mkdir check_progress_php_was_called_code$code");
    
    $progress_stats = array();
    $progress_stats['prog2']=10;
    $progress_stats['prog3']=20;
    $progress_stats['prog4']=30;
    $progress_stats['prog5']=50;
    echo json_encode($progress_stats);
    
?>
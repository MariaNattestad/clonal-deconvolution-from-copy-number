<?php
    $code=$_POST['code'];
    
    $progress_stats = array();
    $progress_stats[0]=0;
    $progress_stats[1]=0;
    $progress_stats[2]=100;
    $progress_stats[3]=80;
    $progress_stats[4]=5;
    $progress_stats[5]=3;
    echo json_encode($progress_stats);
    
?>
<?php
    $code=$_POST['code'];
    
    $filename="user_data/" . $code . "/progress.txt";
    
    if (file_exists($filename)) {
        $myfile = fopen($filename, "r") or die("error");
        
        $progress_stats = array();
        $progress_stats[0]=0;
        $progress_stats[1]=0;
        $progress_stats[2]=0;
        $progress_stats[3]=0;
        $progress_stats[4]=0;
        $progress_stats[5]=0;
        
        while(!feof($myfile)) {
            $line=fgets($myfile);
            $line =trim(preg_replace( '/\s+/', ' ', $line ));
            if ($line=="" or $line==" ") {
                continue;
            }
            $array=array_map("trim",explode(' ',$line));
            //var_dump($array);
            //file_put_contents( 'yowtf5', print_r($array,true));
            $progress_stats[$array[1]]=$array[3];
        }
        fclose($myfile);
        
        
        echo json_encode($progress_stats);
    }
    else {
        $progress_stats = array();
        $progress_stats[0]='error';
        $progress_stats[1]='error';
        echo json_encode($progress_stats);
    }
    
    
    
?>
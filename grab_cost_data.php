<?php
    $code=$_POST['code'];
    
    $filename="user_data/" . $code . "/costs.txt";
    
    $myfile = fopen($filename, "r") or die("error");
    file_put_contents( 'yowtf8', print_r($filename,true));
    
    
    
    $data = array(0,0);
    
    $clone =2;
    while(!feof($myfile)) {
        $line=fgets($myfile);
        $line =trim(preg_replace( '/\s+/', ' ', $line ));
        if ($line=="" or $line==" ") {
            continue;
        }
        $array=array_map("trim",explode(' ',$line));
        //var_dump($array);
        
        $data[$clone]=$array[0];
        $clone=$clone+1;
    }
    fclose($myfile);
    file_put_contents( 'yowtf2', print_r($data,true));
    
    echo json_encode($data);
    
?>
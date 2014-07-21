<!DOCTYPE html>

<html>
<head>
    <title>Copycat</title>
</head>

<body>
    <p>
                
        <?php
            $code=$_GET["code"];
            echo $code;
            echo "<p>";
            echo shell_exec("./prepare_copycat -c $code" );
            echo shell_exec("./run_copycat -d -c $code" );
            echo "</p>";
        ?>
       
        
        
    </p>
</body>
</html>

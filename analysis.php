<!DOCTYPE html>

<html>
<head>
    <title>Copycat</title>
    <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="description" content="">
      <meta name="author" content="">
      <link rel="icon" href="../../favicon.ico">
      <title>Central Dogma</title>
      <!-- Bootstrap core CSS -->
      <link href="bootstrap.min.css" rel="stylesheet">
      <!-- Bootstrap theme -->
      <link href="bootstrap-theme.min.css" rel="stylesheet">
      <!-- Custom styles for this template -->
      <link href="theme.css" rel="stylesheet">
      <!-- <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css">
	 <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-theme.min.css"> -->
         
         
    <!--    custom styles-->
    <style>
        .jumbotron {margin-top:-20px; padding-top:10px;}
        .kitty_icon {width:50px; float:left; padding:4px 4px 4px 4px; margin-left:80px;}
    </style>
    <link rel="shortcut icon" type="image/png" href="images/cat_icon2_black.png"/>
    <link rel="icon" type="image/png" href="images/cat_icon2_black.png"/>
    
    
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>

<body role="document">

<!--    NAVIGATION BAR-->
    <?php include "header.html";?>
    
    
<!--    TITLES   -->
    <div id="header_bar" class="jumbotron">
    <h1>Copycat Results</h1>
    <h3 id="status">
        
    </h3>
    </div>
    <p>
       
       
         
        <?php
            $code=$_GET["code"];
///////////// check for if prep files already exist, otherwise run the algorithm /////////////
            
            $filename="user_data/$code/info.txt";
            if (file_exists($filename)) {
                echo "old query";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/costs.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/S_0.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/R_0.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/D_0.png\">";
                echo "<img class=\"cost_plot\" src=\"user_data/$code/D_answer.png\">";
                    
            } else {
                echo "new query: ";
                echo $code;
                echo "<p>";
                echo shell_exec("./prepare_copycat -c $code > prepare_copycat.log"); 
                echo shell_exec("./run_copycat -d -c $code > run_copycat.log &" );
                echo "</p>";
            
            }
        ?>
        
        
        
    </p>
    
<!--   jquery must be first because bootstrap depends on it   -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<script src="js/bootstrap.min.js"></script>

</body>
</html>





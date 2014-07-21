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

<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <img class="kitty_icon" src="images/cat_icon2_white.png"/>
      <div class="container">
        
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">     Copycat</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="./about">About</a></li>
            <li><a href="./contact">Contact</a></li>
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Examples <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="./analysis.php?code=axxMRHjn4p4PJOUfp6nC#">Example 1</a></li>
                <li><a href="#">Example 2</a></li>
                <li><a href="#">Example 3</a></li>
                <!--<li class="divider"></li>-->
                <!--<li class="dropdown-header">Nav header</li>-->
                <!--<li><a href="#">Separated link</a></li>-->
                <!--<li><a href="#">One more separated link</a></li>-->
              </ul>
            </li>
          </ul>
        </div><!--/.nav-collapse -->
      </div>
    </div>

    
    
    
<!--    TITLES   -->
    <div id="header_bar" class="jumbotron">
    <h1>Copycat Results</h1>
    <h3>Analysis complete!</h3>
    </div>
    <p>
        
        <?php
            $code=$_GET["code"];
///////////////////////////////////// check for if files already exist, otherwise run the algorithm ////////////////////
            //echo $code;
            //echo "<p>";
            //echo shell_exec("./prepare_copycat -c $code" );
            //echo shell_exec("./run_copycat -d -c $code" );
            //echo "</p>";
        ?>
       
       
        <?php
            echo "<img class=\"cost_plot\" src=\"user_data/$code/costs.png\">";
            echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/S_0.png\">";
            echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/R_0.png\">";
            echo "<img class=\"cost_plot\" src=\"user_data/$code/3_clones/D_0.png\">";
            echo "<img class=\"cost_plot\" src=\"user_data/$code/D_answer.png\">";
        ?>
        
        
        
    </p>
    
<!--   jquery must be first because bootstrap depends on it   -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<script src="js/bootstrap.min.js"></script>

</body>
</html>





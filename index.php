<!DOCTYPE html>

<html>
<head>
    <title>Copycat</title>
    <link href="css/dropzone.css" rel="stylesheet">
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
	 
      <style>
	.codepanel {
	    margin:150px 50px 50px 50px;
	}
	#submit_button {
	    
	    float:right;
	    margin: 40px 40px 40px 40px;
	    
	}
	
      </style>
</head>

<body>

 <?php include "header.html";?>
<div id="header_bar" class="jumbotron">
    <h1>CopyCAT</h1>
    <h3>
        Copy number Clonal Analysis of Tumors
    </h3>
    </div>
<form action="file_upload.php"
    class="dropzone"
    id="Dfile-dropzone">
    <input type="hidden" name="code_hidden" value="">
</form>


<form name="input_code_form" action="analysis.php" id="analysis_form" method="get">
<!--    set from within copycat.js-->
</form>

<p>
<!--<div class="col-lg-4">-->
<div class="codepanel">
    <div class="panel panel-info">
      <div class="panel-heading">
	<h3 class="panel-title">View analysis later</h3>
      </div>
      <div id="code" class="panel-body">
      </div>
    </div>
  <!--</div><!-- /.col-sm-4 -->
  </div>
</p>


    
    
    
    

<!--scripts at the end of the file so they don't slow down the html loading-->
<script src="js/copycat.js"></script>
<script src="js/dropzone.js"></script>

</script>
</body>
</html>

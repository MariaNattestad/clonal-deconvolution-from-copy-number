var analysis_path="analysis.php?code=";


//////////////////////////////////////////////////////////////
/////// For analysis page:
//////////////////////////////////////////////////////////////

function showProgress() {
    var run_id_code=getUrlVars()["code"];
    var prog=0;
    
//  remember ajax is asynchronous, so only the stuff inside the success: part will be called after retrieving information. If I put something after the statement, it can't use the info from check_progress.php because it is executed before this php script is called
    //alert('before ajax');
    jQuery.ajax({ 
        type:"POST",
        url: "check_progress.php",
        dataType: 'json',
        data: {code: run_id_code},
        success: function (obj) {
            //alert("inside success");
            //alert(obj);
            prog=obj;
            if (prog[0]!='error') {
                
                //alert("no error in object");
                //
                //alert(prog);
                //alert(prog.length);
                // prog is progress in percent
                
                var message = " ";
                var btn_colors=[];
                var colors=[];
                var alldone=true;
                
                
                for (i =2; i < prog.length; i++) {
                    var disabled="disabled";
                    var active="active";
                    var success="progress-bar-striped";
                    if (prog[i]>=100) {
                        colors[i]="success";
                        btn_colors[i]="success";
                        disabled="";
                        active="";
                        success="progress-bar-success";
                    }
                    else if (prog[i]>=50) {
                        colors[i]="warning";
                        btn_colors[i]="default";
                        alldone=false;
                        console.log("alldone=false");
                        
                    }
                    else {
                        colors[i]="default";
                        btn_colors[i]="default";
                        alldone=false;
                        console.log("alldone=false");
                    }
                    
                    message = message + "<div class=\"row\"><div class=\"col-md-2\">     <button id=\"" + i + "_clones_button\" type=\"button\" class=\"" + disabled + " btn btn-" + btn_colors[i] + "\" onclick=\"model_selected("+ i + ",0)\">"+ i +" clones</button></div>       <div class=\"col-lg-10\"><div class=\"progress\" id=\"progress-bar\"><div class=\"progress-bar " + success +" " + active + "\"  role=\"progressbar\" aria-valuenow=\"" + prog[i] + "\" aria-valuemin=\"5\" aria-valuemax=\"100\" style=\"width: " + prog[i] + "%\"><span id=\"progress_shown_values\">" + prog[i] + "%</span></div></div></div></div>";
                    document.getElementById("landing_for_progress_bars").innerHTML = message;
                }
                
                
                
                
                if (alldone==true) {
                    
                    check_costs_exist(0);
                    
                }
                else {
                    
                    setTimeout(function() {showProgress()},1000);
                }
                
            }
            else {
                //alert("ERROR in getting json data back from check_progress.php to copycat_analysis.js");
                
                document.getElementById("landing_for_progress_bars").innerHTML = '<div class="alert alert-danger" role="alert"><strong>No analysis exists with that code. Please check the url or upload your file again.</strong> </div>';
                
                document.getElementById("results").innerHTML="";
                
            }
            
            
            
            
        }
        
    });

}


function check_costs_exist(counter)
{
    
    var run_id_code=getUrlVars()["code"];
    var cost_url="user_data/"+run_id_code + "/costs.csv";
    
    
    if (counter>100) {
        alert("Taking too long to find "+ cost_url + " counter: " + counter);
    }
    else {
        
        jQuery.ajax({ 
            url: cost_url,
            error: function() {
                console.log(counter+1);
                setTimeout(function(){check_costs_exist(counter+1);},500);
                
            },
            success: function () {
                //alert("inside success");
                create_cost_plot();
                
                document.getElementById("landing_for_progress_bars").innerHTML = '<div class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button><strong>Analysis Complete!</strong> </div>';
                
                document.getElementById("download_all_data").href = "./user_data/"+run_id_code+"/copycat_data_"+ run_id_code + ".zip";
            }
        });
        
    }
}


//function makeid()
//{
//    var text = "";
//    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//
//    for( var i=0; i < 20; i++ )
//        text += possible.charAt(Math.floor(Math.random() * possible.length));
//
//    return text;
//}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function test() {
    var run_id_code=getUrlVars()["code"];
    alert(run_id_code);
}



////for testing only
//function repeat() {
//    showProgress();
//    alert(makeid());
//    setTimeout(repeat(),3000);
//}




//
//function cost_plot_clicked(numclones) {
//    
//    
//    var beginning = '<img src="';
//    var ending = '" class="plot_img">';
//    var run_id_code=getUrlVars()["code"];
//    var filepath = "user_data/" + run_id_code + "/" + numclones + "_clones/";
//   
//    var num_soln=0;
//    
//    
//    
//    var filename="S_" + num_soln + ".png";
//    document.getElementById("landing_for_current_S").innerHTML = beginning+filepath + filename+ending;
//    document.getElementById("down_txt_S").href = "./user_data/"+ run_id_code + "/" + numclones +"_clones/S_"+num_soln;
//    document.getElementById("down_img_S").href = "./user_data/"+ run_id_code + "/" + numclones +"_clones/S_"+num_soln+".png";
//    
//    
//    
//    var filename="R_" + num_soln + ".png";
//    document.getElementById("landing_for_current_R").innerHTML = beginning+filepath + filename+ending;
//    document.getElementById("down_txt_R").href = "./user_data/"+ run_id_code + "/" + numclones +"_clones/R_"+num_soln;
//    document.getElementById("down_img_R").href = "./user_data/"+ run_id_code + "/" + numclones +"_clones/R_"+num_soln+".png";
//    
//    
//    
//    var filename="D_" + num_soln + ".png";
//    document.getElementById("landing_for_current_D").innerHTML = beginning+filepath + filename+ending;
//    document.getElementById("down_txt_D").href = "./user_data/"+ run_id_code + "/" + numclones +"_clones/D_"+num_soln;
//    document.getElementById("down_img_D").href = "./user_data/"+ run_id_code + "/" + numclones +"_clones/D_"+num_soln+".png";
//    
//    
//    
//    var filepath = "user_data/" + run_id_code + "/";
//    var filename="D_answer.png";
//    document.getElementById("landing_for_answer_D").innerHTML = beginning+filepath + filename+ending;
//    document.getElementById("down_txt_D_answer").href = "./user_data/"+ run_id_code + "/D.txt";
//    document.getElementById("down_img_D_answer").href = "./user_data/"+ run_id_code + "/D_answer.png";
//    
//    
//    document.getElementById("results").style.visibility= 'visible';
//}
//
//
//
//
//function make_cost_plot() {
//    var run_id_code=getUrlVars()["code"];
//    
//
//    
//    g = new Dygraph(
//                
//        // containing div
//        document.getElementById("landing_for_cost_plot"),
//    
//        // CSV or path to a CSV file.
//        "user_data/"+run_id_code+"/min_costs.txt",
//        {
//            animatedZooms: true,
//            title: "Click a point to see the solution",
//            drawAxesAtZero: true,
//            includeZero: true,
//            fillGraph: true,
//            highlightCircleSize: 5,
//            pointClickCallback: function(event,point) {
//                cost_plot_clicked(point.xval);
//            },
//            logscale: true,
//            drawPoints: true,
//            labels: ["clones","cost"],
//            xRangePad: 10,
//            yRangePad: 40,
//            
//            axisLineColor: "rgb(220, 220, 220)",
//            drawGrid: true,
//            gridLineColor: "rgb(220, 220, 220)",
//            xlabel: "Number of clones in tumor model",
//            ylabel: "cost (model vs data inaccuracy score)",
//            axes: {
//                x: {
//                    axisLabelFormatter: function(x) {
//                        if (x==Math.floor(x)) {
//                            return x;
//                        }
//                        else {
//                            return "";
//                        }
//                        
//                    }
//                },
//                y: {
//                    
//                }
//            }
//            
//        }
//    );
//    
//    //    remember ajax is asynchronous, so only the stuff inside the success: part will be called after retrieving information. If I put something after the statement, it can't use the info from check_progress.php because it is executed before this php script is called
//    
//    jQuery.ajax({
//        type:"POST",
//        url: "grab_cost_data.php",
//        dataType: 'json',
//        data: {code: run_id_code},
//        success: function (obj) {
//            
//            if ( !('error' in obj) ) {
//                
//                var array = [];
//                var log_array=[];
//                
//                for (i=2;i < obj.length; ++i) {
//                    array.push(obj[i]);
//                    log_array.push(Math.log(obj[i]));
//                } //remove the first two elements: 0 clones and 1 clone make no sense
//                
//                
//                
//               
//                var index = argmin(array);
//                numclones=index+2;
//                
//                cost_plot_clicked(numclones);
//                document.getElementById("plot_info").innerHTML = "<p><strong>Best solution: Tumor is made up of "+ numclones+" clones</strong></p><p>The model with " + numclones + " clones has the lowest cost (inaccuracy score) of "+ array[index]+ ".</p><p>View the solutions for other numbers of clones by clicking on a point on the plot.</p>";
//                document.getElementById("best_solution").value=numclones;
//                
//                
//            }
//        }
//    });
//}


function argmin(array) {
    var min = parseFloat(array[0]);
    var minIndex = 0;

    for (var i = 1; i < array.length; i++) {
       
        if (parseFloat(array[i]) < min) {
            minIndex = i;
            min = array[i];
        }
    }
    return minIndex;

}






/////////////////////////////////////////////////////////////////////////
///////////////////  new plots using Google API  ////////////////////////
/////////////////////////////////////////////////////////////////////////

function create_cost_plot(){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/costs.csv";
    console.log(filename)
    
    // grab the CSV
   $.get(filename, function(csvString) {
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        console.log("COST DATA:")
        
        console.log(arrayData);
        console.log(arrayData.length);
        
        
        var candidates=[];
        for (i=1; i<arrayData.length; i++){
            console.log(arrayData[i][1]);
            candidates.push(arrayData[i][1]);
        }
        
        console.log(candidates);
        
        console.log(argmin(candidates))
        index=argmin(candidates)
        
        numclones=index+2;
        
        
        console.log(numclones);
        
        
        document.getElementById("plot_info").innerHTML = "<p><strong>Best solution: Tumor is made up of "+ numclones+" clones</strong></p><p>The model with " + numclones + " clones has the lowest cost (inaccuracy score) of "+ candidates[index]+ ".</p><p>View the solutions for other numbers of clones by clicking on a point on the plot.</p>";
        document.getElementById("best_solution").value=numclones;
        
        
        model_selected(numclones,0);
        document.getElementById("results").style.visibility= 'visible';


        
        // this new DataTable object holds all the data
        var data = new google.visualization.arrayToDataTable(arrayData);
        
        
        
        
        console.log(data);
        // this view can select a subset of the data at a time
        var view = new google.visualization.DataView(data);
        view.setColumns([0,1]);
        
        // set chart options
        var options = {
            title: "Best solutions: Lower cost means better model. If adding an extra clone to the analysis does not really decrease the cost, then sticking with a simpler model is the best choice.",
            hAxis: {title: data.getColumnLabel(0), minValue: data.getColumnRange(0).min-.1, maxValue: data.getColumnRange(0).max+.1,ticks: [2,3,4,5] },
            vAxis: {title: data.getColumnLabel(1), minValue: 0, maxValue: (data.getColumnRange(1).max)*2,logScale: true},
            legend: 'none',
            lineWidth: 4,
            pointSize: 10,
            
            
        };
        
        // create the chart object and draw it
        var chart = new google.visualization.LineChart(document.getElementById('landing_for_cost_plot'));
        
        // The select handler. Call the chart's getSelection() method
        function selectHandler() {
            var selectedItem = chart.getSelection()[0];
            if (selectedItem) {
                
                var value = data.getValue(selectedItem.row, 0);
                model_selected(value,0); // so numclones=value, num_soln=0 (best solution)
            }
        }
        
        // Listen for the 'select' event, and call my function selectHandler() when
        // the user selects something on the chart.
        google.visualization.events.addListener(chart, 'select', selectHandler);
        
        chart.draw(view, options);
        
    });
   
    
}




function model_selected(numclones,num_soln) {
    document.getElementById("results").style.visibility= 'visible';
  
    
    create_S_plot(numclones,num_soln);
    
    create_R_plot(numclones,num_soln);
    
    create_D_plot(numclones,num_soln);
    
    create_D_input_plot();
    
}


function create_S_plot(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_S_soln_"+num_soln+".csv";
    console.log(filename)
    

    //grab the CSV
    $.get(filename, function(csvString) {
        var before=new Date().getTime();
    
        
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        
        // this new DataTable object holds all the data
        var data = new google.visualization.arrayToDataTable(arrayData);
        
        // this view can select a subset of the data at a time
        var view = new google.visualization.DataView(data);
        view.setColumns([0,1]);
        
        var v_ticks=[]
        var v_tick_max=Math.ceil(data.getColumnRange(1).max)
        for (i=0; i<v_tick_max+2; i++){
            v_ticks.push(i);
        }
        
        // set chart options
        var options = {
            //width: 600,
            //height: 400,
            legend: { position: 'top', maxLines: 3 },
            bar: { groupWidth: '75%' },
            isStacked: false,
            areaOpacity: 0.0,
            //connectSteps: false,
            hAxis: {title: data.getColumnLabel(0)},
            vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max, ticks: v_ticks},
        };
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("Create_S_plot took "+ millis + " milliseconds to get data from file");
        before=now;
        
        var chart = new google.visualization.SteppedAreaChart(document.getElementById('landing_for_current_S'));
        chart.draw(data, options);
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("Create_S_plot took "+ millis + " milliseconds to draw the chart");
        
        
    });

    
}



function create_D_plot(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_D_soln_"+num_soln+".csv";
    console.log(filename)
    
    var before=new Date().getTime();


    //grab the CSV
    //grab the CSV
    $.get(filename, function(csvString) {
    // transform the CSV string into a 2-dimensional array
    var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
    
    
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    var v_ticks=[]
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    for (i=0; i<v_tick_max+2; i++){
        v_ticks.push(i);
    }
    
    // set chart options
    var options = {
        //width: 600,
        //height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: false,
        areaOpacity: 0.0,
        //connectSteps: false,
        hAxis: {title: data.getColumnLabel(0)},
        vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max+2, ticks: v_ticks},
    };
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_D_plot took "+ millis + " milliseconds to get data from file");
    before=now;

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('landing_for_current_D'));
    chart.draw(data, options);
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_D_plot took "+ millis + " milliseconds to draw the chart");

    });

   
    
}

function create_D_input_plot(){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/D_input.csv";
    console.log(filename)
    
    var before=new Date().getTime();


    //grab the CSV
    //grab the CSV
    $.get(filename, function(csvString) {
    // transform the CSV string into a 2-dimensional array
    var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
    
   
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    var v_ticks=[]
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    for (i=0; i<v_tick_max+2; i++){
        v_ticks.push(i);
    }
    
    // set chart options
    var options = {
        //width: 600,
        //height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: false,
        areaOpacity: 0.0,
        //connectSteps: false,
        hAxis: {title: data.getColumnLabel(0)},
        vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max+2, ticks: v_ticks},
    };
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_D_input_plot took "+ millis + " milliseconds to get data from file");
    before=now;

    var chart = new google.visualization.SteppedAreaChart(document.getElementById('landing_for_answer_D'));
    chart.draw(data, options);
    
    
        
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_D_input_plot took "+ millis + " milliseconds to draw the chart");

    });

    
}



function create_R_plot(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_R_soln_"+num_soln+".csv";
    
    console.log(filename)
    var before=new Date().getTime();

    
    //grab the CSV
    $.get(filename, function(csvString) {
    // transform the CSV string into a 2-dimensional array
    var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
    
    
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    // set chart options
    var options = {
        //width: 600,
        //height: 400,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        hAxis: {title: data.getColumnLabel(0)},
        vAxis: {title: "fraction of sample"},
    };
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_R_plot took "+ millis + " milliseconds to get data from file");
    before=now;

    var chart = new google.visualization.ColumnChart(document.getElementById('landing_for_current_R'));
    chart.draw(data, options);
    
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_R_plot took "+ millis + " milliseconds to draw the chart");


    });

}

$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 500);
});

//redraw graph when window resize is completed  
$(window).on('resizeEnd', function() {
    console.log("resizing")
});




//
//
$(document).ready(function() {showProgress();});
////
//
//$(document).ready(function() {create_cost_plot();});
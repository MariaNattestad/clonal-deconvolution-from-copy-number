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
                        ready_input();
                        ready_solution(i,0);
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
        
        var candidates=[];
        for (i=1; i<arrayData.length; i++){
            
            candidates.push(arrayData[i][1]);
        }
        
        index=argmin(candidates)
        
        numclones=index+2;
        
        document.getElementById("plot_info").innerHTML = "<p><strong>Best solution: Tumor is made up of "+ numclones+" clones</strong></p><p>The model with " + numclones + " clones has the lowest cost (inaccuracy score) of "+ candidates[index]+ ".</p><p>View the solutions for other numbers of clones by clicking on a point on the plot.</p>";
        document.getElementById("best_solution").value=numclones;
        
        
        model_selected(numclones,0);
        document.getElementById("results").style.visibility= 'visible';
        
        
        // this new DataTable object holds all the data
        var data = new google.visualization.arrayToDataTable(arrayData);
        
        
     
        // this view can select a subset of the data at a time
        var view = new google.visualization.DataView(data);
        view.setColumns([0,1]);
        
        // set chart options
        var options = {
            height: cost_height,
            width: cost_width,
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
  
    create_all_plots(numclones,num_soln);
    //create_S_plot(numclones,num_soln);
    //
    //create_R_plot(numclones,num_soln);
    //
    //create_D_plot(numclones,num_soln);
    //
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
        
         if (typeof solutions=='undefined') {
            console.log("No solutions loaded previously");
            solutions=[];
            solutions[numclones] = {D: [],R: [], S: []};
        }
        else if (typeof solutions[numclones]=='undefined') {
            solutions[numclones] = {D: [],R: [], S: []};
        }
        
        solutions[numclones].D=arrayData;
        
        plot_S_from_array(arrayData);
        //
        //// this new DataTable object holds all the data
        //var data = new google.visualization.arrayToDataTable(arrayData);
        //
        //// this view can select a subset of the data at a time
        //var view = new google.visualization.DataView(data);
        //view.setColumns([0,1]);
        //
        //var v_ticks=[]
        //var v_tick_max=Math.ceil(data.getColumnRange(1).max)
        //for (i=0; i<v_tick_max+2; i++){
        //    v_ticks.push(i);
        //}
        //
        //// set chart options
        //var options = {
        //    //width: 600,
        //    //height: 400,
        //    legend: { position: 'top', maxLines: 3 },
        //    bar: { groupWidth: '75%' },
        //    isStacked: false,
        //    areaOpacity: 0.0,
        //    //connectSteps: false,
        //    hAxis: {title: data.getColumnLabel(0)},
        //    vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max, ticks: v_ticks},
        //};
        //
        //var now=new Date().getTime();
        //var millis=now-before;
        //console.log("Create_S_plot took "+ millis + " milliseconds to get data from file");
        //before=now;
        //
        //var chart = new google.visualization.SteppedAreaChart(document.getElementById('landing_for_current_S'));
        //chart.draw(data, options);
        //
        //var now=new Date().getTime();
        //var millis=now-before;
        //console.log("Create_S_plot took "+ millis + " milliseconds to draw the chart");
        //
        
    });

    
}

function plot_S_from_array(arrayData) {
    
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    var h_tick_max=Math.ceil(data.getColumnRange(0).max)
    
    // set chart options
    var options = DS_options(v_tick_max,h_tick_max);
    //var options = {
    //    width: DS_width,
    //    height: DS_height,
    //    legend: { position: 'top', maxLines: 3 },
    //    bar: { groupWidth: '75%' },
    //    isStacked: false,
    //    areaOpacity: 0.0,
    //    //connectSteps: false,
    //    hAxis: {title: data.getColumnLabel(0)},
    //    vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max, ticks: v_ticks},
    //};
    
    var before=new Date().getTime();
  
    
    var chart_div = document.getElementById('landing_for_current_S')
    var chart = new google.visualization.SteppedAreaChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
    });
    chart.draw(data, options);
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_S_plot took "+ millis + " milliseconds to draw the chart");
    
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
        
        if (typeof solutions=='undefined') {
            console.log("No solutions loaded previously");
            solutions=[];
            solutions[numclones] = {D: [],R: [], S: []};
        }
        else if (typeof solutions[numclones]=='undefined') {
            solutions[numclones] = {D: [],R: [], S: []};
        }
        
        solutions[numclones].D=arrayData;
        
        plot_D_from_array(arrayData);
        //// this new DataTable object holds all the data
        //var data = new google.visualization.arrayToDataTable(arrayData);
        //
        //// this view can select a subset of the data at a time
        //var view = new google.visualization.DataView(data);
        //view.setColumns([0,1]);
        //
        //var v_ticks=[]
        //var v_tick_max=Math.ceil(data.getColumnRange(1).max)
        //for (i=0; i<v_tick_max+2; i++){
        //    v_ticks.push(i);
        //}
        //
        //// set chart options
        //var options = {
        //    //width: 600,
        //    //height: 400,
        //    legend: { position: 'top', maxLines: 3 },
        //    bar: { groupWidth: '75%' },
        //    isStacked: false,
        //    areaOpacity: 0.0,
        //    //connectSteps: false,
        //    hAxis: {title: data.getColumnLabel(0)},
        //    vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max+2, ticks: v_ticks},
        //};
        //
        //
        //var now=new Date().getTime();
        //var millis=now-before;
        //console.log("Create_D_plot took "+ millis + " milliseconds to get data from file");
        //before=now;
        //
        //var chart = new google.visualization.SteppedAreaChart(document.getElementById('landing_for_current_D'));
        //chart.draw(data, options);
        //
        //var now=new Date().getTime();
        //var millis=now-before;
        //console.log("Create_D_plot took "+ millis + " milliseconds to draw the chart");

    });    
}


function plot_D_from_array(arrayData) {
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    var h_tick_max=Math.ceil(data.getColumnRange(0).max)
    
    // set chart options
    var options = DS_options(v_tick_max,h_tick_max);
    //var options = {
    //    width: DS_width,
    //    height: DS_height,
    //    legend: { position: 'top', maxLines: 3 },
    //    bar: { groupWidth: '75%' },
    //    isStacked: false,
    //    areaOpacity: 0.0,
    //    //connectSteps: false,
    //    hAxis: {title: data.getColumnLabel(0)},
    //    vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max+2, ticks: v_ticks},
    //};
    //
    
    var before=new Date().getTime();

    
    var chart_div = document.getElementById('landing_for_current_D')
    var chart = new google.visualization.SteppedAreaChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
    });
        
        
    chart.draw(data, options);
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_D_plot took "+ millis + " milliseconds to draw the chart");

}


function create_D_input_plot(){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/D_input.csv";
    console.log(filename)
    
    var before=new Date().getTime();

    if (typeof input_D == 'undefined') {
        console.log("input_D has not been loaded previously, grabbing it from file.")
        
        $.get(filename, function(csvString) {
            // transform the CSV string into a 2-dimensional array
            var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
            
           
            input_D=arrayData;
            
            var now=new Date().getTime();
            var millis=now-before;
            console.log("Create_D_input_plot took "+ millis + " milliseconds to get data from file");
            before=now;
            
            
            create_D_input_plot_from_array();
            
            
            var now=new Date().getTime();
            var millis=now-before;
            console.log("Create_D_input_plot took "+ millis + " milliseconds to draw the chart");
            
            
        });
        
    }
    else {
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("Create_D_input_plot took "+ millis + " milliseconds to get data from global variable");
        before=now;
        
        create_D_input_plot_from_array();
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("Create_D_input_plot took "+ millis + " milliseconds to draw the chart");
        
    }
    
    
}



function create_D_input_plot_from_array() {
    
    arrayData=input_D; //input_D is global 
    
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    var h_tick_max=Math.ceil(data.getColumnRange(0).max)
    
    // set chart options
    var options = DS_options(v_tick_max,h_tick_max);
    //var options = {
    //    width: DS_width,
    //    height: DS_height,
    //    legend: { position: 'top', maxLines: 3 },
    //    bar: { groupWidth: '75%' },
    //    isStacked: false,
    //    areaOpacity: 0.0,
    //    //connectSteps: false,
    //    hAxis: {title: data.getColumnLabel(0)},
    //    vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max+2, ticks: v_ticks},
    //};
    
    var chart_div = document.getElementById('landing_for_answer_D')
    var chart = new google.visualization.SteppedAreaChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
    });
        
    chart.draw(data, options);
    
    

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
        
         if (typeof solutions=='undefined') {
            console.log("No solutions loaded previously");
            solutions=[];
            solutions[numclones] = {D: [],R: [], S: []};
        }
        else if (typeof solutions[numclones]=='undefined') {
            solutions[numclones] = {D: [],R: [], S: []};
        }
        
        solutions[numclones].R=arrayData;
        
        plot_R_from_array(arrayData);
        //// this new DataTable object holds all the data
        //var data = new google.visualization.arrayToDataTable(arrayData);
        //
        //// this view can select a subset of the data at a time
        //var view = new google.visualization.DataView(data);
        //view.setColumns([0,1]);
        //
        //// set chart options
        //var options = {
        //    //width: 600,
        //    //height: 400,
        //    legend: { position: 'top', maxLines: 3 },
        //    bar: { groupWidth: '75%' },
        //    isStacked: true,
        //    hAxis: {title: data.getColumnLabel(0)},
        //    vAxis: {title: "fraction of sample"},
        //};
        //
        //var now=new Date().getTime();
        //var millis=now-before;
        //console.log("Create_R_plot took "+ millis + " milliseconds to get data from file");
        //before=now;
        //
        //var chart = new google.visualization.ColumnChart(document.getElementById('landing_for_current_R'));
        //chart.draw(data, options);
        //
        //
        //
        //var now=new Date().getTime();
        //var millis=now-before;
        //console.log("Create_R_plot took "+ millis + " milliseconds to draw the chart");


    });

}

function plot_R_from_array(arrayData) {
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    // set chart options
    var options = {
        width: R_width,
        height: R_height,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,
        hAxis: {title: data.getColumnLabel(0)},
        vAxis: {title: "fraction of sample"},
    };
    
    var before=new Date().getTime();
    
    var chart_div = document.getElementById('landing_for_current_R')
    var chart = new google.visualization.ColumnChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
        console.log(chart_div.innerHTML);
    });
        
    chart.draw(data, options);
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_R_plot took "+ millis + " milliseconds to draw the chart");

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


function ready_solution(numclones,num_soln) {
    if (typeof solutions=='undefined') {
        console.log("No solutions loaded previously");
        solutions=[];
    }
    solutions[numclones] = {D: [],R: [], S: []};
   
    var run_id_code=getUrlVars()["code"];
    
    
    
    ////////////   D   /////////////////
    var D_filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_D_soln_"+num_soln+".csv";
    var before=new Date().getTime();
    $.get(D_filename, function(csvString) {
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        
        solutions[numclones].D = arrayData;
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("D: ready_solution took "+ millis + " milliseconds to get data from file");
        
    });
    
    ////////////   R   /////////////////
    var R_filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_R_soln_"+num_soln+".csv";
    var before=new Date().getTime();
    $.get(R_filename, function(csvString) {
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        
        solutions[numclones].R = arrayData;
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("R: ready_solution took "+ millis + " milliseconds to get data from file");
        
    });
    
    ////////////   S   /////////////////
    var S_filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_S_soln_"+num_soln+".csv";
    var before=new Date().getTime();
    $.get(S_filename, function(csvString) {
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        
        solutions[numclones].S = arrayData;
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("S: ready_solution took "+ millis + " milliseconds to get data from file");
        
    });

    
    
    
}

function ready_input() {
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/D_input.csv";
    console.log(filename)
    
    var before=new Date().getTime();

    if (typeof input_D == 'undefined') {
        console.log("input_D has not been loaded previously, grabbing it from file.")
        
        $.get(filename, function(csvString) {
            // transform the CSV string into a 2-dimensional array
            var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
            
            
            input_D=arrayData;
            
            var now=new Date().getTime();
            var millis=now-before;
            console.log("Create_D_input_plot took "+ millis + " milliseconds to get data from file");
            
        });
    }
    else {
        console.log("input_D has been loaded already")
    }
}







function create_all_plots(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    
    if (typeof solutions == 'undefined') {
        console.log("No solutions have not been loaded previously, grabbing solution for " + numclones + " from file.")
        create_S_plot(numclones,num_soln);
        create_R_plot(numclones,num_soln);
        create_D_plot(numclones,num_soln);
    
    }
    else if (typeof solutions[numclones] == 'undefined') {
        console.log("The solution for "+ numclones +" has not been loaded previously, grabbing it from file")
        create_S_plot(numclones,num_soln);
        create_R_plot(numclones,num_soln);
        create_D_plot(numclones,num_soln);
    }
    else {
        
        var before=new Date().getTime();
        
        
        
        // PLOT EVERYTHING FROM GLOBAL VARIABLES
        
        ////////////////// R ////////////////////
        plot_R_from_array(solutions[numclones].R)
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("R took "+ millis + " milliseconds to draw the chart");
        before=now;
        
        /////////////////// D ///////////////////
        plot_D_from_array(solutions[numclones].D)
        
         var now=new Date().getTime();
        var millis=now-before;
        console.log("D took "+ millis + " milliseconds to draw the chart");
        before=now;
        
        
        /////////////////// S ///////////////////
        plot_S_from_array(solutions[numclones].S)
        
        
        var now=new Date().getTime();
        var millis=now-before;
        console.log("S took "+ millis + " milliseconds to draw the chart");
        before=now;
    }
    
    
}
//    var filename="D_answer.png";
//    document.getElementById("down_txt_D_answer").href = "./user_data/"+ run_id_code + "/D.txt";
//    document.getElementById("down_img_D_answer").href = "./user_data/"+ run_id_code + "/D_answer.png";


var DS_width=1000;
var DS_height=300;

var R_width=700;
var R_height=300;

var cost_width=1000;
var cost_height=500;

function DS_options(v_tick_max,h_tick_max) {
    var v_ticks=[]
    for (i=0; i<v_tick_max+2; i++){
        v_ticks.push(i);
    }
    
    var h_ticks=[]
    for (i=0; i<5000+2; i++){
        h_ticks.push(i);
    }
    
    var options = {
        width: DS_width,
        height: DS_height,
        legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: false,
        areaOpacity: 0.0,
        //connectSteps: false,
        hAxis: {title: "bins"},
        vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max, ticks: v_ticks}
    };
    return options;
}

var input_D;

var solutions;
//
//
$(document).ready(function() {showProgress();});
////
//
//$(document).ready(function() {create_all_plots();});
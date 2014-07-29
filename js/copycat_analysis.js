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


function check_costs_exist(counter) {
    
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
//
//function test() {
//    var run_id_code=getUrlVars()["code"];
//    alert(run_id_code);
//}
//


function argmin(array) {
    var min = parseFloat(array[0])
    var minIndex = 0
    for (var i = 1; i < array.length; i++) {
        if (parseFloat(array[i]) < min) {
            minIndex = i;
            min = array[i];
        }
    }
    return minIndex
};
//





/////////////////////////////////////////////////////////////////////////
///////////////////  new plots using Google API  ////////////////////////
/////////////////////////////////////////////////////////////////////////

function create_cost_plot() {
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

    create_S_plot(numclones,num_soln);
    create_R_plot(numclones,num_soln);
    create_D_plot(numclones,num_soln);
    
    create_D_input_plot();
    
    create_D_diff_plot(numclones,num_soln);
       
    set_buttons(numclones,num_soln);
}


function set_buttons(numclones,num_soln) {
    var run_id_code=getUrlVars()["code"];

    
    DRS_list=["D","R","S","D_diff"]
    for (i in DRS_list) {
        DRS=DRS_list[i]
        console.log(DRS);
        document.getElementById("down_txt_"+DRS).href = "user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_"+DRS+"_soln_"+num_soln+".csv";
        document.getElementById("down_img_"+DRS).download = run_id_code+"_"+numclones+"_clones_"+DRS+"_soln_"+num_soln+".png";
    }
    
    document.getElementById("down_txt_D_input").href = "./user_data/"+ run_id_code + "/D_input.csv";   
    document.getElementById("down_img_D_input").download = run_id_code+"_D_input.png";

    
}


function create_S_plot(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_S_soln_"+num_soln+"_opt.csv";
    console.log(filename)
    

    //grab the CSV
    $.get(filename, function(csvString) {
        var before=new Date().getTime();
    
        
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        plot_S_from_array(arrayData);
        
        
    });

    
}

function plot_S_from_array(arrayData) {
    
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    var h_tick_max=Math.ceil(data.getColumnRange(0).max)
    
    
    var options = DS_options(v_tick_max,h_tick_max);
    
    
    var before=new Date().getTime();
  
    
    var chart_div = document.getElementById('landing_for_current_S')
    var chart = new google.visualization.LineChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        document.getElementById("down_img_D").href = chart.getImageURI();
    });
    
    chart.draw(data, options);
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_S_plot took "+ millis + " milliseconds to draw the chart");
    
}


function create_D_plot(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/"+numclones+"_clones/"+numclones+"_clones_D_soln_"+num_soln+"_opt.csv";
    console.log(filename)
    
    var before=new Date().getTime();

    //grab the CSV
    //grab the CSV
    $.get(filename, function(csvString) {
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        plot_D_from_array(arrayData);
        
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

    var before=new Date().getTime();

    
    var chart_div = document.getElementById('landing_for_current_D')
    var chart = new google.visualization.LineChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        document.getElementById("down_img_D").href = chart.getImageURI();
    });
        
        
    chart.draw(data, options);
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_D_plot took "+ millis + " milliseconds to draw the chart");

}


function create_D_input_plot(){
    var run_id_code=getUrlVars()["code"];
    
    var filename="user_data/"+run_id_code+"/D_input_opt.csv";
    console.log(filename)
    
    var before=new Date().getTime();

    $.get(filename, function(csvString) {
        // transform the CSV string into a 2-dimensional array
        var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
        
        plot_D_input_from_array(arrayData);

    });

    
    
}

function plot_D_input_from_array(arrayData) {
    var before=new Date().getTime();
   
 
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    var h_tick_max=Math.ceil(data.getColumnRange(0).max)
   
    var options = DS_options(v_tick_max,h_tick_max);
    
    var chart_div = document.getElementById('landing_for_answer_D')
    var chart = new google.visualization.LineChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        document.getElementById("down_img_D_input").href = chart.getImageURI();
    });
        
    chart.draw(data, options);
    
    
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("plot_D_input_from_array took "+ millis + " milliseconds to draw the chart");


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
    
        plot_R_from_array(arrayData);
        
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
        document.getElementById("down_img_R").href = chart.getImageURI();
    });
        
    chart.draw(data, options);
    
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("Create_R_plot took "+ millis + " milliseconds to draw the chart");

}





function create_D_diff_plot(numclones,num_soln){
    var run_id_code=getUrlVars()["code"];
    
    
    var filename = "user_data/" + run_id_code + "/" + numclones + "_clones/" + numclones + "_clones_D_diff_soln_" + num_soln + "_opt.csv";
    
    var before=new Date().getTime();

        $.get(filename, function(csvString) {
            // transform the CSV string into a 2-dimensional array
            arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar}); 
            
            plot_D_diff_from_array(arrayData);
            
        });
  
}


function plot_D_diff_from_array(arrayData) {
    // this new DataTable object holds all the data
    var data = new google.visualization.arrayToDataTable(arrayData);
    
    // this view can select a subset of the data at a time
    var view = new google.visualization.DataView(data);
    view.setColumns([0,1]);
    
    var v_tick_max=Math.ceil(data.getColumnRange(1).max)
    var h_tick_max=Math.ceil(data.getColumnRange(0).max)
    
    // set chart options
    var options = DS_options(v_tick_max,h_tick_max);
   
    
    var before=new Date().getTime();
    
    var chart_div = document.getElementById('landing_for_D_diff')
    var chart = new google.visualization.LineChart(chart_div);
    
    google.visualization.events.addListener(chart, 'ready', function () {
        document.getElementById("down_img_D_diff").href = chart.getImageURI();
    });
    
    chart.draw(data, options);
    
    var now=new Date().getTime();
    var millis=now-before;
    console.log("D_diff: It took "+ millis + " milliseconds to draw the chart");

}


//////////////////////////////////

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




var DS_width=1000;
var DS_height=300;

var R_width=700;
var R_height=300;

var cost_width=1000;
var cost_height=500;

function DS_options(v_tick_max,h_tick_max) {
    var v_ticks=[]
    
    if (v_tick_max > 14) {
        step = Math.floor(v_tick_max/12)
        for (i=0; i<v_tick_max+2; i=i+step){
            v_ticks.push(i);
        }
    } else {
        for (i=0; i<v_tick_max+2; i++){
            v_ticks.push(i);
        }
    }
    
    var options = {
        width: DS_width,
        height: DS_height,
        legend: { position: 'top', maxLines: 3 },
        //bar: { groupWidth: '75%' },
        //isStacked: false,
        //areaOpacity: 0.0,
        //connectSteps: false,
        hAxis: {title: "bins"},
        vAxis: {title: "copy number of DNA segment", maxValue: v_tick_max, ticks: v_ticks}
    };
    return options;
}

$(document).ready(function() {showProgress();});




// How to execute code after getting info from multiple files:
    //
    //$.when(
    //    $.get(filename_input, function(csvString) {
    //        array_input = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar}); 
    //    }),
    //    $.get(filename_output, function(csvString) {
    //        array_ouput = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar} ); 
    //    })
    //).then(function() {
    //    console.log(array_input)
    //    console.log(typeof array_input)
    //    console.log(array_input.length)
    //    console.log(array_input[0].length)
    //    var diff=[]
    //    for (i=0; i<v_tick_max+2; i++){
    //        v_ticks.push(i);
    //    }
    //});
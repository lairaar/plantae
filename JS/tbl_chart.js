var chart_data={};var temp_chart_title;var currentChart=null;var currentSettings=null;AJAX.registerTeardown("tbl_chart.js",function(){$('input[name="chartType"]').unbind("click");$('input[name="barStacked"]').unbind("click");$('input[name="chartTitle"]').unbind("focus").unbind("keyup").unbind("blur");$('select[name="chartXAxis"]').unbind("change");$('select[name="chartSeries"]').unbind("change");$('input[name="xaxis_label"]').unbind("keyup");$('input[name="yaxis_label"]').unbind("keyup");$("#resizer").unbind("resizestop")});AJAX.registerOnload("tbl_chart.js",function(){$("#resizer").resizable({minHeight:240,minWidth:300}).width($("#div_view_options").width()-50);$("#resizer").bind("resizestop",function(c,d){$("#querychart").height($("#resizer").height()*0.96);$("#querychart").width($("#resizer").width()*0.96);currentChart.redraw({resetAxes:true})});currentSettings={type:"line",width:$("#resizer").width()-20,height:$("#resizer").height()-20,xaxisLabel:$('input[name="xaxis_label"]').val(),yaxisLabel:$('input[name="yaxis_label"]').val(),title:$('input[name="chartTitle"]').val(),stackSeries:false,mainAxis:parseInt($('select[name="chartXAxis"]').val()),selectedSeries:getSelectedSeries()};$('input[name="chartType"]').click(function(){currentSettings.type=$(this).val();drawChart();if($(this).val()=="bar"||$(this).val()=="column"||$(this).val()=="line"||$(this).val()=="area"||$(this).val()=="timeline"||$(this).val()=="spline"){$("span.barStacked").show()}else{$("span.barStacked").hide()}});$('input[name="barStacked"]').click(function(){if(this.checked){$.extend(true,currentSettings,{stackSeries:true})}else{$.extend(true,currentSettings,{stackSeries:false})}drawChart()});$('input[name="chartTitle"]').focus(function(){temp_chart_title=$(this).val()}).keyup(function(){var c=$(this).val();if(c.length==0){c=" "}currentSettings.title=$('input[name="chartTitle"]').val();drawChart()}).blur(function(){if($(this).val()!=temp_chart_title){drawChart()}});var a=[];var b=$('input[name="dateTimeCols"]').val().split(" ");$.each(b,function(d,c){a.push(parseInt(c))});$('select[name="chartXAxis"]').change(function(){currentSettings.mainAxis=parseInt($(this).val());if(a.indexOf(currentSettings.mainAxis)!=-1){$("span.span_timeline").show()}else{$("span.span_timeline").hide();if(currentSettings.type=="timeline"){$("input#radio_line").prop("checked",true);currentSettings.type="line"}}var c=$(this).children("option:selected").text();$('input[name="xaxis_label"]').val(c);currentSettings.xaxisLabel=c;drawChart()});$('select[name="chartSeries"]').change(function(){currentSettings.selectedSeries=getSelectedSeries();var c;if(currentSettings.selectedSeries.length==1){$("span.span_pie").show();c=$(this).children("option:selected").text()}else{$("span.span_pie").hide();if(currentSettings.type=="pie"){$("input#radio_line").prop("checked",true);currentSettings.type="line"}c=PMA_messages.strYValues}$('input[name="yaxis_label"]').val(c);currentSettings.yaxisLabel=c;drawChart()});$('input[name="xaxis_label"]').keyup(function(){currentSettings.xaxisLabel=$(this).val();drawChart()});$('input[name="yaxis_label"]').keyup(function(){currentSettings.yaxisLabel=$(this).val();drawChart()});$("#tblchartform").submit()});$("#tblchartform").live("submit",function(b){if(!checkFormElementInRange(this,"session_max_rows",PMA_messages.strNotValidRowNumber,1)||!checkFormElementInRange(this,"pos",PMA_messages.strNotValidRowNumber,0-1)){return false}var a=$(this);if(!checkSqlQuery(a[0])){return false}$(".error").remove();var c=PMA_ajaxShowMessage();PMA_prepareForAjaxRequest(a);$.post(a.attr("action"),a.serialize(),function(d){if(d.success==true){$(".success").fadeOut();if(typeof d.chartData!="undefined"){chart_data=jQuery.parseJSON(d.chartData);drawChart();$("div#querychart").height($("div#resizer").height()*0.96);$("div#querychart").width($("div#resizer").width()*0.96);currentChart.redraw({resetAxes:true});$("#querychart").show()}}else{PMA_ajaxRemoveMessage(c);PMA_ajaxShowMessage(d.error,false);chart_data=null;drawChart()}PMA_ajaxRemoveMessage(c)},"json");return false});function drawChart(){currentSettings.width=$("#resizer").width()-20;currentSettings.height=$("#resizer").height()-20;if(currentChart!=null){currentChart.destroy()}var b=[];$('select[name="chartXAxis"] option').each(function(){b.push($(this).text())});try{currentChart=PMA_queryChart(chart_data,b,currentSettings)}catch(a){PMA_ajaxShowMessage(a.message,false)}}function getSelectedSeries(){var b=$('select[name="chartSeries"]').val()||[];var a=[];$.each(b,function(d,c){a.push(parseInt(c))});return a}function extractDate(d){var e,b;var a=/[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}/;var c=/[0-9]{4}-[0-9]{2}-[0-9]{2}/;e=a.exec(d);if(e!=null&&e.length>0){b=e[0];return new Date(b.substr(0,4),b.substr(5,2),b.substr(8,2),b.substr(11,2),b.substr(14,2),b.substr(17,2))}else{e=c.exec(d);if(e!=null&&e.length>0){b=e[0];return new Date(b.substr(0,4),b.substr(5,2),b.substr(8,2))}}return null}function PMA_queryChart(f,l,c){if($("#querychart").length==0){return}var m={title:{text:c.title,escapeHtml:true},grid:{drawBorder:false,shadow:false,background:"rgba(0,0,0,0)"},legend:{show:true,placement:"outsideGrid",location:"e"},axes:{xaxis:{label:c.xaxisLabel},yaxis:{label:c.yaxisLabel}},stackSeries:c.stackSeries,highlighter:{show:true,showTooltip:true,tooltipAxes:"xy"}};var g=new JQPlotChartFactory();var k=g.createChart(c.type,"querychart");var a=new DataTable();if(c.type=="timeline"){a.addColumn(ColumnType.DATE,l[c.mainAxis])}else{a.addColumn(ColumnType.STRING,l[c.mainAxis])}$.each(c.selectedSeries,function(i,j){a.addColumn(ColumnType.NUMBER,l[j])});var h=[c.mainAxis];$.each(c.selectedSeries,function(i,j){h.push(j)});var n=[],o,p,b;for(var e=0;e<f.length;e++){p=f[e];o=[];for(var d=0;d<h.length;d++){b=l[h[d]];if(d==0){if(c.type=="timeline"){o.push(extractDate(p[b]))}else{o.push(p[b])}}else{o.push(parseFloat(p[b]))}}n.push(o)}a.setData(n);k.draw(a,m);return k};
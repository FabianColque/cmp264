define([
	'd3',
	'components/sl',
	'components/myReviews'
    //'components/comparisonSeries'
], function(d3, sl){
	var datapre = [];
 	var data = [];
 
    $.ajax({
        dataType    : "json",
        url         : "dataofi.json",///home/camack/Área de Trabalho/dataofi.json
        async       : false,
        success     : function(dataori){datapre = dataori;}
    });

  	datapre.sort(function(a,b){
	    if(a.asin < b.asin)return -1;
	    if(a.asin > b.asin)return 1;

	    if(a.unixReviewTime < b.unixReviewTime)return -1;
	    if(a.unixReviewTime > b.unixReviewTime)return 1;

	    return 0;
  	})  

  	var existe = function(asin){
    	for(var i = 0; i < data.length; i++){
      	if(data[i].name === asin)
    	    return i;
    	}
    	return -1;
  	}  


    var nombress = [{a: "B000S5Q9CA", b: "Motorola Vehicle Power"},{a: "B0015RB39O", b: "Delton USB iPhone 3GS"}, {a: "B0042FV2SI", b: "iPhone 4 Anti-Glare"}, {a: "B005SUHPO6", b: "Defender Case for iPhone 4"}, {a: "B005SUHRVC", b: "OtterBox Case for iPhone 4"}, {a: "B0073FCPSK", b: "PowerGenDualUSB Apple2.4"}, {a: "B007FHX9OK", b: "iOttie Easy for iPhone 6s"}, {a: "B007FXMOV8", b: "Stylus Pen TouchScreen b/w"}, {a: "B0088LYCZC", b: "Tech ArmorClear S S3"}, {a: "B0088U4YAG", b: "Dual USB car"}];

    var getNombre = function(assin){
        for(var i = 0; i < 10; i++){
            if(nombress[i].a === assin)
                return i;
        }
        return 2;
    }


  	for (var i = 0; i < datapre.length; i++) {
      var ind = existe(datapre[i].asin);
      if(data.length == 10 && datapre[i].asin != datapre[i-1].asin)break;
      if(ind != -1){
        data[ind].data.push({date: new Date(datapre[i].reviewTime), rating: datapre[i].overall, revi : datapre[i].reviewText});
      } else{
        var gv = getNombre(datapre[i].asin);
        data.push({name: datapre[i].asin, nombre: nombress[gv].b, data : []});
        data[data.length-1].data.push({date: new Date(datapre[i].reviewTime), rating: datapre[i].overall, revi : datapre[i].reviewText});
      }
                 
  };
  
  console.log('mi data', data);

	var minDate = new Date(d3.min(data, function(d){return d3.min(d.data, function(t){return t.date})}).getTime() - 8.64e7);
	
	var maxDate = new Date(d3.max(data, function(d){return d3.max(d.data, function(t){return t.date})}).getTime() + 8.64e7);

	var yMin = 1;
	var yMax = 5;

	  ///////////////////////////////////////////////////////////////
	var margin = {top: 20, right: 20, bottom: 30, left: 35},
	        width = 660 - margin.left - margin.right,
	        height = 400 - margin.top - margin.bottom;

	var plotChart = d3.select('#chart').classed('chart', true).append('svg')
	  			.attr()
				.attr('width', width + margin.left + margin.right + 500)
				.attr('height', height + margin.top + margin.bottom)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var gradient = plotChart.append("defs")
      .append("linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "100%")
        .attr("x2", "100%")
        .attr("y2", "0%")
        .attr("spreadMethod", "pad");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#FF0301");

    gradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "#F9FC00");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#038200");    
        


	    //Zoom
    var xScale = d3.time.scale();
    var yScale = d3.scale.linear();
    var color = d3.scale.category10();


    var zoom = d3.behavior.zoom()
        .x(xScale)
        .on('zoom', function() {
            if (xScale.domain()[0] < minDate) {
                zoom.translate([zoom.translate()[0] - xScale(minDate) + xScale.range()[0], 0]);
            } else if (xScale.domain()[1] > maxDate) {
                zoom.translate([zoom.translate()[0] - xScale(maxDate) + xScale.range()[1], 0]);
            }

            redrawChart();
            updateViewportFromChart();
        });

        

    plotChart.append("rect").attr("class", "zoom-panel")
        .attr('width', width).attr('height', height).style("fill", "url(#gradient)")
        .style("opacity", "0.6").call(zoom); 

    plotChart.call(zoom);
    var plotArea = plotChart.append('g')
	    .attr('clip-path', 'url(#plotAreaClip)');

	plotArea.append('clipPath')
	    .attr('id', 'plotAreaClip')
	    .append('rect')
	    .attr({ width: width, height: height });			



	xScale.domain([minDate, maxDate]);
	yScale.domain([yMin, yMax]).nice();

	xScale.range([0, width]);
	yScale.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')
		.ticks(5);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')
		.ticks(5);

	plotChart.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + height + ')')
		.call(xAxis);

	plotChart.append('g')
		.attr('class', 'y axis')
		.call(yAxis);			


	//var series = sl.series.comparison()
    var series = sl.series.myReviews()
		.xScale(xScale)
		.yScale(yScale);

	var dataSeries = plotArea.append('g')
		.attr('class', 'series')
		.datum(data)
		.call(series);

	//chart navigatioon
	var navWidth = width,
        navHeight = 100 - margin.top - margin.bottom;

    // Set up the drawing area

    var navChart = d3.select('#chart').classed('chart', true)
    	.append('svg')
        .classed('navigator', true)
        .attr('width', navWidth + margin.left + margin.right)
        .attr('height', navHeight + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');				

    var navEnter = navChart.selectAll('.navEnter')
    	.data(data)
    	.enter()
    	.append('g')
    	.classed('navEnter', true)
        .attr("id", function(d, i){return "navEnter" + i;} )
        .style("opacity", 0.8);    

    var navXScale = d3.time.scale()
        .domain([
                new Date(minDate.getTime() - 8.64e7),
                new Date(maxDate.getTime() + 8.64e7)
            ])
        .range([0, navWidth]),
    navYScale = d3.scale.linear()
        .domain([yMin, yMax])
        .range([navHeight, 0]);

    var navXAxis = d3.svg.axis()
	    .scale(navXScale)
	    .orient('bottom');

	navChart.append('g')
    	.attr('class', 'x axis')
    	.attr('transform', 'translate(0,' + navHeight + ')')
    	.call(navXAxis);    

    var navData = d3.svg.area()
    	.x(function (d) { return navXScale(d.date); })
    	.y0(navHeight)
    	.y1(function (d) { return navYScale(d.rating); });

    var navLine = d3.svg.line()
    	.x(function (d) { return navXScale(d.date); })
    	.y(function (d) { return navYScale(d.rating); });

    navEnter.append('path')
    	.attr('class', 'data')
    	//.attr('d', data.map(function(d){return navData(d.data)}));
    	.attr("d", function(d){return navData(d.data)})
    	.style("stroke", function(d){return color(d.name)});
	navEnter.append('path')
    	.attr('class', 'line')
    	.attr('d', function(d){return navLine(d.data)})
    	.style("stroke", function(d){return color(d.name)});

    var viewport = d3.svg.brush()
	    .x(navXScale)
	    .on("brush", function () {
	        xScale.domain(viewport.empty() ? navXScale.domain() : viewport.extent());
	        redrawChart();
	    }).on("brushend", function () {
            updateZoomFromChart();
        });

    navChart.append("g")
	    .attr("class", "viewport")
	    .call(viewport)
	    .selectAll("rect")
	    .attr("height", navHeight);
    

   
    /*var overlay = d3.svg.area()
        .x(function(d){return xScale(d.date)})
        .y0(0)
        .y1(height);


         

    var navOverlay = plotArea.selectAll('.navOverlay')
        .data(data)
        .enter()
        .append('g')
        .classed('navOverlay', true);
        
    navOverlay.append('path')
        .attr('class', 'overlay')
        .attr('d', function(d){return overlay(d.data)})
        .call(zoom);*/             
    
    
    
    var daysIni = 15;
    
    xScale.domain([
        data[data.length-1].data[data[data.length-1].data.length-1 - daysIni].date,
        data[data.length-1].data[data[data.length-1].data.length-1].date
    ]);    
    //console.log("xScale: " , xScale.domain()[0], " y ", xScale.domain()[1])
    redrawChart();
    updateViewportFromChart();
    updateZoomFromChart();

    function redrawChart() {
    	
        //console.log('val ');
    	plotChart.select('.x.axis').call(xAxis);
        plotChart.select('.series').call(series);
	}

    function updateViewportFromChart() {

        if ((xScale.domain()[0] <= minDate) && (xScale.domain()[1] >= maxDate)) {

            viewport.clear();
        }
        else {

            viewport.extent(xScale.domain());
        }

        navChart.select('.viewport').call(viewport);
    }

    function updateZoomFromChart() {

        var fullDomain = maxDate - minDate,
            currentDomain = xScale.domain()[1] - xScale.domain()[0];

        var minScale = currentDomain / fullDomain,
            maxScale = minScale * 2000;

        zoom.x(xScale)
            .scaleExtent([minScale, maxScale]);
    }		

});
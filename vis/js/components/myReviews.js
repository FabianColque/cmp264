define([
	'd3',
	'components/sl',
    'utils/yScaleTransform'
], function (d3, sl, yScaleTransform){
	'use strict';

	sl.series.myReviews = function(){
		var xScale = d3.time.scale(),
			yScale = d3.scale.linear();
        var rectangleWidth = 5;    
		var line = 	d3.svg.line()
			.interpolate("linear")
			.x(function(d){

				return xScale(d.date);
			}).y(function(d){
				return yScale(d.rating);
			});

		var color = d3.scale.category10();
        var detailsH = 30;

		
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0)
            .style("left", (0) + "px")     
            .style("top", (0) + "px"); 

		var myReviews = function(selection){
            
			var series, lines, points;

            
			selection.each(function (data){
				

                color.domain(data.map(function (d) {
                    return d.name;
                }));

                series = d3.select(this).selectAll('.myReviews-series').data([data]);
				series.enter().append('g').classed('myReviews-series', true);

				lines = series.selectAll('.line')
					.data(data, function(d){
						return d.name;
					})
					.enter().append("path")
					.attr("class", "line")
					.attr("clip-path", "url(#clip)")
					.attr("d", function(d){
						
						return line(d.data);
					})
					.style("stroke", function(d){
						return color(d.name);
					})
				series.selectAll('.line')
					.attr("d", function(d){
						return line(d.data);
					});

                points = series.selectAll('.points')
                    .data(data);

                points.enter()
                    .append('g')
                    .classed('points', true);

                var promReview = calcAverage(data);
                
                var totalReview = d3.select("svg").selectAll('.progressStar').data(promReview, function(d){return d;});     
                                
                var bpro;

                bpro = d3.select("svg").selectAll('.circleProduct').data(data, function(d){
                    return [d.name];
                });
                
                var ds = [];
                for (var i = 0; i < data.length; i++) {
                    ds.push(Math.random())
                };
                

                var stars = d3.select("svg").selectAll('.mystars').data(ds, function(d){return d;});
                var promNum = d3.select("svg").selectAll('.promAv').data(promReview, function(d){return d;});
                  
                progressChart(totalReview);   
                circlesChart(points);    
                barProduct(bpro);
                starsf(stars);
                fpronum(promNum); 
                    
                stars.exit().remove();
                totalReview.exit().remove();
                bpro.exit().remove();
                promNum.exit().remove();
                


						
			});
		}

        var wScale = d3.scale.linear().domain([0, 5]).range([0, 100])
        var formatDec = function(d){return Number(d).toFixed(3);}

        var fpronum = function(promNum){
            promNum.enter().append("text").attr("class", "promAv");

            promNum.attr("x", 920)
                .attr("y", function(d,i){return detailsH + 5 + (i*30)})
                .text(function(d){return formatDec(d);});    

        }

        var starsf = function(stars){
            
            stars.enter().append('image')
            .attr('class', 'mystars')
            .attr('width', 100)
            .attr('height', 30)
            .attr('x', 820)
            .attr('y', function(d,i){return detailsH - 16.7 + (i*30)});

            stars              
                .attr('xlink:href', function(d){return 'fivestarf.png';})
                
          
        }

        var progressChart = function(prom){

            prom.enter().append('rect')
                .attr('class', 'progressStar');

                prom.attr('x', 820)
                .attr('y', function(d, i){return detailsH - 11 + (i*30)})
                .attr('width', function(d){return wScale(d)})
                .attr('height', 19)
                .style("fill", "#E8DA0E")
                .style("position", "absolute")
                .style("z-index", 1);
        }


        var formatTime = d3.time.format("%e %B %Y");

        var barProduct = function(bpro){
            
            bpro.enter().append('circle')
                    .attr("class", "circleProduct2")
                    .style("fill", function(d){return color(d.name)})
                    .attr('cy', function(d,i){return detailsH + (i*30)})
                    .attr('cx', (700))
                    .attr('r', 9);

                bpro.enter().append('text')
                    .attr("class", "circleProduct")
                    .attr("x", 710)
                    .attr("y", function(d,i){ return detailsH + (i*30)})
                    .attr("dy", ".35em")
                    .text(function(d){
                        return d.name;
                    });

                    


        }

        var circlesChart = function(bars){
            
            var rect;

            rect = bars.selectAll('.circleArea').data(function (d) {
                var a = [];
                var named = d.name;
                var dat = d.data;
                dat.forEach(function(t){
                	a.push({name: named, rating: t.rating, date: t.date, rev: t.revi});
                });
                return a; 
            });

            rect.enter().append('circle').attr("class", "circleArea");

			
			rect.style("fill", function(d){return color(d.name)})
        		.attr('cy', function(d){return yScale(d.rating)})
		        .attr('cx', function(d){return xScale(d.date)})
		        .attr('r', 5);

		    rect.on("mouseover", function(d){
                d3.select(this).attr("r", 12);
                div.transition()        
                    .duration(200)      
                    .style("opacity", .9);      

                var canstar = d.rating;
                
                var txthtml = formatTime(d.date);

                for(var gg = 0; gg < canstar; gg++){
                    txthtml = txthtml + "<img src=\"star.png\" width = 15 height = 15>"; 
                }    
                txthtml = txthtml + "<br/>";
                txthtml = txthtml +"Review" ;
                txthtml = txthtml +"<span>";
                txthtml = txthtml +d.rev;
                txthtml = txthtml +"</span>";
                div.html(txthtml)  
                    .style("left", (d3.event.pageX + 20) + "px")     
                    .style("top", (d3.event.pageY - 28) + "px")
                    .style("text-align", "justify");
                /*div.append("imagen")        
                .attr("xlink:href","star.png")
                .attr("x",79)
                .attr("y",24)
                .attr("width",270)
                .attr("height",270)            */

            }).on("mouseout", function(d){
                d3.select(this).attr("r", 5);
                div.transition()        
                    .duration(500)      
                    .style("opacity", 0);
            });    


		    //rect.exit().remove(); 

            /*
            rect.enter().append('rect');

            rect.attr('x', function (d) {
                return xScale(d.date) - rectangleWidth;
            })
                .attr('y', function (d) {
                    return yScale(d.rating);
                })
                .attr('width', rectangleWidth * 2)
                .attr('height', function (d) {
                    return 10;
                });*/
        }

		myReviews.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return myReviews;
        };

        myReviews.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return myReviews;
        };

        var calcAverage = function(data){
            var dateini = new Date(xScale.domain()[0]);
            var dateend = new Date(xScale.domain()[1]);
            var sum = 0.0;
            var count = 0;
            var arr = [];            
            for (var i = 0; i < data.length; i++) {
                count = 0;
                sum = 0.0;
                for (var j = 0; j < data[i].data.length; j++) {
                    
                    if(new Date(data[i].data[j].date) >= dateini && new Date(data[i].data[j].date) <= dateend)
                    {
                        sum = sum + data[i].data[j].rating;
                        count = count + 1;
                    }
                };

                if(sum > 0){
                    //console.log('i: ', i, 'ver ', sum, 'count ', count);
                    sum = sum/count;
                    arr.push(sum);
                }else{
                    arr.push(0);
                }
            };
            return arr;   
        }

        return myReviews;	
	}
});
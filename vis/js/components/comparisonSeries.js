define([
    'd3',
    'components/sl',
    'utils/yScaleTransform'
], function (d3, sl, yScaleTransform) {
    'use strict';

    sl.series.comparison = function () {

        var xScale = d3.time.scale(),
            yScale = d3.scale.linear();

        var cachedData, cachedScale;

      
        var color = d3.scale.category10();

        var line = d3.svg.line()
            .interpolate("linear")
            .x(function (d) {
                return xScale(d.date);
            })
            .y(function (d) {
                return yScale(d.rating);
            });

        var comparison = function (selection) {
            var series, lines;

            selection.each(function (data) {

            
                cachedData = data; // Save for rebasing.

                color.domain(data.map(function (d) {
                    return d.name;
                }));

                
                cachedScale = yScale.copy();

                series = d3.select(this).selectAll('.comparison-series').data([data]);
                series.enter().append('g').classed('comparison-series', true);

                lines = series.selectAll('.line')
                    .data(data, function(d) {
                        return d.name;
                    })
                    .enter().append("path")
                    .attr("class", "line")
                    .attr("d", function (d) {
                        return line(d.data);
                    })
                    .style("stroke", function (d) {
                        return color(d.name);
                    });

                series.selectAll('.line')
                    .attr("d", function (d) {
                        return line(d.data);
                    });
            });
        };

        
        comparison.xScale = function (value) {
            if (!arguments.length) {
                return xScale;
            }
            xScale = value;
            return comparison;
        };

        comparison.yScale = function (value) {
            if (!arguments.length) {
                return yScale;
            }
            yScale = value;
            return comparison;
        };

        return comparison;
    };
});
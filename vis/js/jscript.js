
var dataGeral = [];
var dataSet = [];
function loadDataFunc(){
    //getData(files[0]);
    
    drawAll2();
    
}

function drawAll2(){
    var margin  = {top: 50, right: 0, bottom: 100, left: 100};
    var width   = 3000 - margin.left - margin.right;
    var height  = 330 - margin.top  - margin.bottom;
    var gridSize  = Math.floor(width/110);

    //var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58","#000000"];
    var colors = ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"]
    var colordom = [-3, -2, -1, 0, 1, 2, 3];
    var dataset = ["1.json", "2.json", "3.json", "4.json", "5.json"];

    var cellTextXOffset = 5,
          cellTextYOffset = 3;

    var svg = d3.select("#chart").append("svg")
        .attr("width" , width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var heatmapchart = function(){

        //**********
        /*for (var i = Things.length - 1; i >= 0; i--) {
            Things[i]
        };*/

//*******************************
        /********************************************************/
        for (var i = 0; i <= dataset.length; i++) {
            $.ajax({
                dataType : "json",
                url : dataset[i],
                async: false,
                success : function(data){dataGeral.push(data);}
            })
        };
        /********************************************************/
        
            //var dataSet = [];
            
            //console.log("caram: " , dataGeral);
            for (var po = 0; po < dataGeral.length; po++) {

                var nome = dataGeral[po].product.name;
                var revi = [];
                var gg = dataGeral[po].product.reviews;
                var arr = [];
                
                for (var i = 0; i < gg.length; i++) {
                    //console.log("miraps " + i);
                    //por cada oracion
                    var cont = 0;
                    var tot = 0;
                    for (var ii = 0; ii < gg[i].length; ii++) {
                        
                        //por cada palabra clave
                        var vari = gg[i][ii];
                        for (var iii = 0; iii < vari.keys.length; iii++) {
                            cont += vari.keys[iii].opstr;        
                            tot = tot +1;
                        };
                    };
                    if(tot > 0)
                    cont = Math.round(cont/tot);
                //aqui guardar
                    //console.log("ahora si: ", cont);
                    arr.push(cont);
                };

                dataSet.push({name : nome, data : arr});
                
            };
            console.log("vaso: " , dataSet);
            var colorScale = d3.scale.linear()
              //.domain([-5, -3, -1, 0, 1, 3, 5, 7])
              .domain(colordom)
              .range(colors);

            var cards = svg.selectAll(".hour")
                .data(dataSet);

            cards.append("title");



            cards.enter().append("g")
                .attr("class", "row")
                .attr("transform", function(d,i){return "translate(0, " + i*gridSize + ")";})
                .each(row);

                   
            function row(row, i){
                console.log(i);

                var nombre = d3.select(this).append("text")
                    
                    .attr("x", -10)
                    .attr("y", gridSize/2)
                    .style("fill", "black")
                    .style("font-weight","bold")
                    .style("font-size", "10px")
                    .text(row.name);

                var cell = d3.select(this).selectAll(".cell")
                    .data(row.data)
                    .enter();

                cell.append("rect")
                    .attr("class", "cell_bordered")
                    .attr("x", function(d,i) { return i*gridSize+250; })
                    .attr("rx",5)
                    .attr("ry", 5)                    
                    .attr("width", gridSize)
                    .attr("height", gridSize)
                    .style("fill",  function(d) {;return colorScale(d);});
              cell.append("text")
                .attr("x",function(d,i){ return i*gridSize+ cellTextXOffset+250})
                .attr("y",function(d,i){ return gridSize/2 + cellTextYOffset;})
                .style("fill",function(d) {return "black";})
                .style("font-weight","bold")
                .style("font-size", "10px")
                .text(function(d){return d;});

                 
            }

            cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d); });

            cards.select("title").text(function(d) { return d; });
              
            cards.exit().remove();                      
            //sdsd = data;
        
        
       
        

    }//fin function heatmapchart    

    heatmapchart();

    
}
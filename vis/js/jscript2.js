var dataGeral = [];
var palabras = [];
var posy;
function loadDataFunc2(){
    drawAll();
}

function drawAll(){

    var folder = "./datasetJson/";
    //var dataset = ["Apex AD2600 Progressive-scan DVD player.json", "Canon G3.json", "Creative Labs Nomad Jukebox Zen Xtra 40GB.json", "Nikon coolpix 4300.json", "Nokia 6610.json", "ipod.json","MicroMP3.json","Canon PowerShot SD500.json", "Linksys Router.json", "Canon S100.json", "Diaper Champ.json", "Nokia 6600.json", "norton.json", "Hitachi router.json"];
    var dataset = ["Apex AD2600 Progressive-scan DVD player.json", "Canon G3.json", "Creative Labs Nomad Jukebox Zen Xtra 40GB.json", "Nikon coolpix 4300.json", "Nokia 6610.json", "ipod.json","MicroMP3.json","Canon PowerShot SD500.json", "Linksys Router.json"];

    var margin  = {top: 100, right: 0, bottom: 100, left: 100};
    var width   = 600 - margin.left - margin.right;
    var height  = 10000 - margin.top  - margin.bottom;
    var gridSizeW  = Math.floor(35);
    var gridSizeH  = Math.floor(height/1100);
    var legendElementWidth = gridSizeH*2; 

    //var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58","#000000"];
    //var colors = ["red", "yellow", "green"];
    var colors = ["#d73027", "#fc8d59", "#fee08b", "#ffffbf", "#d9ef8b", "#91cf60", "#1a9850"]
    var colordom = [-3, -2, -1, 0, 1, 2, 3];
    var cellTextXOffset = 5,
          cellTextYOffset = 3;

    var colorScale = d3.scale.linear()
              //.domain([-5, -3, -1, 0, 1, 3, 5, 7])
              .domain(colordom)
              .range(colors);      

    var svg = d3.select("#chart")
        .style("width", "0px")
        .style("float", "left")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.top)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("id", "matriz");

    var contienePalArr = function(pal){
    for (var i = 0; i < palabras.length; i++)
        if(palabras[i].word === pal)
            return i;
    return -1;
    }

    var gerarArray = function(){
        var ar = [];
        for (var i = 0; i < dataGeral.length; i++)
            ar.push(0);
        return ar;
    }



    var heatmapchart = function(){

        for (var i = 0; i < dataset.length; i++) {
            $.ajax({
                dataType    : "json",
                url         : folder + dataset[i],
                async       : false,
                success     : function(data){dataGeral.push(data);}
            });
        };


        
        //por cada produto
        for (var i = 0; i < dataGeral.length; i++) {

            var nome = dataGeral[i].product.name;
            var gg = dataGeral[i].product.reviews;
            //por cada comentario
            for (var ii = 0; ii < gg.length; ii++){
                
                //por cada oracion

                for (var iii = 0; iii < gg[ii].length; iii++){
                
                    //por cada key
                    var vari = gg[ii][iii];
                    for (var iiii = 0; iiii < vari.keys.length; iiii++){
                        var ind = contienePalArr(vari.keys[iiii].feature);
                        if(ind === -1){
                            palabras.push({word: vari.keys[iiii].feature, pr : gerarArray(), polar: vari.keys[iiii].opstr});
                            palabras[palabras.length-1].pr[i] = vari.keys[iiii].opstr;
                            //palabras[palabras.length-1].polar  += vari.keys[iiii].opstr;
                        }else{
                            if(palabras[ind].pr[i] === 0)
                                palabras[ind].pr[i] = vari.keys[iiii].opstr;
                            else
                                palabras[ind].pr[i] = (palabras[ind].pr[i] + vari.keys[iiii].opstr)/2.0;
                            palabras[ind].polar  += vari.keys[iiii].opstr;
                        }    
                    }
                }
            }
        };

        function sai(cad){
            var i=0;
            var lnum = "";
            for(i = 0; cad[i] != '0' && i<cad.length; i++){}
            for(i = i+3; cad[i] != ')' && i<cad.length; i++)lnum = lnum.concat(cad[i]);
               // console.log("sera: " , cad, " -> ", lnum);
            return lnum;
        }

        var cards = svg.selectAll(".hour")
                .data(palabras);

            cards.append("title");



            cards.enter().append("g")
                .attr("class", "row")
                .attr("transform", function(d,i){return "translate(0, " + i*gridSizeH + ")";})
                .each(row)
                .on("mouseenter", function(d){
                    posy = sai(d3.select(this).attr("transform"));
                    //console.log("algo: ", posy)
                });
                
        var textvert = svg.selectAll(".vert")
                        .data(dataGeral)
                        .enter()
                        .append("g")
                        .attr("class", "vert")
                        .attr("transform", function(d,i){return "translate(" + i*gridSizeW + ")rotate(-90)" });

        textvert.append("text")
            .attr("x", 0)
            .attr("y", 90)
            .attr("dy", ".32em")
            .attr("text-anchor", "start")
            .style("fill", "black")
            .style("font-weight","bold")
            .style("font-size", "8px")
            .text(function(d,i){
                return d.product.name;
            })



        function row(rowf, i){
                var nombre = d3.select(this).append("text")
                    .attr("class", "texthor"+i)
                    .attr("x", 0)
                    .attr("y", gridSizeH/2+4)
                    .style("fill", "black")
                    .style("font-weight","bold")
                    .style("font-size", "6px")
                    .text(rowf.word)
                .on("mouseover", function(d){
                    //console.log("se");
                    d3.select(this)
                    .style("fill", "lightblue");
                    
                }).on("mouseout", function(d){
                        d3.select(this)
                        .style("fill", "black")
                    });

                var cell = d3.select(this).selectAll(".cell")
                    .data(rowf.pr)
                    .enter();

                cell.append("rect")
                    .attr("class", "cell_bordered")
                    .attr("x", function(d,i) { return i*gridSizeW+80; })
                    .attr("rx",0)
                    .attr("ry", 0)                    
                    .attr("width", gridSizeW)
                    .attr("height", gridSizeH)
                    .style("fill",  function(d) {;return colorScale(d);})
                    .on("mouseenter", function(d,i){
                        var xPosition = parseFloat(d3.select(this).attr("width")*i);
                        //var yPosition = parseFloat(d3.select(this).attr("height")*i) + 14;
                        console.log(d);
                        var tooltip = d3.select("#matriz")
                                        .append("g")
                                        .attr("class", "texto-tooltip")
                                        .attr("transform", "translate(" + xPosition + "," + posy + ")");
                        tooltip.append("rect")
                            .attr("width", 100)
                            .attr("height", 70)
                            .style("fill", "#EDCCA9")
                            .style("fill-opacity", 0.8);
                        tooltip.append("text")
                            .text("Details")
                            .attr("class", "textotitulo")
                            .attr("x", 35)
                            .attr("y", 15);                        
                    }).on("mouseleave", function(d){
                        d3.select(".texto-tooltip").remove();
                    });   
        }

        function row2(row, i){
                var nombre = d3.selectAll(".texthor"+i)
                    //.attr("class", "texthor")
                    .transition().duration(2000)
                    .attr("x", 0)
                    .attr("y", gridSizeH/2+4)
                    .style("fill", "black")
                    .style("font-weight","bold")
                    .style("font-size", "6px")
                    .text(row.word);
                    
               

                var cell = d3.select(this).selectAll(".cell")
                    .data(row.pr)
                    .enter();

                cell.append("rect")
                    .attr("class", "cell_bordered")
                    .attr("x", function(d,i) { return i*gridSizeW+80; })
                    .attr("rx",0)
                    .attr("ry", 0)                    
                    .attr("width", gridSizeW)
                    .attr("height", gridSizeH)
                    .style("fill",  function(d) {;return colorScale(d);})
                    .on("mouseenter", function(d,i){
                        var xPosition = parseFloat(d3.select(this).attr("width")*i);
                        
                        console.log(d);
                        var tooltip = d3.select("#matriz")
                                        .append("g")
                                        .attr("class", "texto-tooltip")
                                        .attr("transform", "translate(" + xPosition + "," + posy + ")");
                        tooltip.append("rect")
                            .attr("width", 100)
                            .attr("height", 70)
                            .style("fill", "#EDCCA9")
                            .style("fill-opacity", 0.8);
                        tooltip.append("text")
                            .text("Details")
                            .attr("class", "textotitulo")
                            .attr("x", 35)
                            .attr("y", 15);                        
                    }).on("mouseleave", function(d){
                        d3.select(".texto-tooltip").remove();
                    });   
        }

            cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d); });

            cards.select("title").text(function(d) { return d; });
              
            //cards.exit().remove();
            
            d3.select("#orden")
            
            .on("change", function(){
                svg.selectAll(".hour").remove();
                if(this.value === "Alfabetico"){
                    console.log("alfabetico");
                    functSort();

                    var cards = svg.selectAll(".hour")
                    .data(palabras);
                    //cards.remove();
                    cards.append("title");
                    cards.enter().append("g")
                    .transition().duration(3000)
                    .attr("class", "row")
                    .attr("transform", function(d,i){return "translate(0, " + i*gridSizeH + ")";})
                    .each(row2);
                }else if(this.value === "Rank"){
                    console.log("Rank");
                    functSortPolar();
                    var cards = svg.selectAll(".hour")
                    .data(palabras);
                    //cards.remove()
                    cards.append("title");
                    cards.enter().append("g")
                    .transition().duration(3000)
                    .attr("class", "row")
                    .attr("transform", function(d,i){return "translate(0, " + i*gridSizeH + ")";})
                    .each(row2);
                }else{
                    console.log("nada");
                }
            });                
    } 
    heatmapchart();

    var legend = svg.selectAll(".legend")
        .data(colors);   
    legend.enter().append("g")
        .attr("class", "legend");
    legend.append("rect")
        .attr("x", -60)
        .attr("y", function(d,i){return legendElementWidth*2*i;})
        .attr("width", gridSizeH*2)
        .attr("height", legendElementWidth*2)
        .style("fill", function(d,i){return colors[i];});
    legend.append("text")
        .attr("class", "mono")
        .text(function(d,i){return colordom[i];})
        .attr("x", -75)
        .attr("y", function(d,i){return legendElementWidth*2*i+20;})
        .style("fill", "black")
        .style("font-weight","bold")
        .style("text-align", "center")
        .style("font-size", "7px");        
}

var functSort = function(){
    //palabras.sort();
    palabras.sort(function(a,b){
        //console.log(a.word, " ", b.word);
        if(a.word > b.word)
            return 1;
        if(a.word < b.word)
            return -1;
        return 0
    })
}

var functSortPolar = function(){
    palabras.sort(function(a, b){
        return b.polar - a.polar; 
    })
}
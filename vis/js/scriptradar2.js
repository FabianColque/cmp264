var w = 500,
    h = 400;

var linearScale = d3.scale.linear()
                            .domain([0,100])
                            .range([0,100]);


var colorscale = d3.scale.category10();

//Legend titles
var LegendOptions = ['Positivos', 'Neutro','Negativo'];

//Data
var dataGeral = [];
var folder = "./datasetJson/";
var dataset = ["Apex AD2600 Progressive-scan DVD player.json", "Canon G3.json", "Creative Labs Nomad Jukebox Zen Xtra 40GB.json", "Nikon coolpix 4300.json", "Nokia 6610.json","MicroMP3.json", "Linksys Router.json", "Canon S100.json", "Diaper Champ.json", "Nokia 6600.json", "norton.json", "Hitachi router.json"];
//var dataset = ["Apex AD2600 Progressive-scan DVD player.json", "Canon G3.json", "Creative Labs Nomad Jukebox Zen Xtra 40GB.json", "Nikon coolpix 4300.json", "Nokia 6610.json", "ipod.json","MicroMP3.json","Canon PowerShot SD500.json", "Linksys Router.json"];
var mydata = [[],[],[]];
var myproducts = [];
for (var i = 0; i < dataset.length; i++) {
            $.ajax({
                dataType    : "json",
                url         : folder + dataset[i],
                async       : false,
                success     : function(data){dataGeral.push(data);}
            });
};

for (var i = 0; i < dataGeral.length; i++) {

  var nome = dataGeral[i].product.name;
  var gg = dataGeral[i].product.reviews;
  
  var sum = [0,0,0];
  var cant = [0,0,0]; 
  //por cada comentario
  for (var ii = 0; ii < gg.length; ii++){
    var algo = 0;
    var cnt = 0;
    //por cada oracion
    for (var iii = 0; iii < gg[ii].length; iii++){
                
      //por cada key
      var vari = gg[ii][iii];
      for (var iiii = 0; iiii < vari.keys.length; iiii++){
        algo += vari.keys[iiii].opstr;
        cnt += 1;  
      }
    }
    algo = algo/cnt;
    if(algo > 0){sum[0] += 1; cant[0] += 1;}
    if(algo === 0){sum[1] += 1; cant[1] += 1;}
    if(algo < 0){sum[2] += 1; cant[2] += 1;}

  }
  //mydata[0].push({axis: nome, value: sum[0]});
  //mydata[1].push({axis: nome, value: sum[1]});
  //mydata[2].push({axis: nome, value: sum[2]});
  var hi = sum[0] + sum[1]+sum[2];
  mydata[0].push({axis: nome, value: linearScale(sum[0]/hi)});
  mydata[1].push({axis: nome, value: linearScale(sum[1]/hi)});
  mydata[2].push({axis: nome, value: linearScale(sum[2]/hi)});
};


//Options for the Radar chart, other than default
var mycfg = {
  w: w,
  h: h,
  maxValue: 0,
  levels: 3,
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", mydata, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
    .selectAll('svg')
    .append('svg')
    .attr("width", w+300)
    .attr("height", h)


        
//Initiate Legend   
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(90,20)') 
    ;
    //Create colour squares
    legend.selectAll('rect')
      .data(LegendOptions)
      .enter()
      .append("rect")
      .attr("x", w - 65)
      .attr("y", function(d, i){ return i * 20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d, i){ return colorscale(i);})
      ;
    //Create text next to squares
    legend.selectAll('text')
      .data(LegendOptions)
      .enter()
      .append("text")
      .attr("x", w - 52)
      .attr("y", function(d, i){ return i * 20 + 9;})
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(function(d) { return d; })
      ; 

(function () {
// Define global variables
var globaldata, split, years;

function datasort (data) {
    
    // nest the datas 2 times with geschlecht and year 
    sex = d3.nest()
        .key(function (d) {return d.geschlecht;})
        .key(function (d) {return d.jahr})
        .map(data);

    // make another set only with years
    all = d3.nest()
        .key(function (d) {return d.jahr})
        .map(data)
        
    // split datas
    var weiblich = sex.weiblich;
    var maennlich = sex.männlich;
    var wedernoch = sex.undefined;

    console.log("Nested Array - geschlecht: weiblich", weiblich);
    console.log("Nested Array - geschlecht: maennlich", maennlich);
    console.log("Nested Array - Gesamt", sex);


    var max_name = d3.max(data, function(d) { return d.anzahl; });
    
    console.log("Maximale Namenanzahl: ", max_name);

    var min_max = d3.extent(data, function(d) { return d.anzahl; });
    
    console.log("Extent Namenanzahl: ", min_max);

    // var years = data.map(function(d) { return d.jahr; });

    var yearsAll = [];

    for(var jahrgang in all){
       yearsAll[yearsAll.length] = jahrgang;
    }
    
    console.log("Jahrgänge Gesamt:", yearsAll);

    var years = [];

    for(var jahrgang in weiblich){
       years[years.length] = jahrgang;
    };
    
    console.log("Jahrgänge Weiblich:", years);

    var weiblich1993 = weiblich[1993];

    var filter = weiblich1993
        .filter(function(d) { return d.anzahl > 2; });
        
    filter.sort(function(a,b) { return b.anzahl - a.anzahl; });

    // var years = data.reduce(function(result, d, i) { 
    //   var result = [];
    //   for (u in result) {
    //     if (d.jahr != u) {result.push(d.jahr)}};
    //     return result;
    //   });

    // var yearsraw = [];

    // var yearsraw = data.map(function(d) {
    //   return d.jahr;
    // });
    
    // console.log("Jahrgänge RAW:", yearsraw);

    drawchart(filter)




}

d3.csv("data/bev_vornamen_baby_seit1993.csv", function(d) {
  return {
    jahr: +d.jahr, // convert "Year" column to Date
    vorname: d.vorname,
    geschlecht: d.geschlecht,
    anzahl: +d.Anzahl // convert "Length" column to number
  };
}, function(error, data) {

  if (error) throw error;

  globaldata = data;
  
  datasort(data);


    
});

function drawchart (names) {

console.log("Empfangene Daten:", names);

var max_chart1993 = d3.max(names, function(d) { return d.anzahl; });

console.log("Grösste Anzahl Namen 1993:", max_chart1993);

console.log("Anzahl der Daten:", names.length);

// define margin, height and width

var margin = {top: 20, right: 30, bottom: 100, left: 40},

    barwidth = 15,
    width = names.length * barwidth - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,

    outerwidth = width + margin.left + margin.right,
    outerheight = height + margin.top + margin.bottom;

// scaling of chart (datas to y)

var y = d3.scale.linear()
// scaling the datas to 500 to 0 (zero point is on th bottom)
    .range([height, 0]);

// scaling from letters (ordinal)
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10, "Numbers");

// set width and height of chart
var chart = d3.select("#chart")
    .attr("width", outerwidth)
    .attr("height", outerheight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(names.map(function(d) { return d.vorname; }));
  y.domain([0, d3.max(names, function(d) { return d.anzahl; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");;

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Anzahl");


  chart.selectAll(".bar")
      .data(names)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.vorname); })
      .attr("y", function(d) { return y(d.anzahl); })
      .attr("height", function(d) { return height - y(d.anzahl); })
      .attr("width", x.rangeBand());

};

//set width and height of chart
// var chart = d3.select("main").append("svg")
//     .attr("width", outerwidth)
//     .attr("height", outerheight)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



// read datas from file - don't know what "error" does?
// d3.tsv("letters.tsv", type, function(error, data) {
//   if (error) throw error;

//   // scaling names and frequency
//   x.domain(data.map(function(d) { return d.letter; }));
//   y.domain([0, d3.max(data, function(d) { return d.freq; })]);

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis)
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", ".71em")
//       .style("text-anchor", "end")
//       .text("Frequency");

//   svg.selectAll(".bar")
//       .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x(d.letter); })
//       .attr("y", function(d) { return y(d.freq); })
//       .attr("height", function(d) { return height - y(d.freq); })
//       .attr("width", x.rangeBand());
//});

} ());

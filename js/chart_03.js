// Define global variables
var globaldata, split, years;
var weiblich, maennlich, wedernoch;

function datasort (data) {
    
    // nest the datas 2 times with geschlecht and year 
    split = d3.nest()
        .key(function (d) {return d.geschlecht;})
        .key(function (d) {return d.jahr})
        .map(data);

    // make another set only with years
    yearsAll = d3.nest()
        .key(function (d) {return d.jahr})
        .map(data)

    // make another set only with names
    all = d3.nest()
        .key(function (d) {return d.vorname})
        .map(data)

    var years = [];

    for(var jahrgang in yearsAll){
       years[yearsAll.length] = jahrgang;
    }
    
    console.log("Jahrgänge Gesamt:", yearsAll);

    var max_name = d3.max(data, function(d) { return d.anzahl; });
    
    console.log("Maximale Namenanzahl: ", max_name);

    var chooseYear = d3.select("#year")
        .attr("onchange", "drawchart()")
        .selectedindex = "1";

    var chooseGender = document.getElementById("gender");
    chooseGender.setAttribute("onchange", "drawchart()");
    chooseGender.selectedindex = "1";

    drawchart()

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

function drawchart() {

var currentYear = document.getElementById("year").value;
var currentGender = document.getElementById("gender").value;

var names = split[currentGender][currentYear]
        .filter(function(d) { return d.anzahl > 1; });
        
names.sort(function(a,b) { return b.anzahl - a.anzahl; });

var max = d3.max(names, function(d) { return d.anzahl; });

console.log("choosen year:", currentYear);
console.log("choosen gender:", currentGender);
console.log("Ausgewählte Daten:", names);

console.log("Grösste Anzahl Namen 1993:", max);
console.log("Anzahl der Daten:", names.length);

// define margin, height and width

var margin = {top: 40, right: 40, bottom: 20, left: 20};

var barwidth = 15, barheight = 20;

var width =  700 - margin.left - margin.right,
    height = names.length * barheight - margin.top - margin.bottom,

    outerwidth = width + margin.left + margin.right,
    outerheight = height + margin.top + margin.bottom;

// scaling of chart (datas to y)

var x = d3.scale.linear()
// scaling the datas to 500 to 0 (zero point is on th bottom)
    .domain([0, max])
    .range([60, width]);

// scaling from letters (ordinal)
var y = d3.scale.ordinal()
    .domain(names.map(function(d) { return d.vorname; }))
    .rangeRoundBands([0, height], .15);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .ticks(10, "Numbers");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
  
var remove = d3.select(".chart").remove();

// set width and height of chart
var chart =  d3.select("#chart1").append("svg")
    .attr("class", "chart")
    .attr("width", outerwidth)
    .attr("height", outerheight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  chart.append("g")
      .attr("class", "x axis")
      .call(xAxis)
    .append("text")
      .attr("x", 640)
      .attr("y", 10)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Anzahl");

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .selectAll("text")
      .attr("y", -70)
      .attr("x", 50)
      .attr("dy", ".35em")
      .style("text-anchor", "right");
    
  var bar = chart.selectAll(".bar")
      .data(names)
      .enter().append("g")

  bar.append("rect")
      .attr("x", 60)
      .attr("y", function(d) { return y(d.vorname) - 70; })
      .attr("class", "bar")
      .attr("width", function(d) { return x(d.anzahl) - 60; })
      .attr("height",  y.rangeBand());
    

  bar.append("text")
      .attr("x", function(d) { return x(d.anzahl) + 5})
      .attr("y", function(d) { return y(d.vorname) - 70 })
      .attr("dy", "1em")
      .style("text-anchor", "start")
      .text(function(d) { return d.anzahl} );
      

};


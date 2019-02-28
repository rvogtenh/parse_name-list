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
    all = d3.nest()
        .key(function (d) {return d.jahr})
        .map(data)
        
    // split datas
    weiblich = split.weiblich;
    maennlich = split.männlich;
    wedernoch = split.undefined;

    var test = "weiblich"

    console.log("Nested Array - geschlecht: weiblich", split[test]);
    console.log("Nested Array - geschlecht: maennlich", maennlich);
    console.log("Nested Array - Gesamt", all);


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

    var chooseYear = document.getElementById("year");
    
    chooseYear.setAttribute("onchange", "drawchart()");
    chooseYear.selectedindex = "1";

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
        .filter(function(d) { return d.anzahl > 2; })
        .sort(function(a,b) { return b.anzahl - a.anzahl; });

var max = d3.max(names, function(d) { return d.anzahl; });

console.log("choosen year:", currentYear);
console.log("choosen gender:", currentYear);
console.log("Ausgewählte Daten:", names);

console.log("Grösste Anzahl Namen 1993:", max);
console.log("Anzahl der Daten:", names.length);

// define margin, height and width

var margin = {top: 20, right: 30, bottom: 80, left: 40},

    barwidth = 15,
    width = names.length * barwidth - margin.left,
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

var remove = d3.select(".chart").remove();

// set width and height of chart
var chart =  d3.select("#chart1").append("svg")
    .attr("class", "chart")
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
      .text("Anzahl Max: " + max);


  chart.selectAll(".bar")
      .data(names)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.vorname); })
      .attr("y", function(d) { return y(d.anzahl); })
      .attr("height", function(d) { return height - y(d.anzahl); })
      .attr("width", x.rangeBand());

};


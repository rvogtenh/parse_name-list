// define margin, height and width
var margin = {top: 20, right: 30, bottom: 30, left: 40},
    outerwidth = 960,
    outerheight = 500,
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


// scaling from letters (ordinal)
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

// scaling of chart (datas to y)
var y = d3.scale.linear()
// scaling the datas to 500 to 0 (zero point is on th bottom)
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .ticks(10, "%");

// set width and height of chart
var svg = d3.select("main").append("svg")
    .attr("width", outerwidth)
    .attr("height", outerheight)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// read datas from file - don't know what "error" does?
d3.tsv("letters.tsv", type, function(error, data) {
  if (error) throw error;

  // scaling names and frequency
  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.freq; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("y", function(d) { return y(d.freq); })
      .attr("height", function(d) { return height - y(d.freq); })
      .attr("width", x.rangeBand());
});

// convert data to number +d: string --> number
function type(d) {
  d.freq = (+d.freq/100); // coerce to number
  return d;
} 

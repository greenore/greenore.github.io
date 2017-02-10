// SVG drawing area

var margin = {
    top: 40,
    right: 10,
    bottom: 60,
    left: 60
};

var width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Scales
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// Axes
var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(10)
    .orient("left");

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(10)
    .orient("bottom");

// Add the X Axis
svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the Y Axis
svg.append("g")
    .attr("class", "axis y-axis")
    .call(yAxis);

// Initialize data
loadData();

// Coffee chain data
var data;

// Load CSV file
function loadData() {
    d3.csv("data/coffee-house-chains.csv", function (error, csv) {

        csv.forEach(function (d) {
            d.revenue = +d.revenue;
            d.stores = +d.stores;
        });

        // Store csv data in global variable
        data = csv;

        // Draw the visualization for the first time
        updateVisualization();
    });
}


// Render visualization
function updateVisualization() {

    // Get selected group
    var group = d3.select("#ranking-type")
        .property("value");

    // Sort data
    data.sort(function (a, b) {
        return b[group] - a[group]
    });

    // Specify the domain 
    x.domain(data.map(function (d) {
        return d.company;
    }));

    y.domain([0, d3.max(data, function (d) {
        return d[group];
    })]);

    // SELECT / ENTER / UPDATE / REMOVE
    ///////////////////////////////////
    // SELECT
    var bar = svg.selectAll(".bar")
        .data(data);

    // ENTER
    bar.enter().append("rect");

    // UPDATE
    bar.attr("class", "bar")
        .transition()
        .duration(400)
        .ease("linear")
        .attr("x", function (d) {
            return x(d.company);
        })
        .attr("y", function (d) {
            return y(d[group]);
        })
        .attr("width", x.rangeBand())
        .attr("height", function (d) {
            return height - y(d[group]);
        });

    svg.selectAll(".x-axis")
        .transition()
        .duration(400)
        .ease("linear")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.selectAll(".y-axis") // change the y axis
        .transition()
        .duration(400)
        .ease("linear")
        .call(yAxis);

    // EXIT
    bar.exit().remove();

    // Log
    ///////
    console.log(data);

}

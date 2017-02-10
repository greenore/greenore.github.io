// SVG Area
var width = 1000,
    height = 600;

// Create MERCATOR projection
/*
var projection = d3.geo.mercator()
    .rotate([-10, 0])
    .center([0, 30])
    .scale(140);
*/

// With the ORTHOGRAPHIC projection
var projection = d3.geo.orthographic()
    .rotate([-10, 0])
    .center([0, 0])
    .scale(200);

// Select SVG
var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// Path
var path = d3.geo.path()
    .projection(projection);

var g = svg.append("g");

// Load data
var data1,
    data2;

queue()
    .defer(d3.json, "data/world-110m.json")
    .defer(d3.json, "data/airports.json")
    .await(createVisualization);

function createVisualization(error, data1_queue, data2_queue) {
    data1 = data1_queue;
    data2 = data2_queue;

    myArray = [];
    for (i = 0; i < data2.nodes.length; i++) {
        myArray[i] = [data2.nodes[i].longitude, data2.nodes[i].latitude];
    }

    var world = topojson.feature(data1, data1.objects.countries)
        .features

    g.selectAll("path")
        .data(world)
        .enter()
        .append("path")
        .attr("d", path)

    // add circles to svg
    svg.selectAll("circle")
        .data(data2.nodes).enter()
        .append("circle")
        .attr("class", "circle")
        .attr("transform", function (d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")"
        })
        /*        .attr("cx", function (d) {
                    return projection(d)[0];
                })
                .attr("cy", function (d) {
                    return projection(d)[1];
                })*/
        .attr("r", "5px")
};

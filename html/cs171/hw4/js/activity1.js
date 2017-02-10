var width = 400,
    height = 400;

// color
var color = d3.scale.category20();

// 1) INITIALIZE FORCE-LAYOUT
var force = d3.layout.force()
    .charge(-120)
    .linkDistance(20)
    .gravity(0.1)
    .size([width, height]);

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);

// Initialize data
loadData();

// Initialize data
var data; // global

// Load CSV file
function loadData() {
    d3.json("data/airports.json", function (error, json) {
        // Store json data in global variable
        data = json;

        // Error message
        if (error) throw error;

        // Draw the visualization for the first time
        updateVisualization();
    });
}


function updateVisualization() {
    console.log(data);

    // 2a) DEFINE 'NODES' AND 'EDGES'
    force
        .nodes(data.nodes)
        .links(data.links)
        .start();

    // 2b) START RUNNING THE SIMULATION

    // 3) DRAW THE LINKS (SVG LINE)
    var link = svg.selectAll(".link")
        .data(data.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", 2);

    // 4) DRAW THE NODES (SVG CIRCLE)
    var node = svg.selectAll(".node")
        .data(data.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 10)
        .style("fill", function (d) {
            if (d.country === "United States") {
                return "darkblue"
            } else {
                return "darkred"
            };
        })
        .call(force.drag);

    node.append("title")
        .text(function (d) {
            return d.name;
        });

    // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS
    force.on("tick", function () {
        link.attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node.attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    });
};

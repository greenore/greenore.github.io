// The function is called every time when an order comes in or an order gets processed
// The current order queue is stored in the variable 'orders'

var svg = d3.select("#chart-area").append("svg")
    .attr("width", 1000)
    .attr("height", 200);

var myText = svg.append("text")
    .attr("x", 20)
    .attr("y", 20)
    .attr("class", "text");

function updateVisualization(orders) {
    console.log(orders);

    // SELECT
    var circle = svg.selectAll("circle")
        .data(orders);

    // ENTER (initialize the newly added elements)
    circle.enter().append("circle");
    
    // Text
    myText.text("Orders: " + orders.length);

    // UPDATE (set the dynamic properties of the elements)
    circle
        .attr("r", 20)
        .attr("cx", function (d, index) {
            return (index * 80) + 50
        })
        .attr("cy", 90)
        .attr("class", function (d) {
            if (d.product === "tea") {
                return "dot tea";
            } else if (d.product === "coffee") {
                return "dot coffee";
            } else {
                return "dot";
            }
        });;

    // Exit
    circle.exit().remove();

};

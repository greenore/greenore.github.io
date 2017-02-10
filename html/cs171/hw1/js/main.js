// Add JSLint settings
/*jslint browser: true*/
/*global $, jQuery, alert, d3, console*/

var data;

// Load CSV file
d3.csv("data/wealth-health-2014.csv", function (dataset) {
    "use strict";
    data = dataset;

    // Margin object with properties for the four directions
    var margin = {
        top: 20,
        right: 10,
        bottom: 20,
        left: 10
    };

    // Width and height as the inner dimensions of the chart area
    var width = 700 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // Transform the data
    data.forEach(function (d) {
        d.Income = +d.Income;
        d.LifeExpectancy = +d.LifeExpectancy;
        d.Population = +d.Population;
    });

    // Filter missing variables (i.e., Taiwan)
    var data = data.filter(function (value) {
        return value.Population != 0 &
            value.LifeExpectancy != 0 &
            value.Income != 0 &
            value.Country != "" &
            value.Region != "";
    });

    // Sort data by Population
    data = data.sort(function (a, b) {
        return b.Population - a.Population;
    });

    // Define SVG area
    var svg = d3.select("#chart-area").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create group element
    var group = svg.append("g");

    // Create linear scales
    var padding = 25;
    var lifeExpectancyMin = d3.min(data, function (d) {
        return d.LifeExpectancy;
    });
    var lifeExpectancyMax = d3.max(data, function (d) {
        return d.LifeExpectancy;
    });

    var incomeMin = d3.min(data, function (d) {
        return d.Income;
    });
    var incomeMax = d3.max(data, function (d) {
        return d.Income;
    });

    var xScale = d3.scale.log()
        .domain([incomeMin - 100, incomeMax + 100])
        .range([padding, width - padding]);

    var yScale = d3.scale.linear()
        .domain([lifeExpectancyMin - 2, lifeExpectancyMax + 2])
        .range([height - padding, padding]);

    var rScale = d3.scale.linear()
        .domain([0, d3.max(data, function (d) {
            return d.Population;
        })])
        .range([4, 30]);

    // Color categories for region    
    var colorScale = d3.scale.category10()
        .domain(data.map(function (d) {
            return d.Region
        }));

    // Create scatterplot
    var circle = group.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "scatterplot")
        .attr("cx", function (d) {
            return xScale(d.Income);
        })
        .attr("cy", function (d) {
            return yScale(d.LifeExpectancy);
        })
        .attr("fill", function (d) {
            return colorScale(d.Region);
        })
        .attr("stroke", "black")
        .attr("r", function (d) {
            return rScale(d.Population);
        });

    // Add axes
    // Create a generic axis function
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .ticks(20, "1")
        .tickValues([1000, 2000, 4000, 8000, 16000, 32000, 100000])
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    // Draw the axis
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + (height - padding) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "axis y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);

    // Add labels
    svg.append("text")
        .attr("x", height + 19)
        .attr("y", height - 35)
        .text("Income per Person (GDP per Capita)");

    svg.append("text")
        .attr("x", -102)
        .attr("y", 40)
        .text("Life Expectancy")
        .attr("transform", "rotate(-90)");

    // Analyze the dataset in the web console
    console.log(data);
    console.log("Countries: " + data.length);

    console.log([height, width]);

    console.log(xScale(5000)); // Returns: 23.2763
    console.log(yScale(68)); // Returns: 224.7191

});

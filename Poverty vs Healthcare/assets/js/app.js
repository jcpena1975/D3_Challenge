//D3 Challenge

//SVG definitions
var svgWidth = 960;
var svgHeight = 620;

// borders in svg
var margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

// chart height and width
var width = svgWidth - margin.right - margin.left;//820
var height = svgHeight - margin.top - margin.bottom;//400

// // append a div class to the scatter element
// var chart = d3.select('#scatter')
//   .append('svg')
//   .attr("width", )
  
  //append an svg element to the chart 
var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);


//append an svg group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("assets/data/data.csv").then(function(healthData){

//initial parameters; x and y axis
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';


healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  var xLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d.healthcare) * 0.9, d3.max(healthData, d => d.healthcare) + 1.5])
  .range([0, width]);
console.log(d3.min(healthData, d => d.healthcare))
  var yLinearScale = d3.scaleLinear()
  .domain([d3.min(healthData, d => d.poverty) * 0.9, d3.max(healthData, d => d.poverty) + 1.5])
  .range([height, 0]);

     // axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //  Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    //create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill","purple")
    .classed("stateCircle",true);

    chartGroup.selectAll()
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.healthcare))
    .attr("y", d => yLinearScale(d.poverty))
    .text(d=> d.abbr)
    .attr("font-size", "10px")
    .style("fill", "black")
    .classed("stateText",true);

    //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>Poverty-${d.poverty} <br>Healthcare-${d.healthcare}`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', function(d){toolTip.show(d,this)})
    .on('mouseout',function(d){toolTip.hide(d)});


    // // Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Poverty Levels");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
.attr("class", "axisText")
.text("Healthcare Coverage");
}).catch(function(error) {
console.log(error);
});




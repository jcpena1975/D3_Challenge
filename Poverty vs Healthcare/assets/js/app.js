//D3 Challenge


// Set up SVG definitions
var svgWidth = 960;
var svgHeight = 620;

// set up borders in svg
var margin = {
  top: 20, 
  right: 40, 
  bottom: 200,
  left: 100
};

// calculate chart height and width
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

// append a div class to the scatter element
var chart = d3.select('#scatter')
  .append('div')
  .classed('chart', true);

//append an svg element to the chart 
var svg = d3.select(".chart")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);


//append an svg group
var chartGroup = svg.append('g')
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Import Data
d3.csv("data.csv").then(function(daTa){

//initial parameters; x and y axis
var chosenXAxis = 'poverty';
var chosenYAxis = 'healthcare';


  pVSh_Data.forEach(function(data) {
    data.income = +data.income;
    data.healthcare = +data.healthcare;
  });

  // Step 2: Create scale functions
  var xLinearScale = d3.scaleLinear()
  .domain([20, d3.max(pVSh_Data, d => d.data.healthcare)])
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(pVSh_Data, d => d.income)])
  .range([height, 0]);

     // Step 3: Create axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

// // updating y-scale variable upon click of label
// function yScale(censusData, chosenYAxis) {
//   //scales
//   var yLinearScale = d3.scaleLinear()
//     .domain([d3.min(censusData, d => d[chosenYAxis]) * 0.8,
//       d3.max(censusData, d => d[chosenYAxis]) * 1.2])
//     .range([height, 0]);

//   return yLinearScale;
// }
// //a function for updating the xAxis upon click
// function renderXAxis(newXScale, xAxis) {
//   var bottomAxis = d3.axisBottom(newXScale);

//   xAxis.transition()
//     .duration(2000)
//     .call(bottomAxis);

//   return xAxis;
// }

//function used for updating yAxis variable upon click
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(2000)
    .call(leftAxis);

  return yAxis;
}

//a function for updating the circles with a transition to new circles 
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(2000)
      .attr('cx', data => newXScale(data[chosenXAxis]))
      .attr('cy', data => newYScale(data[chosenYAxis]))

    return circlesGroup;
}

//function for updating STATE labels
function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(2000)
      .attr('x', d => newXScale(d[chosenXAxis]))
      .attr('y', d => newYScale(d[chosenYAxis]));

    return textGroup
}
//function to stylize x-axis values for tooltips
function styleX(value, chosenXAxis) {

    //style based on variable
    //poverty
    if (chosenXAxis === 'poverty') {
        return `${value}%`;
    }
    //household income
    else if (chosenXAxis === 'income') {
        return `${value}`;
    }
    else {
      return `${value}`;
    }
}

//funtion for updating circles group
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    //poverty, x label
    if (chosenXAxis === 'poverty') {
      var xLabel = 'Poverty Levels:';
    }
        
    //healthcare, Y label
    if (chosenYAxis ==='healthcare') {
    var yLabel = "No Healthcare Coverage:"
  }
    
  //create tooltip
  var toolTip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-8, 0])
    .html(function(d) {
        return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}%`);
  });

  circlesGroup.call(toolTip);

  //add
  circlesGroup.on('mouseover', toolTip.show)
    .on('mouseout', toolTip.hide);

    return circlesGroup;
}
//retrieve data
d3.csv('./assets/data/data.csv').then(function(censusData) {

    console.log(censusData);
    
    //Parse data
    censusData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //create linear scales
    var xLinearScale = xScale(censusData, poverty);
    var yLinearScale = yScale(censusData, healthcare);

    //create x axis
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //append X
    var xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

    //append Y
    var yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      //.attr
      .call(leftAxis);
    
    //create Circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.healthcare))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", "15")
    .attr("fill", "purple")
    .attr("opacity", ".5");

   //  tool tip
        var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.pVSh_Data}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Create tooltip in the chart
        chartGroup.call(toolTip);

// Create axes labels
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 40)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Poverty Levels");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
.attr("class", "axisText")
.text("No Healthcare Coverage");
}).catch(function(error) {
console.log(error);
});



//     //create a group for the x axis labels
//     var xLabelsGroup = chartGroup.append('g')
//       .attr('transform', `translate(${width / 2}, ${height + 10 + margin.top})`);

//     var povertyLabel = xLabelsGroup.append('text')
//       .classed('aText', true)
//       .classed('active', true)
//       .attr('x', 0)
//       .attr('y', 20)
//       .attr('value', 'poverty')
//       .text('In Poverty (%)');
      
    
//         //create a group for Y labels
//     var yLabelsGroup = chartGroup.append('g')
//       .attr('transform', `translate(${0 - margin.left/4}, ${height/2})`);

//     var healthcareLabel = yLabelsGroup.append('text')
//       .classed('aText', true)
//       .classed('active', true)
//       .attr('x', 0)
//       .attr('y', 0 - 20)
//       .attr('dy', '1em')
//       .attr('transform', 'rotate(-90)')
//       .attr('value', 'healthcare')
//       .text('Without Healthcare (%)');
    
//     var smokesLabel = yLabelsGroup.append('text')
//       .classed('aText', true)
//       .classed('inactive', true)
//       .attr('x', 0)
//       .attr('y', 0 - 40)
//       .attr('dy', '1em')
//       .attr('transform', 'rotate(-90)')
//       .attr('value', 'smokes')
//       .text('Smoker (%)');
         
//     //update the toolTip
//     var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//     //x axis event listener
//     xLabelsGroup.selectAll('text')
//       .on('click', function() {
//         var value = d3.select(this).attr('value');

//         if (value != chosenXAxis) {
       
//           xLinearScale = xScale(censusData, chosenXAxis);

//           xAxis = renderXAxis(xLinearScale, xAxis);
//           circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//           //update text 
//           textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//           //update tooltip
//           circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//           //change of classes changes text
//           if (chosenXAxis === 'poverty') {
//             povertyLabel.classed('active', true).classed('inactive', false);
            
                
//            };
//     //y axis lables event listener
//     yLabelsGroup.selectAll('text')
//       .on('click', function() {
//         var value = d3.select(this).attr('value');

//         if(value !=chosenYAxis) {
           
//             chosenYAxis = value;

            
//             yLinearScale = yScale(censusData, chosenYAxis);

//             //update Y axis 
//             yAxis = renderYAxis(yLinearScale, yAxis);

//             //Udate CIRCLES with new y
//             circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//             //update TEXT with new Y values
//             textGroup = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

//             //update tooltips
//             circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

//             //Change of the classes changes text
//             if (chosenYAxis === 'obesity') {
//               healthcareLabel.classed('active', false).classed('inactive', true);
//             }
//             }
//         });
// };


// // // D3 Assignment 16 "Poverty vs Obesity"
// // d3.select("ul").selectAll("li");

// // d3.select("ul").selectAll("li")
// //     .each(function(d, i) {
// //       console.log("element", this);
// //       console.log("data", d);
// //       console.log("index", i);
// //     });

// // function makeResponsive() {
// // var svgArea = d3.select("body").select("svg");

// if (!svgArea.empty()) {
//   svgArea.remove();
// }

// var svgWidth = window.innerWidth;
// var svgHeight = window.innerHeight;


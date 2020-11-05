// D3 Assignment 16 "Poverty vs Obesity"
d3.select("ul").selectAll("li");

d3.select("ul").selectAll("li")
    .each(function(d, i) {
      console.log("element", this);
      console.log("data", d);
      console.log("index", i);
    });

function makeResponsive() {
var svgArea = d3.select("body").select("svg");

if (!svgArea.empty()) {
  svgArea.remove();
}

var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  bottom: 50,
  right: 50,
  left: 50
}};
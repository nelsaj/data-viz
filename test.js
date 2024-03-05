import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = 
[
    {name: "a", ammount: 1},
    {name: "b", ammount: 5},
    {name: "c", ammount: 2},
    {name: "d", ammount: 1},
    {name: "e", ammount: 7},
    {name: "f", ammount: 6},
];

const hSvg = 600, wSvg = 600,
    hViz = hSvg * .9, wViz = wSvg * .9,
    wPad = (wSvg - wViz) / 2, hPad = (hSvg - hViz) / 2;

const innerRadius = 125;
const outerRadius = Math.min(wViz, hViz) / 2;

const maxSkala = 10;
let names = data.map(d => d.name);

let yScale = d3.scaleRadial()
    .domain([0, maxSkala]) 
    .range([innerRadius, outerRadius]);        
let xScale = d3.scaleBand()
    .domain(names)
    .range([0, 2 * Math.PI])
let wBar = xScale.bandwidth();

////////////////

let svg = d3.select("body").append("svg")
    .attr("height", hSvg)
    .attr("width", wSvg)

let g = svg.append("g")
    .attr("transform", `translate(${outerRadius + wPad}, ${outerRadius + hPad})`);
g
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("fill", "blue")
    .attr("d", d3.arc()     // imagine your doing a part of a donut plot
          .innerRadius(innerRadius)
          .outerRadius(function(d) { return yScale(d.ammount); })
          .startAngle(function(d) { return xScale(d.name); })
          .endAngle(function(d) { return xScale(d.name) + wBar; })
          .padAngle(0.1)
          .padRadius(innerRadius))


svg.append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
      .attr("text-anchor", function(d) { return (xScale(d.name) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
      .attr("transform", function(d) { return "rotate(" + ((xScale(d.name) + xScale.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (yScale(d['ammount'])+10) + ",0)"; })
    .append("text")
      .text(function(d){return(d.name)})
      .attr("transform", function(d) { return (xScale(d.name) + xScale.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
      .style("font-size", "11px")
      .attr("alignment-baseline", "middle")

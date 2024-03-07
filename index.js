import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { give } from "./js/filtering.js";

let h = [];
(async function () {
    for (let i = 0; i < 10; i++) {
        h.push(await give(i));
    }
})()
console.log(h);

// let dataset = [ {name:"itzi",apples:35}, {name:"ona",apples:63}, {name:"lola",apples:35} ];

const hSvg = 800, wSvg = 600,
    hViz = hSvg * .9, wViz = wSvg * .9,
    wPad = (wSvg - wViz) / 2, hPad = (hSvg - hViz) / 2;

let nMax = 0;
h.forEach(data => {if(data.Global_Sales > nMax) nMax = data.Global_Sales});

let names = h.map(d => d.Name);
let global_sales = h.map(d => d.Global_Sales);

let yScale = d3.scaleLinear()
    .domain([0, nMax * 1.2]) // nTop = 20% mer än nMax
    .range([hViz, 0]);        // inverterad range!
let xScale = d3.scaleBand()
    .domain(names)
    .range([0, wViz])
    .paddingInner(.15)
    .paddingOuter(.3);
let wBar = xScale.bandwidth;


let axisFunctionY = d3.axisLeft(yScale);
let axisFunctionX = d3.axisBottom(xScale);


////////////////////////

let svg = d3.select("body").append("svg")
    .attr("height", hSvg)
    .attr("width", wSvg)

let g = svg.append("g")
    .attr("transform", `translate(${wPad}, ${hPad})`)
// svg
//     .append("g")    
//     .call(axisFunctionY)
//     .attr("transform", `translate(${wPad}, ${hPad})`);
// svg
//     .append("g")    
//     .call(axisFunctionX)
//     .attr("transform", `translate(${wPad}, ${hViz + hPad})`)


let bars = g.selectAll("rect")
    .data(h)
    .enter()
    .append("rect")
    .attr("height", (d, i) => hViz - yScale(d.Global_Sales))
    .attr("width", wBar)
    .attr("y", (d, i) => yScale(d.Global_Sales)) 
    .attr("x", (d, i) => xScale(d.Name))
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";

function create_xScale(dataset) {
    console.log("etryfugihojkplp");
    let xScale = d3.scaleBand()
            .domain(dataset.map(d => d.Name))
            .range([0, variable.wViz])
            .paddingInner(.1)
            .paddingOuter(.1);
    return xScale;
}

function create_yScale (dataset) {
    let global_max = 0;
    dataset.forEach( d => { if (d.Global_Sales > global_max) global_max = d.Global_Sales });
    let yScale = d3.scaleLinear()
        .domain([0, global_max * 1.5])
        .range([variable.hViz, 0]);  
    return yScale;
}

export async function create_sales_circles (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);

    let xScale = create_xScale(dataset);

    console.log(dataset);
    let g = d3.select(".wrapper").append("g");
    create_circle("JP", "red");
    create_circle("EU", "green");
    create_circle("NA", "blue");
    create_circle("Global", "pink");

    function create_circle (sale_type, color) {
        g
            .selectAll("rect")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("r", d => d[`${sale_type}_Sales`])
            .attr("fill", color)
            .attr("x", d => {xScale(d.Name); console.log(xScale(d.Name)); return 5000})
    }

}
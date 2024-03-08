import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { get_color } from "./colors.js";
import * as variable from "./variables.js";
import { yScale_for_lines } from "./bar_chart.js";


function create_xScale (dataset) {
    let xScale = d3.scaleBand()
    .domain(dataset.map(d => d.Name))
    .range([0, variable.wViz])
    .paddingInner(1)
    .paddingOuter(.5)
    return xScale;
}
function create_yScale (dataset) {
    let yScale = d3.scaleLinear()
    .domain([1975, 2015]) 
    .range([variable.hViz * .3, 0]);  
    return yScale;
}    

export async function create_line_chart (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);

    const yScale = create_yScale(dataset);
    const xScale = create_xScale(dataset);

    let axisFunctionY = d3.axisLeft(create_yScale(dataset)).tickValues([1975, 1985, 1995, 2005, 2015]).tickFormat(d3.format("d"));

    
    let sharedG = d3.select(".wrapper").append("g")
        .attr("transform", `translate(0, ${-variable.hPad + 20})`)
    // .attr("fill", "red");
    
    sharedG // y
        .append("g")
        .classed("yAxis", true)    
        .call(axisFunctionY)
        // .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`);

    sharedG.append("g")
        .classed("g_dots", true)

        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr("fill", d => get_color(d.Genre))
        .attr("r", 5)
        .attr("cy", (d, i) => yScale(d.Year)) 
        .attr("cx", (d, i) => xScale(d.Name))

    sharedG.append("g")
        .classed("g_lines", true)
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("line")
        .attr("stroke", "black")
        .attr("x1", (d, i) => xScale(d.Name))
        .attr("x2", (d, i) => xScale(d.Name))
        .attr("y1", (d, i) => yScale(d.Year)) 
        .attr("y2", d => yScale_for_lines(dataset, d));

    d3.selectAll(".yAxis .tick")
        .append("line")
        .classed("thickLine", true)
        .attr("stroke-width", 2.5)
        .attr("stroke", "black")
        .attr("x1", 0)
        .attr("x2", variable.wViz);
        // let axisFunctionX = d3.axisBottom(create_xScale(dataset));

    d3.select(".domain").attr("stroke", "");

}

export function update_line_chart (old_data, new_data) {
    const yScale = create_yScale(old_data);
    // const xScale = create_xScale(new_data);

    d3.select(".g_dots").selectAll("circle")
        .data(new_data)
        .transition()
        .attr("fill", d => get_color(d.Genre))
        .attr("cy", (d) => yScale(d.Year)) 
        // .attr("fill", d => get_color(d.Genre))

    d3.select(".g_lines").selectAll("line")
        .data(new_data)
        .transition()
        .attr("y1", (d, i) => yScale(d.Year)) 
        .attr("y2", d => yScale_for_lines(old_data, d)) 
}

// for (let i = 1; i < d3.selectAll(".yAxis .tick").size(); i++) {
//     // if(i % 2 != 0) continue;
//     const parent = d3.selectAll(".yAxis .tick")['_groups'][0][i];
//     console.log(parent);
//     let parentTransform;
//     for (const h of parent.attributes) {
//         if(h.name == "transform") parentTransform = h;
//     }
//     //filter
//     let fixed = parentTransform.value.replace("translate", "").replace("(", "").replace(")", "").split(",");
//     const x = JSON.parse(fixed[0]);
//     const y = JSON.parse(fixed[1]);
//     console.log(x, y);

//     d3.select(".yAxis").append("g")
//         .attr("transform", `translate(${x},${y + 67.5})`)
//         .append("line")
//         .attr("stroke-width", 1)
//         .attr("stroke", "blue")
//         .attr("x1", 0)
//         .attr("x2", hViz)
// }


import { get_color } from "./colors.js";
import * as variable from "./variables.js";
import { get_y2_line } from "./bar_chart.js";
import { tooltip } from "./tooltip.js";

function create_xScale (dataset) {
    let xScale = d3.scaleBand()
    .domain(dataset.map(d => d.Name))
    .range([0, variable.wViz])
    return xScale;
}

function create_yScale (dataset) {
    let yScale = d3.scaleLinear()
    .domain([1975, 2015]) 
    .range([variable.hViz * .3, 0]);  
    return yScale;
}    

export function create_line_chart (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);

    const yScale = create_yScale(dataset);
    const xScale = create_xScale(dataset);

    let axisFunctionY = d3.axisLeft(create_yScale(dataset)).tickValues([1975, 1985, 1995, 2005, 2015]).tickFormat(d3.format("d"));

    let sharedG = d3.select(".wrapper").append("g")
    
    sharedG
        .append("g")
        .classed("yAxis", true)    
        .call(axisFunctionY)

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
        .attr("cx", (d, i) => xScale(d.Name) + (d3.select(".bar").attr("width") * 1.1 / 2));
    
    d3.select(".g_dots").selectAll("circle") 
        .on("mouseover", tooltip.mouseover)
        .on("mousemove", (event, d) => tooltip.mousemove(event, d, `<p><span>${d.Name}</span></p><p>Released: ${d.Year}</p>`))
        .on("mouseleave", tooltip.mouseleave)

    let nodeList = d3.selectAll(".game_title")["_groups"][0];

    sharedG.append("g")
        .classed("g_lines", true)
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("line")
        .attr("stroke", d => get_color(d.Genre))
        .attr("x1", (d, i) => xScale(d.Name)  + (d3.select(".bar").attr("width") * 1.1 / 2))
        .attr("x2", (d, i) => xScale(d.Name)  + (d3.select(".bar").attr("width") * 1.1 / 2))
        .attr("y1", (d, i) => yScale(d.Year) + variable.pad/2) 
        .attr("y2", d => get_y2_line(dataset, d, nodeList)); 

    let ticks = d3.selectAll(".yAxis .tick")

    ticks
        .selectAll("line")
        .remove();
    d3.select(".domain").attr("stroke", null);

    ticks
        .append("line")
        .classed("thickLine", true)
        .attr("stroke-width", 2.5)
        .attr("stroke", "black")
        .attr("x1", 0)
        .attr("x2", variable.wViz);
}

export function update_line_chart (old_data, new_data, nodeList) {
    const yScale = create_yScale(old_data);

    d3.select(".g_dots").selectAll("circle")
        .data(new_data)
        .transition()
        .duration(variable.timer)
        .attr("fill", d => get_color(d.Genre))
        .attr("cy", (d) => yScale(d.Year)) 

    d3.select(".g_dots").selectAll("circle") 
        .on("mouseover", tooltip.mouseover)
        .on("mousemove", (event, d) => tooltip.mousemove(event, d, `<p>Title: ${d.Name}</p><p>Released: ${d.Year}</p>`))
        .on("mouseleave", tooltip.mouseleave)

    d3.select(".g_lines").selectAll("line")
        .data(new_data)
        .transition()
        .duration(variable.timer)
        .attr("stroke", d => get_color(d.Genre))
        .attr("y1", (d, i) => yScale(d.Year) + variable.pad) 
        .attr("y2", d => get_y2_line(old_data, d, nodeList)) 
}

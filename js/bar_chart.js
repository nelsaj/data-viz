import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";
import { get_color } from "./colors.js";

function create_xScale(dataset) {
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

export async function create_bar_chart (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);
    console.log(dataset);
    
    let xScale = create_xScale(dataset);
    let yScale = create_yScale(dataset);    

    let wBar = xScale.bandwidth;

    let sharedG = d3.select(".wrapper").append("g")
        .classed("bar_G", true)
        

    let gviz_bars = sharedG.append("g")
        .classed("g_bars", true)
        // .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`);

    gviz_bars.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")  
        .classed("bar", true) 
        .attr("fill", d => get_color(d.Genre))
        .attr("width", wBar)
        .attr("x", setX)
        .attr("y", setY)
        .attr("height", setH)

    sharedG
        .attr("transform", `translate(0, ${variable.hViz - sharedG.select(".bar").attr("height")})`);

    let gviz_text = sharedG.append("g")
        .classed("g_text", true);
    
    gviz_text
        // .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`)
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("text")
        .classed("game_title", true)
        .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
        .text(set_text_content)

    // const textElement = document.querySelector(".game_title");
    // let style = window.getComputedStyle(textElement);
    // let lineHeight = style.lineHeight;
    // d3.selectAll(".game_title").attr("transform", `translate(0, ${lineHeight/2})`)
    // d3.selectAll(".game_title")
    


    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return variable.hViz - yScale(d.Global_Sales); }
    function setX_text (d, i) { return xScale(d.Name) + (xScale.bandwidth()/2)} // - lineheight /2
    function setY_text (d) {return yScale(d.Global_Sales)}
    function set_text_content (d) {return d.Name}
}

export function update_bar_chart (old_data, new_data) {
    let xScale = create_xScale(new_data);
    let yScale = create_yScale(old_data);

    console.log(new_data);
    d3.select(".g_bars").selectAll("rect")
        .data(new_data)
        .transition()
        .attr("fill", d => get_color(d.Genre))
        .attr("height", setH)
        .attr("y", setY);

    // const sharedG = d3.select(".bar_G");
    // sharedG
    //     .attr("transform", `translate(${variable.wPad}, ${variable.hSvg - sharedG.select(".bar").attr("height")})`);

    d3.select(".g_text").selectAll("text")
        .data(new_data)
        .transition()
        .text(set_text_content)
        .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
    
    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return variable.hViz - yScale(d.Global_Sales); }
    function setX_text (d, i) { return xScale(d.Name) + (xScale.bandwidth()/2)} // - lineheight /2
    function setY_text (d) {return yScale(d.Global_Sales)}
    function set_text_content (d) {return d.Name}
    
}
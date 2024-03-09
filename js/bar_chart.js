import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";
import { get_color } from "./colors.js";
import { update_line_chart } from "./linechart.js";
let highest_bar;

function create_xScale(dataset) {
    let xScale = d3.scaleBand()
            .domain(dataset.map(d => d.Name))
            .range([0, variable.wViz])
            .paddingInner(.1)
            .paddingOuter(.05);
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

    highest_bar = d3.select(".bar_G").select(".bar").attr("height");

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
        // .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
        .text(set_text_content)


    const textElement = document.querySelector(".game_title");
    let style = window.getComputedStyle(textElement);
    let fontSize = style.fontSize;
    fontSize.substring(0, 2)
    fontSize = parseInt(fontSize);

    d3.selectAll(".game_title") 
        .attr("transform", d => `translate(${setX_text(d) + fontSize/4}, ${setY_text(d) - 10})rotate(-90)`)
    


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
        .duration(variable.timer)
        .attr("fill", d => get_color(d.Genre))
        .attr("height", setH)
        .attr("y", setY);

    // const sharedG = d3.select(".bar_G");
    // sharedG
    //     .attr("transform", `translate(${variable.wPad}, ${variable.hSvg - sharedG.select(".bar").attr("height")})`);

    const textElement = document.querySelector(".game_title");
    let style = window.getComputedStyle(textElement);
    let fontSize = style.fontSize;
    fontSize.substring(0, 2)
    fontSize = parseInt(fontSize);

    d3.select(".g_text").selectAll("text")
        .data(new_data)
        .transition()
        .duration(variable.timer)
        .text(set_text_content)
        .attr("transform", d => `translate(${setX_text(d) + fontSize/3}, ${setY_text(d) - 10})rotate(-90)`)
    
    setTimeout( () => {
        let nodeList = d3.selectAll(".game_title")["_groups"][0];
        update_line_chart(old_data, new_data, nodeList)
    , 100})

    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return variable.hViz - yScale(d.Global_Sales); }
    function setX_text (d, i) { return xScale(d.Name) + (xScale.bandwidth()/2)} // - lineheight /2
    function setY_text (d) {return yScale(d.Global_Sales)}
    function set_text_content (d) {return d.Name}
    
}

export function yScale_for_lines (dataset, d, nodeList) {
    let text_length;
    console.log(nodeList);
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].__data__.Name == d.Name) {
            text_length = nodeList[i].getComputedTextLength();
            break;
        };
    }

    let yScale = create_yScale(dataset);
    let value = yScale(d.Global_Sales) + variable.hPad - variable.pad + variable.hViz - highest_bar - text_length - variable.pad; //  transform Y: bar_G(-167.5) + g(125) = 292.5
    return value; 
}

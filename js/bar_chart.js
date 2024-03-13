import * as variable from "./variables.js";
import { get_color } from "./colors.js";
import { update_line_chart } from "./linechart.js";
import { tooltip } from "./tooltip.js";

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

export function create_bar_chart (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);
    
    let xScale = create_xScale(dataset);
    let yScale = create_yScale(dataset);    

    let wBar = xScale.bandwidth();

    let sharedG = d3.select(".wrapper").append("g")
        .classed("bar_G", true)
        

    let g_bars = sharedG.append("g")
        .classed("g_bars", true)

    g_bars.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")  
        .attr("class", "bar") 
        .attr("fill", d => get_color(d.Genre))
        .attr("width", wBar)
        .attr("x", d => xScale(d.Name))
        .attr("y", d => yScale(d.Global_Sales))
        .attr("height", d => variable.hViz - yScale(d.Global_Sales))

    g_bars.selectAll("rect") 
        .on("mouseover", tooltip.mouseover)
        .on("mousemove", (event, d) => tooltip.mousemove(event, d, `<p><span>${d.Name}<span></p><p>Global Sales: ${d.Global_Sales.toFixed(2)} million</p><p>Publisher: ${d.Publisher}</p><p>Platforms: ${d.Platforms.join(", ")}</p>`))
        .on("mouseleave", tooltip.mouseleave)

    highest_bar = d3.select(".bar_G").select(".bar").attr("height");

    sharedG
        .attr("transform", `translate(0, ${variable.hViz - highest_bar})`);

    let g_text = sharedG.append("g")
        .classed("g_text", true);
    
    g_text
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("text")
        .classed("game_title", true)
        .text( d => d.Name)

    const textElement = document.querySelector(".game_title");
    let style = window.getComputedStyle(textElement);
    let fontSize = style.fontSize;
    fontSize.substring(0, 2)
    fontSize = parseInt(fontSize);

    d3.selectAll(".game_title") 
        .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
    
    function setX_text (d, i) { return xScale(d.Name) + wBar/2 + fontSize/4}
    function setY_text (d) {return yScale(d.Global_Sales) - variable.pad/2}
}

export function update_bar_chart (dataset, filtered_data) {
    let xScale = create_xScale(filtered_data);
    let yScale = create_yScale(dataset);

    d3.select(".g_bars").selectAll(".bar")
        .data(filtered_data)
        .transition()
        .duration(variable.timer)
        .attr("fill", d => get_color(d.Genre))
        .attr("height", d => variable.hViz - yScale(d.Global_Sales))
        .attr("y", d => yScale(d.Global_Sales))

    d3.select(".g_bars").selectAll(".bar")
        .on("mouseover", tooltip.mouseover)
        .on("mousemove", (event, d) => tooltip.mousemove(event, d, `<p><span>${d.Name}</span></p><p>Global Sales: ${d.Global_Sales.toFixed(2)} million</p><p>Platforms: ${d.Platforms.join(", ")}</p>`))
        .on("mouseleave", tooltip.mouseleave)

    const textElement = document.querySelector(".game_title");
    let style = window.getComputedStyle(textElement);
    let fontSize = style.fontSize;
    fontSize.substring(0, 2)
    fontSize = parseInt(fontSize);

    d3.select(".g_text").selectAll("text")
        .data(filtered_data)
        .transition()
        .duration(variable.timer)
        .text(set_text_content)
        .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
    
    setTimeout( () => {
        let nodeList = d3.selectAll(".game_title")["_groups"][0];
        update_line_chart(dataset, filtered_data, nodeList)
    , 100})

    function setX_text (d, i) { return xScale(d.Name) + (xScale.bandwidth()/2) + fontSize/3} // - lineheight /2
    function setY_text (d) {return yScale(d.Global_Sales) - variable.pad/2}
    function set_text_content (d) {return d.Name}
}

export function get_y2_line (dataset, d, nodeList) {
    let text_width;
    for (let i = 0; i < nodeList.length; i++) {
        if (nodeList[i].__data__.Name == d.Name) {
            text_width = nodeList[i].getComputedTextLength();
            break;
        };
    }

    let yScale = create_yScale(dataset);
    let value = yScale(d.Global_Sales) + variable.hViz - highest_bar - text_width - variable.pad;
    return value; 
}
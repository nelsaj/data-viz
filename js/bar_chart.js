import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";

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
        .domain([0, global_max * 1.2])
        .range([variable.hViz, 0]);  
    return yScale;
}

export async function create_bar_chart (dataset) {

    //FILTER DATASET
    dataset = dataset.slice(0, 10);
    console.log(dataset);
    
    let xScale = create_xScale(dataset);
    let yScale = create_yScale(dataset);    

    let wBar = xScale.bandwidth;

    let gviz_bars = d3.select("svg").append("g")
        .classed("g_bars", true)
        .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`);

    gviz_bars.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")  
        .classed("bar", true) 
        .attr("width", wBar)
        .attr("x", setX)
        .attr("y", setY)
        .attr("height", setH)

    let gviz_text = d3.select("svg").append("g")
        .classed("g_text", true);
    
    gviz_text
        .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`)
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("text")
        .classed("game_title", true)
        .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
        .text(set_text_content)

    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return variable.hViz - yScale(d.Global_Sales); }
    function setX_text (d, i) { return xScale(d.Name) + (xScale.bandwidth()/2)} // - lineheight /2
    function setY_text (d) {return yScale(d.Global_Sales + 5)}
    function set_text_content (d) {return d.Name}
}

export function update_bar_chart (new_data) {
    let xScale = create_xScale(new_data);
    let yScale = create_yScale(new_data);

    console.log(new_data);
    d3.select(".g_bars").selectAll("rect")
        .data(new_data)
        .transition()
        .attr("height", setH)
        .attr("y", setY);

    d3.select(".g_text").selectAll("text")
        .data(new_data)
        .transition()
        .text(set_text_content)
        .attr("transform", d => `translate(${setX_text(d)}, ${setY_text(d)})rotate(-90)`)
    
    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return variable.hViz - yScale(d.Global_Sales); }
    function setX_text (d, i) { return xScale(d.Name) + (xScale.bandwidth()/2)} // - lineheight /2
    function setY_text (d) {return yScale(d.Global_Sales + 5)}
    function set_text_content (d) {return d.Name}
    
}
import * as variable from "./variables.js";
import { tooltip } from "./tooltip.js";

function create_xScale(dataset) {
    let xScale = d3.scaleBand()
            .domain(dataset.map(d => d.Name))
            .range([0, variable.wViz])
    return xScale;
}

function sizeScale (Global_Sales) {
    let sizeScale = d3.scaleLinear()
        .domain([0, Global_Sales])
        .range([4, 28])
    return sizeScale;
}

function create_colorScale () {
    let sale_types = ["NA", "EU", "JP", "Other"];
    let colors = ["aqua", "yellowgreen", "hotpink", "lightgray"];

    let color_scale = d3.scaleOrdinal()
        .domain(sale_types)
        .range(colors)

    return color_scale;
}

export function create_sales_circles (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);

    let xScale = create_xScale(dataset);
    let color_scale = create_colorScale();

    let sharedG = d3.select(".wrapper").append("g");
    sharedG.classed("salesCircles", true)

    let legend = d3.legendColor(color_scale);
    legend
        .scale(color_scale)
    d3.select("svg").append("g")
        .attr("class", "legendHolder")
        .call(legend)
        .attr("transform", `translate(0, ${+variable.pad * 3})`)

    sharedG
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("g")
        .classed("g_circle_group", true)
        .attr("transform", d => `translate(${xScale(d.Name) + (d3.select(".bar").attr("width") * 1.1 / 2)}, ${-variable.hPad + variable.pad * 3})`); 

    for (let i = 0; i < dataset.length; i++) { 
        let circle_group = d3.select(`.g_circle_group:nth-child(${i + 1})`).selectAll('rect').data([dataset[i]]).enter();

        init_circles(circle_group);

    }

}

function init_circles (parent, update = null) {
    let sale_types = ["NA", "EU", "JP", "Other"];
    let sale_types_pairs = [];
    let color_scale = create_colorScale();

    parent.each(d => {
        sale_types.forEach(type => sale_types_pairs.push([type, d[`${type}_Sales`]]));
    });

    sale_types_pairs.sort((a, b) => b[1] - a[1]);

    sale_types_pairs.forEach((type, i) => {
        let past_sale_type = 0;
        if(i !== 0) past_sale_type = sale_types_pairs[i - 1][0];

        if(update) create_circle(parent, type[0], color_scale(type[0]), i, past_sale_type, true);
        else create_circle(parent, type[0], color_scale(type[0]), i, past_sale_type);
    })
}

let past_circle_y = null;
function create_circle (parent, sale_type, color, index, past_sale_type, update = null) {

    let circle;

    if(update) {
        circle = parent.select(`circle:nth-child(${index + 1})`);
    } else {
        circle = parent
            .append("circle")}
    
    circle
        .on("mouseover", tooltip.mouseover)
        .on("mousemove", (event, d) => tooltip.mousemove(event, d, `<p><span>${d.Name}</span></p><p>${sale_type} Sales: ${d[`${sale_type}_Sales`].toFixed(2)} million</p>`))
        .on("mouseleave", tooltip.mouseleave)
        
    circle
        .transition()
        .duration(variable.timer)

        .attr("r", d => sizeScale(d.Global_Sales)(d[`${sale_type}_Sales`]))
        .attr("fill", color)
        .attr("cy", d => { 

            let r = sizeScale(d.Global_Sales)(d[`${sale_type}_Sales`]);
            let past_circle_r = sizeScale(d.Global_Sales)(d[`${past_sale_type}_Sales`]);
            if(index === 0) {past_circle_y = r; return r}
            else {
                let value = past_circle_y + past_circle_r;

                let current_circle_y = past_circle_y + past_circle_r;
                past_circle_y = current_circle_y; 

                return value};
        })

        .attr("class", sale_type + "_sales")
        .attr("class", "sales")
}

export function update_sales_circles (filtered_data) {
    for (let i = 0; i < filtered_data.length; i++) { 
        let g_circle_group = d3.select(`.g_circle_group:nth-child(${i + 1})`).selectAll('rect').data([filtered_data[i]]).enter();
        init_circles(g_circle_group, true);
    }
}
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";
import { tooltip } from "./tooltip.js";

function create_xScale(dataset) {
    let xScale = d3.scaleBand()
            .domain(dataset.map(d => d.Name))
            .range([0, variable.wViz])
    return xScale;
}

function create_yScale (dataset) {
    let global_max = 0;
    dataset.forEach( d => { if (d.Global_Sales > global_max) global_max = d.Global_Sales });
    let yScale = d3.scaleLinear()
        .domain([0, global_max * 1.5])
        .range([20, 0]);  
    return yScale;
}

function testScale (Global_Sales) {
    let testScale = d3.scaleLinear()
        .domain([0, Global_Sales])
        .range([4, 28])
    return testScale;
}

function create_colorScale () {
    let sale_types = ["NA", "EU", "JP", "Other"];
    let colors = ["aqua", "yellowgreen", "hotpink", "lightgray"];

    let color_scale = d3.scaleOrdinal()
        .domain(sale_types)
        .range(colors)

    return color_scale;
}

export async function create_sales_circles (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);

    let xScale = create_xScale(dataset);
    let yScale = create_yScale(dataset);
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
        // .attr("transform", "translate(50, 50)")

    sharedG
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("g")
        .classed("test", true)
        .attr("transform", d => `translate(${xScale(d.Name) + (d3.select(".bar").attr("width") * 1.1) / 2},${-variable.hPad + variable.pad * 3})`); 

    for (let i = 0; i < dataset.length; i++) { 
        let test = d3.select(`.test:nth-child(${i + 1})`).selectAll('rect').data([dataset[i]]).enter();

        init_circles(test);

    }

}

let pastY = null;
function create_circle (parent, sale_type, color, index, past) {
    let pastPastY = null;

    let circle = parent
        .append("circle")
    
    circle
        .on("mouseover", tooltip.mouseover)
        .on("mousemove", (event, d) => tooltip.mousemove(event, d, `<p>Title: ${d.Name}<br>${sale_type} Sales: ${d[`${sale_type}_Sales`].toFixed(2)} million sales</p>`))
        .on("mouseleave", tooltip.mouseleave)

    
    
    circle
        .transition()
        .duration(variable.timer)
        .attr("r", d => testScale(d.Global_Sales)(d[`${sale_type}_Sales`]))

    circle
        .attr("fill", color)
        .attr("cy", d => { 
            let radie = testScale(d.Global_Sales)(d[`${sale_type}_Sales`]);
            let pastR = testScale(d.Global_Sales)(d[`${past}_Sales`]);
            if(index === 0) {pastY = radie; pastR = radie; return radie}
            else {
                pastPastY = pastY;
                pastY = pastPastY + pastR; 
                return pastPastY + pastR};
        })

        .attr("class", sale_type + "_sales")
        .attr("class", "sales")
        .attr("id", d => d.Name.replaceAll(" ", "").replaceAll("/", "").replaceAll(":", "") + "_" + sale_type)
}


function init_circles (parent) {
    let sale_types = ["NA", "EU", "JP", "Other"];
    let sale_types_obj = [];
    let color_scale = create_colorScale();

    parent.each(d => {
        sale_types.forEach(type => sale_types_obj.push([type, d[`${type}_Sales`]]));
    });

    sale_types_obj.sort((a, b) => b[1] - a[1]);

    sale_types_obj.forEach((type, i) => {
        let past = 0;
        if(i !== 0) past = sale_types_obj[i - 1][0];
        create_circle(parent, type[0], color_scale(type[0]), i, past);
    })
}

export function update_sales_circles (new_data) {
    d3.selectAll(".test").html("");
    for (let i = 0; i < new_data.length; i++) { 
        let test = d3.select(`.test:nth-child(${i + 1})`).selectAll('rect').data([new_data[i]]).enter();
        init_circles(test);
    }
}
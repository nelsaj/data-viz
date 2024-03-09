import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";

function create_xScale(dataset) {
    let xScale = d3.scaleBand()
            .domain(dataset.map(d => d.Name))
            .range([0, variable.wViz])
            .paddingInner(1)
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
        .range([3, 33])
    return testScale;
}

export async function create_sales_circles (dataset) {
    dataset = dataset.slice(0, variable.number_of_games);

    var root = d3.hierarchy(dataset);
    let pack = d3.pack()
        .size([250,250]);
    console.log(pack(root));

    let xScale = create_xScale(dataset);
    let yScale = create_yScale(dataset);

    let sharedG = d3.select(".wrapper").append("g");

    sharedG
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("g")
        .classed("test", true)
        .attr("transform", d => `translate(${xScale(d.Name)},${0})`); 

    for (let i = 0; i < dataset.length; i++) { 
        let test = d3.select(`.test:nth-child(${i + 1})`).selectAll('rect').data([dataset[i]]).enter();
        // create_circle(test, "Global", "pink", 0);
        create_circle(test, "NA", "blue", 0);
        create_circle(test, "EU", "green", 1);
        create_circle(test, "JP", "red", 2);
        create_circle(test, "Other", "brown", 3);

    }

}

function create_circle (parent, sale_type, color, index) {

    let circle = parent.append("circle");
    circle
        .attr("fill", color)
        .classed(sale_type + "_sales", true)
        .attr("cy", 7 * index)
        .attr("r", d => testScale(d.Global_Sales)(d[`${sale_type}_Sales`]))
        // .attr("r", d => d[`${sale_type}_Sales`]/d.Global_Sales * 100)
        .transition() ////// :/

        return circle;
}

export function update_sales_circles (new_data) {
    // d3.selectAll(".test").html("");
    for (let i = 0; i < new_data.length; i++) { 
        let test = d3.select(`.test:nth-child(${i + 1})`).selectAll('rect').data([new_data[i]]).enter();
        create_circle(test, "NA", "blue", 0);
        create_circle(test, "EU", "green", 1);
        create_circle(test, "JP", "red", 2);
        create_circle(test, "Other", "brown", 3);

    }
}
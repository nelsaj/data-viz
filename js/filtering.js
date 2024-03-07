"use strict";
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

create_svg();

async function structure_data (purpose, genre) {
    let dataset = await d3.csv( "./csv/vgsales.csv" )

    let unique_names = [];
    let updated_dataset = [];

    dataset.forEach( object => {
        if(!unique_names.includes(object.Name)) {
            unique_names.push(object.Name);
            updated_dataset.push({
                Name: object.Name,
                Year: parseInt(object.Year),
                Genre: object.Genre,
                Platforms: [object.Platform],
                NA_Sales: Number(object.NA_Sales),
                EU_Sales: Number(object.EU_Sales),
                JP_Sales: Number(object.JP_Sales),
                Other_Sales: Number(object.Other_Sales),
                Global_Sales: Number(object.Global_Sales)
            })
        }
        else {
            let game = updated_dataset.find( updated_object => updated_object.Name == object.Name);
            game.Platforms.push(object.Platform);
            game.Global_Sales += Number(object.Global_Sales);
            game.Other_Sales += Number(object.Other_Sales);
            game.JP_Sales += Number(object.JP_Sales);
            game.EU_Sales += Number(object.EU_Sales);
            game.NA_Sales += Number(object.NA_Sales);
        }
    })

    updated_dataset.sort( (a, b) => b.Global_Sales - a.Global_Sales);

    if(purpose == "start") {
        updated_dataset = updated_dataset.slice(0, 10);
        console.log(updated_dataset);
        return updated_dataset;
    }

    if(purpose == "filter") {
        
        console.log(updated_dataset);

        updated_dataset = updated_dataset.filter( object => {
            return object.Genre == genre;
        }) 

        updated_dataset = updated_dataset.slice(0, 10);

        console.log(updated_dataset);

        return updated_dataset;
    }

}

async function create_svg() {
    
    let dataset = await structure_data("start");

    create_genre_buttons(dataset)

    const hSvg = 600, wSvg = 600,
        wViz = .9 * wSvg,
        hViz = .3 * hSvg,
        wPad = (wSvg - wViz) / 2,
        hPad = (hSvg - hViz) / 2;

    let names = dataset.map(d => d.Name);
    let xScale = d3.scaleBand()
        .domain(names)
        .range([0, wViz])
        .paddingInner(.1)
        .paddingOuter(.1);
    let wBar = xScale.bandwidth;

    let global_max = dataset[0].Global_Sales;
    dataset.forEach( d => { if (d.Global_Sales > global_max) global_max = d.Global_Sales });
    let yScale = d3.scaleLinear()
        .domain([0, global_max * 1.2])
        .range([hViz, 0]);      

    let svg = d3.select("body").append("svg")
        .attr("width", wSvg).attr("height", hSvg)

    let gviz_bars = svg.append("g")
        .attr("transform", `translate(${wPad}, ${hPad})`);

    gviz_bars.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")   
        .attr("width", wBar)
        .attr("x", setX)
        .attr("y", setY)
        .attr("height", setH)
    
    let gviz_text = svg.append("g");
    
    gviz_text
        .attr("transform", `translate(${wPad}, ${hPad})`)
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("text")
        .text(set_text)
        .attr("x", setX)
        .attr("y", setY_text)


    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return hViz - yScale(d.Global_Sales); }

    function setY_text (d) {return yScale(d.Global_Sales + 50)}
    function set_text (d) {return d.Name}

    function create_genre_buttons (dataset) {
        let button_container = d3.select("body")
            .append("div")
    
        button_container.classed("button_container")
        let genres = [];
    
        dataset.forEach( object => {
            if(!genres.includes(object.Genre)) {
                genres.push(object.Genre);
            }
        })
    
        genres.forEach( genre => {
            button_container.append("button")   
                .text(genre)
                .on('click', async (event) => {
                    button_container.select("button.active").classed("active", false);
                    event.target.classList.add("active");
    
                    let new_data = await structure_data("filter", genre);
                    
                    update_svg(new_data);
                });
        })
    }

    function update_svg (new_data) {
        gviz_bars.selectAll("rect")
            .data(new_data)
            .transition()
            .attr("height", setH)
            .attr("y", setY);
    
        gviz_text
            .selectAll("text")
            .data(new_data)
            .transition()
            .text(set_text)
            .attr("y", setY_text)
        
    }
}

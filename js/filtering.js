"use strict";

structure_data();

async function structure_data () {
    let dataset = await d3.csv( "vgsales.csv" )
    let platforms = [];

    dataset.forEach(object => {
        if(!platforms.includes(object.Platform)) {
            platforms.push(object.Platform);
        }
    })

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
    updated_dataset = updated_dataset.slice(0, 25);
    console.log(updated_dataset);

    create_svg(updated_dataset);

}

function create_svg(dataset) {
    const hSvg = 600, wSvg = 1200,
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
                .domain([0, global_max * 1.2]) // nTop = 20% mer än nMax
                .range([hViz, 0]);        // inverterad range!

    let svg = d3.select("body").append("svg")
                .attr("width", wSvg).attr("height", hSvg)

    // Rita graf-areans bakgrund
    // (rita före grafen, annars hamnar bakgrunden ovanför grafen)
    svg.append("rect")
        .attr("width", wViz)
        .attr("height", hViz)
        .attr("x", wPad)
        .attr("y", hPad)
        .attr("fill", "white");

    // Skapa ett <g> för graf-arean (viz-area)
    let gviz = svg.append("g")
                .attr("transform", `translate(${wPad}, ${hPad})`);

    // Rita grafen i gviz
    gviz.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")     // rects appendas till gviz
        .attr("width", wBar)
        .attr("x", setX)
        .attr("y", setY)
        .attr("height", setH)
    
    svg.append("g")
        .attr("transform", `translate(${wPad}, ${hPad})`)
        .selectAll("rect")
        .data(dataset)
        .enter()
        .append("text")
        .text(set_text)
        .attr("x", setX_text)
        .attr("y", setY_text)


    function setX (d, i) { return xScale(d.Name); }
    function setY (d, i) { return yScale(d.Global_Sales); }
    function setH (d, i) { return hViz - yScale(d.Global_Sales); }

    function setX_text (d) {return xScale(d.Name)}
    function setY_text (d) {return yScale(d.Global_Sales + 50)}
    function set_text (d) {return d.Name}
}
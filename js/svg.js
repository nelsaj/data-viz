import * as variable from "./variables.js";

export function create_svg() {

    let svg = d3.select("#svgHolder").append("svg")
        .attr("width", variable.wSvg).attr("height", variable.hSvg);    
}



import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";



export async function create_svg() {

    let svg = d3.select("body").append("svg")
        .attr("width", variable.wSvg).attr("height", variable.hSvg);
    
}



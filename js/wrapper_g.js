import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";



export async function create_wrapper() {

    let g = d3.select("svg").append("g")
        .classed("wrapper", true)
        .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`);
    
}

import * as variable from "./variables.js";

export function create_wrapper() {

    d3.select("svg").append("g")
        .classed("wrapper", true)
        .attr("transform", `translate(${variable.wPad}, ${variable.hPad})`);
    
}

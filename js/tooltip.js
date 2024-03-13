export function create_tooltip () {
    let tooltip = d3.select("body").append("div")
        .style("opacity", 0)
        .classed("tooltip", true);
}

export const tooltip = {
    mouseover() {
        d3.select(".tooltip")
            .style("opacity", 1)
            .style("z-index", 2)
    },
    mousemove(event, d, textContent) {
        d3.select(".tooltip")
            .html(textContent)
            .style("left", (event.pageX + 20) + "px")
            .style("top", (event.pageY + "px"))
    },
    mouseleave() {
        d3.select(".tooltip")
            .style("opacity", 0)
            .style("z-index", -1)
    }
}

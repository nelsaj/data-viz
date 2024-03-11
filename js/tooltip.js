import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export const tooltip = {
    mouseover(event, d) {
        d3.select(".tooltip")
            .style("opacity", 1)
    },
    mousemove(event, d, textContent) {
        d3.select(".tooltip")
            .html(textContent)
            .style("left", (event.x + 20) + "px")
            .style("top", (event.y + "px"))
    },
    mouseleave(event, d) {
        d3.select(".tooltip")
            .style("opacity", 0)
    }
}
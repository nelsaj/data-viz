import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function get_color (genre) {
    let colors = ["#ff476d","#f57c9e","#fd7d3e","#ffc845","#ffe5a6","#b9ee5c","#53d940","#3cdbaf","#34c1ec","#348dec","#5e60db", "#9963bd"];
    // let colors = ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2", "purple"];
    let genres = ["Sports", "Action", "Platform", "Puzzle", "Racing", "Role-Playing", "Shooter", "Misc", "Simulation", "Fighting", "Adventure", "Strategy"];

    let color_scale = d3.scaleOrdinal(colors)
        .domain(genres);
    
    return color_scale(genre);
}

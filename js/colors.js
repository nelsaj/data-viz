import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function get_color (genre) {
    let colors = ["#9e0142","#d53e4f","#f46d43","#fdae61","#fee08b","#ffffbf","#e6f598","#abdda4","#66c2a5","#3288bd","#5e4fa2", "purple"];
    let genres = ["Sports", "Action", "Platform", "Puzzle", "Racing", "Role-Playing", "Shooter", "Misc", "Simulation", "Fighting", "Adventure", "Strategy"];

    let obj = {};
    for (let j = 0; j < genres.length; j++) {
        obj[genres[j]]= colors[j];
    }
    
    return obj[genre];
}

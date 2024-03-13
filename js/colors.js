import { genres } from "../index.js"

export function get_color (genre) {
    let colors = ["#ff476d","#f57c9e","#fd7d3e","#ffc845","#ffe5a6","#b9ee5c","#53d940","#3cdbaf","#34c1ec","#348dec","#5e60db", "#9963bd"];
    
    
    let color_scale = d3.scaleOrdinal(colors)
        .domain(genres);
    
    return color_scale(genre);
}

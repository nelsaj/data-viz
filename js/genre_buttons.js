import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { update_bar_chart } from "./bar_chart.js";
import { filter_by_genre } from "./filtering.js";
import { get_color } from "./colors.js";
import { update_line_chart } from "./linechart.js";

export function create_genre_buttons (dataset) {
    let button_container = d3.select("body")
        .append("div")

    button_container.classed("button_container")
    let genres = [];

    dataset.forEach( object => {
        if(!genres.includes(object.Genre)) {
            genres.push(object.Genre);
        }
    })

    genres.forEach( genre => {
        button_container.append("button")   
            .text(genre)
            .style("background-color", () => get_color(genre))
            .on('click', async (event) => {
                button_container.select("button.active").classed("active", false);
                event.target.classList.add("active");
        
                let filtered_data = filter_by_genre(dataset, genre);

                update_bar_chart(dataset, filtered_data);
                update_line_chart(dataset, filtered_data);
            });
    })
}
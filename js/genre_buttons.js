import { update_bar_chart } from "./bar_chart.js";
import { filter_by_genre } from "./filtering.js";
import { get_color } from "./colors.js";
import { update_line_chart } from "./linechart.js";
import { update_sales_circles } from "./sales_circles.js";
import { genres } from "../index.js";

export function create_genre_buttons (dataset) {
    let button_container = d3.select("#buttonHolder")
        .append("div")

    button_container.classed("button_container", true)

    genres.forEach( genre => {
        button_container.append("button")   
            .text(genre)
            .classed("filter_button", true)
            .style("border", `2px solid ${get_color(genre)}`)
            .style("color", get_color(genre))
            .on('click', (event) => {
    
                if(event.target.classList.contains("active")) {
                    let filtered_data = filter_by_genre(dataset);
                    event.target.classList.remove("active");

                    update_bar_chart(dataset, filtered_data);
                    update_sales_circles(filtered_data);
                    return;
                }

                button_container.select("button.active").classed("active", false);
                event.target.classList.add("active");
                let filtered_data = filter_by_genre(dataset, genre);

                document.body.style.setProperty('--genre_color', get_color(genre));

                update_bar_chart(dataset, filtered_data);
                update_sales_circles(filtered_data);
            });
    })
}
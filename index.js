import { create_svg } from "./js/svg.js";
import { create_tooltip } from "./js/tooltip.js";
import { structure_data } from "./js/filtering.js";
import { create_bar_chart } from "./js/bar_chart.js";
import { create_genre_buttons } from "./js/genre_buttons.js";
import { create_line_chart } from "./js/linechart.js";
import { create_wrapper } from "./js/wrapper_g.js";
import { create_sales_circles } from "./js/sales_circles.js";

( async function () {
    let dataset = await structure_data();

    create_svg();
    create_tooltip();
    create_wrapper();

    create_bar_chart(dataset);
    create_genre_buttons(dataset);
    create_line_chart(dataset);
    create_sales_circles(dataset);
}) ()

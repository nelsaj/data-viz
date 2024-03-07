import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { create_svg } from "./js/svg.js";
import { structure_data } from "./js/filtering.js";
import { create_bar_chart } from "./js/bar_chart.js";
import { create_genre_buttons } from "./js/genre_buttons.js";

( async function () {
    let dataset = await structure_data();

    await create_svg();
    await create_bar_chart(dataset);

    await create_genre_buttons(dataset);
}) ()
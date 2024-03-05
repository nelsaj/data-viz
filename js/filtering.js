"use strict";

(async function () {
    let dataset = await d3.csv( "vgsales.csv" )
    let platforms = [];

    dataset.forEach(e => {
        if(!platforms.includes(e.Platform)) {
            platforms.push(e.Platform);
        }
    })

}) ()

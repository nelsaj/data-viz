"use strict";

(async function () {
    let dataset = await d3.csv( "vgsales.csv" )
    let platforms = [];

    dataset.forEach(object => {
        if(!platforms.includes(object.Platform)) {
            platforms.push(object.Platform);
        }
    })

    let unique_names = [];
    let updated_dataset = [];

    dataset.forEach( object => {
        if(!unique_names.includes(object.Name)) {
            unique_names.push(object.Name);
            updated_dataset.push({
                Name: object.Name,
                Year: parseInt(object.Year),
                Genre: object.Genre,
                Platforms: [object.Platform],
                NA_Sales: Number(object.NA_Sales),
                EU_Sales: Number(object.EU_Sales),
                JP_Sales: Number(object.JP_Sales),
                Other_Sales: Number(object.Other_Sales),
                Global_Sales: Number(object.Global_Sales)
            })
        }
        else {
            let game = updated_dataset.find( updated_object => updated_object.Name == object.Name);
            game.Platforms.push(object.Platform);
            game.Global_Sales += Number(object.Global_Sales);
            game.Other_Sales += Number(object.Other_Sales);
            game.JP_Sales += Number(object.JP_Sales);
            game.EU_Sales += Number(object.EU_Sales);
            game.NA_Sales += Number(object.NA_Sales);
        }
    })

    updated_dataset.sort( (a, b) => b.Global_Sales - a.Global_Sales);

    console.log(updated_dataset)
    console.log(dataset);
}) ()

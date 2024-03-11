import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as variable from "./variables.js";

export async function structure_data () {
    let dataset = await d3.csv( "./csv/vgsales.csv" )

    let unique_names = [];
    let updated_dataset = [];

    dataset.forEach( object => {
        if(!unique_names.includes(object.Name)) {
            unique_names.push(object.Name);
            updated_dataset.push({
                Name: object.Name,
                Year: parseInt(object.Year),
                Genre: object.Genre,
                Publisher: object.Publisher,
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

    return updated_dataset;
}

export function filter_by_genre(dataset, genre) {
    dataset = dataset.filter( object => {
        return object.Genre == genre;
    }) 

    dataset = dataset.slice(0, variable.number_of_games);

    console.log(dataset);

    return dataset;
}
 
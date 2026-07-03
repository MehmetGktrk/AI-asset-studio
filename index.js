import { generateAsset } from './src/generator.js';


const assetConfig = {

    theme: "sim_companies",

    assets: [
        { category: "item", name: "bread", description: "a bread" },
        { category: "item", name: "milk", description: "a milk" },
        { category: "item", name: "lasagna", description: "a lasagna" },
        { category: "item", name: "truck", description: "a truck" },
        { category: "item", name: "bulldozer", description: "a bulldozer" },
        { category: "item", name: "economy car", description: "a economy car" },
        { category: "item", name: "luxury car", description: "a luxury car" },
        { category: "item", name: "combustion engine", description: "a combustion engine" },
        { category: "item", name: "lux jet", description: "a lux jet" },
        { category: "item", name: "plane", description: "a plane" },



    ],

    outputDir: "assets"
};


async function main(){
    await generateAsset(assetConfig);
};


main();
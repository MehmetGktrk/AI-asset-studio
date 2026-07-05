import { generateAsset } from './src/generator.js';


const assetConfig = {

    theme: "fantasy",

    assets: [
        { category: "item", name: "bread", description: "a bread" },
        { category: "item", name: "milk", description: "a milk" },
        { category: "item", name: "lasagna", description: "a lasagna" },
        { category: "item", name: "bulldozer", description: "a bulldozer" },
        { category: "item", name: "economy car", description: "a economy car" },
        { category: "item", name: "luxury car", description: "a luxury car" },
        { category: "item", name: "combustion engine", description: "a combustion engine" },
        { category: "item", name: "lux jet", description: "a lux jet" },
        { category: "item", name: "plane", description: "a plane" },
        { category: "item", name: "ship", description: "a ship" },
        { category: "item", name: "submarine", description: "a submarine" },
        { category: "item", name: "boat", description: "a boat" },



    ],

    outputDir: "assets"
};


async function main(){
    await generateAsset(assetConfig);
};


main();
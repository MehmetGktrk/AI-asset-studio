import { generateAsset } from './src/generator.js';


const assetConfig = {

    theme: "fantasy",

    assets: [
        { category: "item", name: "bread", description: "a bread" },
        { category: "item", name: "milk", description: "a milk" },
        { category: "item", name: "lasagna", description: "a lasagna" }



    ],

    outputDir: "assets"
};


async function main(){
    await generateAsset(assetConfig);
};


main();
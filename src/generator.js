import { buildPrompt } from './prompt.js';
import { generateImage } from './image.js';
import fs from 'fs-extra';
import path from 'path';


export async function generateAsset(assetConfig){

    for (const asset of assetConfig.assets){
        
        const prompt = buildPrompt(assetConfig.theme, asset);

        const image = await generateImage(prompt);

        const fileName = asset.name.toLowerCase().replace(/\s+/g, '_');

        const dir = path.join(
            assetConfig.outputDir,
            assetConfig.theme,
            asset.category
        );

        await fs.ensureDir(dir);

        await fs.writeFile(
            path.join(dir, fileName + '.png'),
            Buffer.from(image, 'base64'),
        );
        console.log(`Generated: ${asset.name}`);
    }
}
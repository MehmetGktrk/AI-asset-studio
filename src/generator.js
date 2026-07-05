import { buildPrompt } from './prompt.js';
import { generateImage } from './image.js';
import { config } from '../config.js';
import pLimit from 'p-limit';
import fs from 'fs-extra';
import path from 'path';



export async function generateAsset(assetConfig){

    const limit = pLimit(config.concurrency);

    const tasks = assetConfig.assets.map(asset =>
        limit(() => processAsset(assetConfig, asset))
    );

    const results = await Promise.allSettled(tasks);

    const failed = results.filter(result => result.status === 'rejected');

    if (failed.length > 0){
        console.warn(`Failed: ${failed.length} / ${results.length}`);
        failed.forEach(result => console.warn(result.reason?.message ?? result.reason));
    }

    console.log(`Done: ${results.length - failed.length} / ${results.length}`);
}




async function processAsset(assetConfig, asset){

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




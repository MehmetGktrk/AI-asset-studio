import { buildPrompt } from './prompt.js';
import { generateImage } from './image.js';
import { config } from '../config.js';
import pLimit from 'p-limit';
import fs from 'fs-extra';
import path from 'path';
import { getOutputPath } from '../utils/generator.utils.js';


export async function generateAsset(assetConfig){

    const skipExisting = config.skipExisting;
    const limit = pLimit(config.concurrency);

    const tasks = assetConfig.assets.map(asset =>
        limit(() => processAsset(assetConfig, asset, skipExisting))
    );

    const results = await Promise.allSettled(tasks);

    const skipped = results.filter(r => r.status === 'fulfilled' && r.value === 'skipped').length;
    const generated = results.filter(r => r.status === 'fulfilled' && r.value === 'generated').length;
    const failed = results.filter(result => result.status === 'rejected');

    if (failed.length > 0){
        console.warn(`Failed: ${failed.length} / ${results.length}`);
        failed.forEach(result => console.warn(result.reason?.message ?? result.reason));
    }

    if (skipExisting && skipped > 0){
        console.log(`Skipped: ${skipped}`);
    }

    console.log(`Generated: ${generated}`);
    console.log(`Done: ${generated + skipped} / ${results.length}`);
}




async function processAsset(assetConfig, asset, skipExisting){

    const outputPath = getOutputPath(assetConfig, asset);

    if (skipExisting && await fs.pathExists(outputPath)) {
        console.log(`Skipped: ${asset.name}`);
        return 'skipped';
    }

    const prompt = buildPrompt(assetConfig.theme, asset);

    const image = await generateImage(prompt);

    await fs.ensureDir(path.dirname(outputPath));

    await fs.writeFile(
        outputPath,
        Buffer.from(image, 'base64'),
    );

    console.log(`Generated: ${asset.name}`);
    return 'generated';
}




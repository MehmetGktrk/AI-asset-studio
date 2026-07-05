import { buildPrompt } from './prompt.js';
import { generateImage } from './image.js';
import { config } from '../config.js';
import pLimit from 'p-limit';
import fs from 'fs-extra';
import path from 'path';
import { getOutputPath } from '../utils/generator.utils.js';
import {
    getUnitPrice,
    logCostEstimate,
    logCostSummary,
} from '../utils/cost.utils.js';
import {
    logBatchFinish,
    logBatchStart,
    logProgress,
} from '../utils/progress.utils.js';


async function countAssets(assetConfig, skipExisting) {
    const total = assetConfig.assets.length;
    let toSkip = 0;

    if (skipExisting) {
        for (const asset of assetConfig.assets) {
            const outputPath = getOutputPath(assetConfig, asset);
            if (await fs.pathExists(outputPath)) {
                toSkip++;
            }
        }
    }

    return { total, toGenerate: total - toSkip, toSkip };
}


export async function generateAsset(assetConfig){

    const skipExisting = config.skipExisting;
    const { total, toGenerate, toSkip } = await countAssets(assetConfig, skipExisting);
    const unitPrice = getUnitPrice(config.openaiModel, config.imageSize, config.imageQuality);

    if (config.showCostEstimate) {
        logCostEstimate({
            model: config.openaiModel,
            size: config.imageSize,
            quality: config.imageQuality,
            total,
            toGenerate,
            toSkip,
            skipExisting,
        });
    }

    const progress = { completed: 0, total };
    const batchStart = Date.now();

    if (config.showProgress) {
        logBatchStart({
            total,
            toGenerate,
            toSkip,
            concurrency: config.concurrency,
            skipExisting,
        });
    }

    const limit = pLimit(config.concurrency);

    const tasks = assetConfig.assets.map(asset =>
        limit(() => processAsset(assetConfig, asset, skipExisting, progress))
    );

    const results = await Promise.allSettled(tasks);

    const skipped = results.filter(r => r.status === 'fulfilled' && r.value === 'skipped').length;
    const generated = results.filter(r => r.status === 'fulfilled' && r.value === 'generated').length;
    const failed = results.filter(result => result.status === 'rejected');
    const totalSeconds = (Date.now() - batchStart) / 1000;

    if (config.showProgress) {
        logBatchFinish({
            generated,
            skipped,
            failed: failed.length,
            total: results.length,
            totalSeconds,
        });
    } else {
        if (failed.length > 0) {
            console.warn(`Failed: ${failed.length} / ${results.length}`);
            failed.forEach(result => console.warn(result.reason?.message ?? result.reason));
        }

        if (skipExisting && skipped > 0) {
            console.log(`Skipped: ${skipped}`);
        }

        console.log(`Generated: ${generated}`);
        console.log(`Done: ${generated + skipped} / ${results.length}`);
    }

    if (config.showCostEstimate) {
        logCostSummary({
            unitPrice,
            estimatedCount: toGenerate,
            generatedCount: generated,
            continueSection: config.showProgress,
        });
    }
}




async function processAsset(assetConfig, asset, skipExisting, progress){

    const assetStart = Date.now();

    try {
        const outputPath = getOutputPath(assetConfig, asset);

        if (skipExisting && await fs.pathExists(outputPath)) {
            if (config.showProgress) {
                progress.completed++;
                logProgress(progress.completed, progress.total, asset.name, 'skip');
            } else {
                console.log(`Skipped: ${asset.name}`);
            }
            return 'skipped';
        }

        const prompt = buildPrompt(assetConfig.theme, asset);

        const image = await generateImage(prompt);

        await fs.ensureDir(path.dirname(outputPath));

        await fs.writeFile(
            outputPath,
            Buffer.from(image, 'base64'),
        );

        if (config.showProgress) {
            progress.completed++;
            const elapsed = (Date.now() - assetStart) / 1000;
            logProgress(progress.completed, progress.total, asset.name, 'ok', elapsed);
        } else {
            console.log(`Generated: ${asset.name}`);
        }
        return 'generated';
    } catch (err) {
        if (config.showProgress) {
            progress.completed++;
            logProgress(progress.completed, progress.total, asset.name, 'fail', 0, err.message);
        }
        throw err;
    }
}



import path from 'path';

export function getOutputPath(assetConfig, asset) {

    const fileName = asset.name.toLowerCase().replace(/\s+/g, '_');
    const dir = path.join(
        assetConfig.outputDir,
        assetConfig.theme,
        asset.category
    );

    return path.join(dir, fileName + '.png');
}
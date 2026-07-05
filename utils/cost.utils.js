import { resolveUnitPrice } from '../pricing/index.js';

export function getUnitPrice(model, size, quality) {
    return resolveUnitPrice(model, size, quality);
}

export function estimateCost(unitPrice, count) {
    if (unitPrice == null || count <= 0) return 0;
    return unitPrice * count;
}

export function formatUsd(amount) {
    return `$${amount.toFixed(2)}`;
}

export function logCostEstimate({ model, size, quality, total, toGenerate, toSkip, skipExisting }) {
    const unitPrice = getUnitPrice(model, size, quality);
    const estimated = estimateCost(unitPrice, toGenerate);

    console.log('Cost estimate');
    console.log('-------------');
    console.log(`Model:       ${model}`);
    console.log(`Size:        ${size}`);
    console.log(`Quality:     ${quality}`);

    if (unitPrice == null) {
        console.log('Unit price:  unknown (pricing not configured for this model/size/quality)');
    } else {
        console.log(`Unit price:  ${formatUsd(unitPrice)} / image`);
    }

    console.log(`Assets:      ${total} total`);
    console.log(`  To generate: ${toGenerate}`);
    console.log(`  To skip:     ${toSkip}${skipExisting ? '' : ' (skipExisting: false)'}`);

    if (unitPrice == null) {
        console.log('Estimated:   unavailable');
    } else if (toGenerate === 0) {
        console.log('Estimated:   $0.00 (nothing to generate)');
    } else {
        console.log(`Estimated:   ${formatUsd(estimated)} USD`);
    }

    console.log('');
}

export function logCostSummary({ unitPrice, estimatedCount, generatedCount }) {
    if (unitPrice == null) return;

    const estimated = estimateCost(unitPrice, estimatedCount);
    const actual = estimateCost(unitPrice, generatedCount);

    console.log(`Cost (est.): ${formatUsd(estimated)} USD`);
    console.log(`Cost (gen.): ${formatUsd(actual)} USD`);
}

import { resolveUnitPrice } from '../pricing/index.js';
import { color } from './color.utils.js';
import { logBlank, logPair, logSection } from './console.utils.js';

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

    logSection('Cost estimate');
    logPair('Model', model, { tint: color.cyan });
    logPair('Size', size);
    logPair('Quality', quality);

    if (unitPrice == null) {
        logPair('Unit price', 'unknown (pricing not configured)', { tint: color.yellow });
    } else {
        logPair('Unit price', `${formatUsd(unitPrice)} / image`, { tint: color.green });
    }

    logPair('Assets', `${total} total`);
    logPair('To generate', String(toGenerate), { tint: color.green });
    logPair('To skip', `${toSkip}${skipExisting ? '' : ' (skipExisting: false)'}`, {
        tint: color.yellow,
    });

    if (unitPrice == null) {
        logPair('Estimated', 'unavailable', { tint: color.yellow });
    } else if (toGenerate === 0) {
        logPair('Estimated', '$0.00 (nothing to generate)', { tint: color.dim });
    } else {
        logPair('Estimated', `${formatUsd(estimated)} USD`, {
            tint: (text) => color.bold(color.green(text)),
        });
    }

    logBlank();
}

export function logCostSummary({ unitPrice, estimatedCount, generatedCount, continueSection = false }) {
    if (unitPrice == null) return;

    const estimated = estimateCost(unitPrice, estimatedCount);
    const actual = estimateCost(unitPrice, generatedCount);

    if (!continueSection) {
        logSection('Summary');
    }

    logPair('Cost (est.)', `${formatUsd(estimated)} USD`, { tint: color.green });
    logPair('Cost (actual)', `${formatUsd(actual)} USD`, {
        tint: actual > 0
            ? (text) => color.bold(color.green(text))
            : color.dim,
    });
}

import { color } from './color.utils.js';
import { formatAssetName, logBlank, logPair, logSection } from './console.utils.js';

const ICONS = { ok: '✓', fail: '✗', skip: '⊘' };

const ICON_COLORS = {
    ok: color.green,
    fail: color.red,
    skip: color.yellow,
};

const DETAIL_COLORS = {
    ok: color.cyan,
    fail: color.red,
    skip: color.dim,
};

export function formatDuration(seconds) {
    if (seconds < 60) {
        return `${seconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs.toFixed(0)}s`;
}

export function logProgress(index, total, name, status, assetSeconds = 0, errorMessage) {
    const digits = String(total).length;
    const indexStr = `${String(index).padStart(digits)}/${total}`;
    const icon = ICON_COLORS[status](ICONS[status]);

    let detail;
    if (status === 'fail') {
        detail = errorMessage ?? 'failed';
    } else if (status === 'skip') {
        detail = 'skip';
    } else {
        detail = formatDuration(assetSeconds);
    }

    console.log(
        `  ${color.dim(`[${indexStr}]`)}  ${color.bold(formatAssetName(name))}  ${icon}  ${DETAIL_COLORS[status](detail)}`,
    );
}

export function logBatchStart({ total, toGenerate, toSkip, concurrency, skipExisting }) {
    logSection('Generation');
    logPair('Total', `${total} assets`, { tint: color.cyan });

    if (skipExisting && toSkip > 0) {
        logPair('To generate', String(toGenerate), { tint: color.green });
        logPair('To skip', String(toSkip), { tint: color.yellow });
    }

    logPair('Concurrency', String(concurrency), { tint: color.magenta });
    logBlank();
}

function tintCount(value, highlightTint) {
    const count = Number(value);
    if (count > 0) return highlightTint(String(value));
    return color.dim(String(value));
}

export function logBatchFinish({ generated, skipped, failed, total, totalSeconds }) {
    logSection('Summary');
    logPair('Generated', String(generated), { tint: (v) => tintCount(v, color.green) });
    logPair('Skipped', String(skipped), { tint: (v) => tintCount(v, color.yellow) });
    logPair('Failed', String(failed), { tint: (v) => tintCount(v, color.red) });
    logPair('Duration', `${formatDuration(totalSeconds)} (${total}/${total} assets)`, {
        tint: color.cyan,
    });

    if (generated > 0) {
        const avg = totalSeconds / generated;
        logPair('Avg / asset', formatDuration(avg), { tint: color.dim });
    }
}

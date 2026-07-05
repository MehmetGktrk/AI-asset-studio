import { color } from './color.utils.js';

const LABEL_WIDTH = 14;
const NAME_WIDTH = 22;

export function logSection(title) {
    const dashCount = Math.max(8, 40 - title.length);
    console.log('');
    console.log(
        `${color.dim('──')} ${color.bold(color.cyan(title))} ${color.dim('─'.repeat(dashCount))}`,
    );
}

export function logPair(label, value, options = {}) {
    const { indent = 2, tint = null } = options;
    const pad = ' '.repeat(indent);
    const text = String(value);
    const tinted = tint ? tint(text) : text;
    console.log(`${pad}${color.dim(label.padEnd(LABEL_WIDTH))} ${tinted}`);
}

export function logBlank() {
    console.log('');
}

export function formatAssetName(name) {
    if (name.length > NAME_WIDTH) {
        return `${name.slice(0, NAME_WIDTH - 1)}…`;
    }
    return name.padEnd(NAME_WIDTH);
}

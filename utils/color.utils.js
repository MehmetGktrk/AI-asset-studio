const enabled = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR;

function wrap(code, text) {
    const value = String(text);
    if (!enabled) return value;
    return `\x1b[${code}m${value}\x1b[0m`;
}

export const color = {
    bold: (text) => wrap('1', text),
    dim: (text) => wrap('2', text),
    cyan: (text) => wrap('36', text),
    green: (text) => wrap('32', text),
    yellow: (text) => wrap('33', text),
    red: (text) => wrap('31', text),
    magenta: (text) => wrap('35', text),
    gray: (text) => wrap('90', text),
};

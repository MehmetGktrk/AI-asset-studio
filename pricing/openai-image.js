export const PRICING_META = {
    provider: 'OpenAI',
    currency: 'USD',
    unit: 'per image',
    source: 'https://openai.com/api/pricing/',
    lastVerified: '2026-07',
};

export const OPENAI_IMAGE_PRICING = {
    'gpt-image-1-mini': {
        '1024x1024': { low: 0.005, medium: 0.011, high: 0.036 },
        '1024x1536': { low: 0.006, medium: 0.015, high: 0.052 },
        '1536x1024': { low: 0.006, medium: 0.015, high: 0.052 },
    },
    'gpt-image-1': {
        '1024x1024': { low: 0.011, medium: 0.042, high: 0.167 },
        '1024x1536': { low: 0.016, medium: 0.063, high: 0.250 },
        '1536x1024': { low: 0.016, medium: 0.063, high: 0.250 },
    },
    'gpt-image-1.5': {
        '1024x1024': { low: 0.009, medium: 0.034, high: 0.133 },
        '1024x1536': { low: 0.013, medium: 0.050, high: 0.200 },
        '1536x1024': { low: 0.013, medium: 0.050, high: 0.200 },
    },
};

export function resolveUnitPrice(model, size, quality) {
    const modelPricing = OPENAI_IMAGE_PRICING[model];
    if (!modelPricing) return null;

    const sizePricing = modelPricing[size];
    if (!sizePricing) return null;

    return sizePricing[quality] ?? null;
}

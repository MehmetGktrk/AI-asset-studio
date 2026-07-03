import OpenAI from 'openai';
import { config } from '../config.js';

const openaiClient = new OpenAI({
    apiKey: config.openaiApiKey,
});


export async function generateImage(prompt){


    const res = await openaiClient.images.generate({
        model: config.openaiModel,
        prompt: prompt,
        n: 1,
        size: config.imageSize,
        quality: config.imageQuality,
        background: config.imageBackground,
    });

    return res.data[0].b64_json;
}
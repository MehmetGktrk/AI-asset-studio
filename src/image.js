import OpenAI from 'openai';
import { config } from '../config.js';

const openaiClient = new OpenAI({
    apiKey: config.openaiApiKey,
});


export async function generateImage(prompt){


    const res = await openaiClient.images.generate({
        model: "gpt-image-1-mini",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    })


    return res.data[0].b64_json;
}
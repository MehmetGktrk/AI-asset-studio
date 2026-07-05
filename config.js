import dotenv from 'dotenv';
dotenv.config({ quiet: true });



export const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,

    openaiModel: "gpt-image-1-mini",
    imageSize: "1024x1024",
    imageQuality: "high",
    imageBackground: "transparent",

    concurrency: 4,

    skipExisting: true,

    showCostEstimate: true,

    showProgress: true,
}
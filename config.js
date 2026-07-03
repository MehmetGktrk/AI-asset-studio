import dotenv from 'dotenv';
dotenv.config();



export const config = {
    openaiApiKey: process.env.OPENAI_API_KEY,

    openaiModel: "gpt-image-1-mini",
    imageSize: "1024x1024",
    imageQuality: "high",
    imageBackground: "transparent",
}
import { themes } from '../themes/themes.js';

export function buildPrompt(theme, asset){

    const themeData = themes[theme];

    if(!themeData){
        throw new Error(`Theme ${theme} not found`);
    }

    const prompt = `
    GAME ASSET

    STYLE:
    - ${themeData.style}
    - ${themeData.lighting}
    - ${themeData.camera}
    - ${themeData.palette}
    - no text, no watermark
    - consistent game art style


    OBJECT:
    ${asset.category.toUpperCase()}
    ${asset.name}


    REQUIREMENTS:
    - centered object
    - isolated
    - transparent background
    - game ready asset

    `;

    return prompt;

}
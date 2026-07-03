# AI Asset Studio

Generate consistent, game-ready image assets in bulk using the OpenAI image API. Define your assets and a visual theme once, then produce a full set of stylized sprites saved into an organized folder structure.

## Features

- **Theme-based styling** – Centralized art direction (style, lighting, camera, palette) per theme.
- **Batch generation** – Produce an entire asset list in a single run.
- **Structured output** – Files saved as `assets/<theme>/<category>/<name>.png`.
- **Configurable prompts** – A prompt builder that enforces a consistent, game-ready art style.

## Requirements

- Node.js 18+ (ES Modules enabled)
- An OpenAI API key with access to the image models

## Installation

```bash
git clone <your-repo-url>
cd AI-asset-studio
npm install
```

## Configuration

Create a `.env` file in the project root (see `.env.example`):

```bash
OPENAI_API_KEY=your_api_key_here
```

## Usage

Edit `index.js` to define your theme and the assets you want to generate:

```javascript
const assetConfig = {
  theme: "fantasy",
  assets: [
    { category: "item", name: "bread", description: "a bread" },
    { category: "item", name: "milk", description: "a milk" },
    { category: "item", name: "lasagna", description: "a lasagna" },
  ],
  outputDir: "assets",
};
```

Run the generator:

```bash
node index.js
```

Generated images are written to:

```
assets/<theme>/<category>/<name>.png
```

## Project Structure

```
AI-asset-studio/
├── index.js            # Entry point and asset configuration
├── config.js           # Loads environment variables
├── src/
│   ├── generator.js    # Iterates assets and writes files
│   ├── prompt.js       # Builds the image prompt from theme + asset
│   └── image.js        # Calls the OpenAI image API
└── themes/
    └── themes.js       # Theme definitions (style, lighting, palette, ...)
```

## Themes

Themes are defined in `themes/themes.js`. Each theme controls the visual direction of every asset generated under it:

| Field        | Description                            |
| ------------ | -------------------------------------- |
| `style`      | Overall art style and aesthetic        |
| `lighting`   | Lighting setup                         |
| `camera`     | Camera angle / perspective             |
| `palette`    | Color palette                          |
| `background` | Background handling (e.g. transparent) |

Add a new theme by adding a key to the exported `themes` object.

Available themes: `fantasy`, `medieval`, `cyberpunk`.

## Environment Variables

| Variable         | Required | Description         |
| ---------------- | -------- | ------------------- |
| `OPENAI_API_KEY` | Yes      | Your OpenAI API key |

## License

ISC

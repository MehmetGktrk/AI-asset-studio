# AI Asset Studio

Generate consistent, game-ready image assets in bulk using the OpenAI image API. Define your assets and a visual theme once, then produce a full set of stylized sprites saved into an organized folder structure.

## Features

- **Theme-based styling** – Centralized art direction (style, lighting, camera, palette) per theme.
- **Batch generation** – Produce an entire asset list in a single run.
- **Concurrent generation** – Assets are generated in parallel with a configurable concurrency limit, so large lists finish much faster.
- **Fault tolerant** – A single failed asset no longer aborts the run; failures are reported at the end.
- **Skip existing files** – Optionally skip assets that already exist on disk to save API cost and time when resuming or adding new items.
- **Structured output** – Files saved as `assets/<theme>/<category>/<name>.png`.
- **Configurable prompts** – A prompt builder that enforces a consistent, game-ready art style.

## Requirements

- Node.js 20+ (ES Modules enabled)
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

Generation settings live in `config.js`, including the model, image size/quality, concurrency, and whether to skip files that already exist:

```javascript
export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiModel: "gpt-image-1-mini",
  imageSize: "1024x1024",
  imageQuality: "high",
  imageBackground: "transparent",
  concurrency: 4,
  skipExisting: false,
};
```

| Setting         | Default | Description |
| --------------- | ------- | ----------- |
| `concurrency`   | `4`     | Max parallel image requests |
| `skipExisting`  | `false` | When `true`, assets whose output file already exists are not regenerated |

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

## Skip existing files

Set `skipExisting: true` in `config.js` to avoid regenerating assets whose output file is already on disk. The generator checks the target path before calling the OpenAI API:

```
assets/<theme>/<category>/<name>.png
```

This is useful when:

- Resuming after a partial failure (only missing assets are generated).
- Adding new entries to the asset list without redoing the whole batch.
- Iterating on a few assets while keeping the rest unchanged.

When enabled, the run summary includes how many assets were skipped, generated, and failed:

```
Skipped: 7
Generated: 2
Done: 9 / 9
```

To force a full regeneration, set `skipExisting: false` or delete the output files you want to replace.

## Concurrency

Assets are generated in parallel using [`p-limit`](https://www.npmjs.com/package/p-limit). Instead of processing the asset list one item at a time, the generator starts multiple image requests at once, capped by the `concurrency` value in `config.js`.

- `concurrency: 4` means at most 4 images are generated at the same time; the rest wait in a queue and start as soon as a slot frees up.
- Roughly, total time ≈ `ceil(assetCount / concurrency) × time-per-image`. For example, 9 assets with `concurrency: 4` finish in about 3 waves instead of 9 sequential requests.
- Raising `concurrency` speeds things up but may hit the OpenAI rate limit (HTTP 429). If you see rate-limit errors, lower the value.
- The run uses `Promise.allSettled`, so a single failed asset does not cancel the others. A summary of successes and failures is printed at the end.

## Project Structure

```
AI-asset-studio/
├── index.js            # Entry point and asset configuration
├── config.js           # Environment variables and generation settings
├── utils/
│   └── generator.utils.js  # Output path helpers
├── src/
│   ├── generator.js    # Generates assets in parallel and writes files
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

# Component Kit

Modular UI kit for map/editor panels (Place Card, Map Layers, Color Library, Color Scale, inputs, and more). Shared design tokens and atoms live in `src/global.css`.

## Live site

GitHub Pages publishes the **repository root** of `main`:

https://krlmnz.github.io/component-kit/

That URL loads the reference UI (`index.html`, with the side nav, Color Scale, Place Card, and the other components). Links between pages are relative (`color-scale.html`, `place-card.html`, `global.css`, `component-embed.js`), so they resolve under the `/component-kit/` project path.

## Local preview

Open `index.html` at the repository root. That is the same tree Pages serves. While editing, open `src/index.html` to preview the source tree.

## Editing

`src/` is the source tree, including the CodePen project config at `src/.codepen/`. The repository root is the published copy of the kit files (HTML, CSS, and JS) and does not include `.codepen/`.

After changing a file under `src/`, copy that file to the repository root so the live site stays in sync. Leave `src/.codepen/` only under `src/`.

## Design system atoms

- **`.combo`** — shared strip for color/stroke: optional `.swatch` + `.combo__hex` + `.combo__opacity` + `.combo__width` (all `--control-height-sm`)
- **`.tile` / `.tile-grid`** — selectable icon and pattern tiles
- **`.panel`** — kit chrome for editor panels

## Recent fixes

- Place Card: choosing an icon applies it to the trigger
- Compact utility inputs: hex / opacity / weight use one `.combo` (same height) across Inputs, Map Layers, and Color Library

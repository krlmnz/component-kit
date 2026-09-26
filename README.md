# Component Kit

Modular UI kit for map/editor panels (Place Card, Map Layers, Color Library, Color Scale, inputs, and more). Shared design tokens and atoms live in `src/global.css`.

## Design system atoms

- **`.combo`** — shared strip for color/stroke: optional `.swatch` + `.combo__hex` + `.combo__opacity` + `.combo__width` (all `--control-height-sm`)
- **`.tile` / `.tile-grid`** — selectable icon and pattern tiles
- **`.panel`** — kit chrome for editor panels

Open `dist/index.html` for the reference docs, or any standalone `dist/*.html` file.

## Recent fixes

- Place Card: choosing an icon applies it to the trigger
- Compact utility inputs: hex / opacity / weight use one `.combo` (same height) across Inputs, Map Layers, and Color Library

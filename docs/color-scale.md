# Color Scale

`color-scale.html` is the specimen for map and chart ramps. It interpolates in OKLab and is safe to treat as a choropleth only when the card does not mark the ramp unsafe.

## Seed

The page does not shuffle on load. The palette order and the first three scales are fixed:

1. Cream `#FCF9E8` → `--accent` (sequential, 7 steps)
2. Cornsilk `#FFF8DC` → `--error` (sequential, 7 steps)
3. Pale yellow `#FCFBA0` → ink `#434340` (sequential, 7 steps)

**Randomize** in the panel header assigns new sequential pairs and does not run on first paint. **Add scale** walks the same preset list before it falls back to the first lightness-safe pair in the palette.

## Tokens and the one error red

Status anchors are read from `global.css` at render time: `--accent`, `--success`, `--warn`, and `--error`. There is no second error red. Categorical brand paints (cream, mist, ink, and the rest of the old brand list except the removed red) stay hex, because they are palette colors rather than semantic tokens.

`--text` and `--surface` are not scale anchors. Both flip in the dark theme, which would move a “stable” ramp. The black and white choices in the color popover are the literals `#111416` and `#FFFFFF` for the same reason.

## Interpolation

Stops are mixed in OKLab (L, a, b), then chroma is scaled down until the color fits in sRGB. Lightness and hue stay put. Clamping the RGB channels instead can flatten lightness on saturated pairs. The ramp is built at 11 stops and then sampled to 5, 7, 9, or 11, so fewer steps stay on the same stops.

## Sequential and diverging

**Sequential** (default) is the choropleth. Lightness must move in one direction. If the ends differ by less than OKLab ΔL **0.08**, the card warns and the map preview is labeled unsafe. That threshold sits above the accent / success / error cluster (those three are within about ΔL 0.01 of each other) and below the next real step in this palette.

**Diverging** goes from the start color through white `#FFFFFF` to the end color. White is not `--surface`, so the middle stays light when the theme is dark. Use it for data with a meaningful center. It is unsafe when either end is not at least ΔL 0.08 darker than that white middle.

Adding a color, extracting from an image, and copying a step onto the palette are unchanged in spirit: a step copies its hex and adds it to Your colors.

## Residuals

- Layout classes for this panel (`.cs-*`) stay in the page stylesheet. Moving them into `global.css` is a separate consolidation.
- The shared `.swatch` draws each chip, endpoint, ramp step, and popover cell. The hex field uses `.combo` / `.combo__hex`. Endpoint hex is a label beside the swatch, not a fake text input.
- Step hex is the swatch name and tooltip, not an 8px caption under every cell.

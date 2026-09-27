# Writer themes

The kit uses the same theme ids as Andean Road Studio (Customize view). Put `data-theme` on the document element. Light / Minimal is `:root` only. There is no `[data-theme="light"]` block. Setting `data-theme="light"` still resolves to `:root`, because nothing overrides it. The kit omits the attribute for light.

| Id | Studio name | Attribute |
| --- | --- | --- |
| `light` | Light / Minimal | none (`:root`) |
| `night` | Night Sky | `data-theme="night"` |
| `note` | Warm Note | `data-theme="note"` |
| `signal` | Signal Hacker | `data-theme="signal"` |
| `news` | Grey Newspaper | `data-theme="news"` |
| `draft` | Drafting Grid | `data-theme="draft"` |

Studio has no `dark` id. The dark atmospheres are Night Sky and Signal Hacker (`color-scheme: dark`). The kit does not ship a `[data-theme="dark"]` alias. Specimens that used to toggle `dark` now use `night`.

Migration: a saved `component-kit-theme` value of `dark`, or a parent message `{ type: 'component-kit:theme', theme: 'dark' }`, is rewritten to `night` and stored as `night`. After that read, the old value is gone. Do not add `dark` back.

```html
<html lang="en" data-theme="note">
```

```js
document.documentElement.dataset.theme = 'signal';
// Light / Minimal. Either line is light; there is no light override block.
document.documentElement.removeAttribute('data-theme');
document.documentElement.dataset.theme = 'light';
```

Specimen pages and the reference index share `theme.js`. Each page has a `<select data-theme-select>` that lists the six Studio names. The choice is saved as `component-kit-theme`. Embedded previews take the theme from the parent message `{ type: 'component-kit:theme', theme }` instead of that saved value. `?theme=night` sets it for a standalone page.

Night Sky and Signal Hacker use `color-scheme: dark`. The other four themes use `color-scheme: light`.

## What matches Studio

`--bg`, `--surface`, `--surface-2`, `--text`, `--text-2`, `--accent`, `--accent-hover`, `--accent-text`, `--accent-soft`, and the theme shadows match the Studio semantic hexes. `--border-strong` is the Studio strong rule.

## Intentional deltas

These keep WCAG AA on controls. Ratios are in [`CONTRAST.md`](CONTRAST.md).

- **`--border`.** Studio’s border hexes are about 1.4:1 to 2.5:1 on the theme surfaces. The kit moves each one along the line from that hex toward `--border-strong` until the boundary clears 3:1 on `--bg`, `--surface`, and `--surface-2`.
- **`--on-accent` on night and signal.** Studio keeps white, which is about 1.5:1 and 1.9:1 on `#67D6FF` and `#35C9FF`. Those themes use the page background (`#071018`, `#030608`) as the primary label. White still passes on light, note, news, and draft.
- **`--on-error`.** Danger labels stay `#FFFFFF`. The night/signal ink misses 4.5:1 on `#DA3540` (4.16:1 and 4.42:1). White on that fill is 4.60:1.
- **`--accent-wash`.** Studio mixes 7% accent into transparent. The kit mixes 7% accent into `--surface`, so badge and alert fills stay opaque.
- **`--accent-text` against `--text`.** The Studio hexes are the link color. They clear 4.5:1 on surfaces and do not clear 3:1 against body text (1.10:1 on news to 2.43:1 on light). Links and `.btn--link` stay underlined, so color is not the only cue.
- **Status text on Grey Newspaper.** Fills stay `#00A470`, `#F89B17`, and `#DA3540`. `--bg` `#D9D9D4` is darker than white, so `--success-text`, `--warn-text`, and `--error-text` are darker than the light set. Night and signal reuse the dark-theme status retune already on main (`#14AA75`, `#F89B17`, `#FF8B91`, `--error-soft` `#3A1E20`).
- **Info.** `--info`, `--info-text`, `--info-soft`, and `--info-wash` alias the accent pair. There is no second blue.

## Shared map contract

Studio gets this quiet embed. Map Editor keeps customization and reuses the same atoms. Do not fork a second control skin, and do not add a map-chrome color API.

`data-theme` selects the `--map-*` paint. Light / Minimal is `:root` with the attribute omitted. The block is `.map-viewport` (the canvas is `.map-viewport__canvas`). Quiet controls are `.icon-btn.icon-btn--touch` inside `.map-controls` and `.map-toolbar`. They use page `--surface`, `--text-2`, and `--border`, with no shadow. Glyphs are Phosphor paths in `currentColor`. Pressed state uses `--accent-soft` and `--accent-text`. The place callout is `.map-popup` (this is the prose that should read first). The swatch row is `.map-legend`, hidden until asked for.

These classes live in `global.css`. They paint with no MapLibre script on the page. The reference index embeds `map.html?embed=1&chrome=1`, which is that chrome only. `map.html` without `chrome=1` injects MapLibre GL JS after first paint. Other kit pages do not load it.

### Quiet ground

The default basemap is a field, not a figure. Landcover colors sit close to `--map-land`, roads are thin, hillshade opacity stays low, and place labels use a softer ink than page `--text`. A place note on `.map-popup` should win. Brand and viz hues stay off the ground (`--viz-1` … `--viz-8`, `--route-line`, `--route-ink`, `--route-casing`).

`map-style.js` builds one style from one [OpenFreeMap](https://openfreemap.org/) vector source (OpenMapTiles schema, the same layers Liberty uses, no API key). Source id is `openfreemap`. Relief is a second source, id `hillshade` (Esri World Hillshade, grayscale). OpenFreeMap has no DEM, and the public terrarium bucket does not send `Access-Control-Allow-Origin`. Changing `data-theme` calls `KitMapStyle.paint(map)`, which is `setPaintProperty` on the rows below. It does not reload tiles or swap a style JSON. Fill opacities, line widths, and label size are fixed in `build()` and are not part of the theme paint.

The live page sets `cooperativeGestures` so a long page can still scroll, and `attributionControl` with `compact: false`. OpenStreetMap, OpenFreeMap, OpenMapTiles, and Esri attribution stays visible. MapLibre’s default navigation group and logo stay hidden.

### Layer ids and paint roles

`KitMapStyle.layers` is the same list. Draw order is top to bottom of the table (first row is underneath). Skip a row when `map.getLayer(id)` is missing. `--map-hillshade` is legend ink only. The hillshade layer is a grayscale raster, so its theme paint is `raster-opacity`, not a color.

| Layer id | Paint property | Token | Role |
| --- | --- | --- | --- |
| `background` | `background-color` | `--map-land` | Ground |
| `landcover-wood` | `fill-color` | `--map-wood` | Forest landcover |
| `landuse-wood` | `fill-color` | `--map-wood` | Forest landuse |
| `landcover-grass` | `fill-color` | `--map-park` | Grass and wetland |
| `landcover-scrub` | `fill-color` | `--map-scrub` | Scrub and farmland |
| `landcover-sand` | `fill-color` | `--map-beach` | Sand |
| `landcover-glacier` | `fill-color` | `--map-glacier` | Glacier, ice shelf, ice |
| `park` | `fill-color` | `--map-park` | Park polygons |
| `landuse-park` | `fill-color` | `--map-park` | Park, grass, and garden landuse |
| `hillshade` | `raster-opacity` | `--map-hillshade-opacity` | Relief strength |
| `water` | `fill-color` | `--map-water` | Water bodies |
| `waterway` | `line-color` | `--map-water` | Rivers and streams |
| `building` | `fill-color` | `--map-building` | Buildings, from zoom 13 |
| `road-casing` | `line-color` | `--map-road-casing` | Road casing |
| `road` | `line-color` | `--map-road` | Road fill |
| `place-label` | `text-color` | `--map-label` | Place names |
| `place-label` | `text-halo-color` | `--map-land` | Place-name halo |

```js
KitMapStyle.layers.forEach(function (layer) {
  if (!map.getLayer(layer.id)) return;
  var value = layer.paint === 'raster-opacity'
    ? parseFloat(getComputedStyle(document.documentElement).getPropertyValue(layer.token))
    : getComputedStyle(document.documentElement).getPropertyValue(layer.token).trim();
  map.setPaintProperty(layer.id, layer.paint, value);
});
```

`route-line` and `route-casing` are specimen overlays on the live page. They are not in `KitMapStyle.layers`. Map Editor owns data layers.

`--map-*` is set on `:root` (light) and on `night`, `note`, `signal`, `news`, and `draft`.

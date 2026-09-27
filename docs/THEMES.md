# Writer themes

The kit uses the same theme ids as Andean Road Studio (Customize view). Put `data-theme` on the document element. Light / Minimal is `:root`, so the attribute is omitted.

| Id | Studio name | Attribute |
| --- | --- | --- |
| `light` | Light / Minimal | none (`:root`) |
| `night` | Night Sky | `data-theme="night"` |
| `note` | Warm Note | `data-theme="note"` |
| `signal` | Signal Hacker | `data-theme="signal"` |
| `news` | Grey Newspaper | `data-theme="news"` |
| `draft` | Drafting Grid | `data-theme="draft"` |

`data-theme="dark"` sets the same custom properties as `night`. Older specimens and saved `component-kit-theme=dark` values still resolve. The theme menu stores `night`, not `dark`.

```html
<html lang="en" data-theme="note">
```

```js
document.documentElement.dataset.theme = 'signal';
// Light / Minimal:
document.documentElement.removeAttribute('data-theme');
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

## Map layer tokens

Set on `:root` and on every `[data-theme]`, including the `dark` alias. Chrome does not use the brand hues. Those stay on data: `--viz-1` … `--viz-8`, `--route-line`, `--route-ink`, `--route-casing`.

| Token | Layer |
| --- | --- |
| `--map-land` | Background / land |
| `--map-water` | Water and waterways |
| `--map-park` | Grass, wetland, parks |
| `--map-wood` | Forest |
| `--map-beach` | Sand |
| `--map-scrub` | Scrub and farmland |
| `--map-glacier` | Glacier, ice shelf, ice |
| `--map-road` | Road fill |
| `--map-road-casing` | Road casing |
| `--map-building` | Buildings |
| `--map-hillshade` | Relief ink for a legend or a client-drawn hillshade |
| `--map-hillshade-opacity` | Strength of the specimen’s hillshade raster |
| `--map-label` | Place labels |

`map-style.js` builds one MapLibre style from the computed values. Changing `data-theme` recolors the live map with `setPaintProperty`. It does not reload the page. The specimen sets MapLibre `cooperativeGestures` so a long page that embeds the map can still scroll.

The specimen (`map.html`) uses [OpenFreeMap](https://openfreemap.org/) vector tiles (OpenMapTiles schema, no API key) and the Esri World Hillshade raster for relief. OpenFreeMap does not include a DEM. The public terrarium elevation bucket does not send `Access-Control-Allow-Origin`, so a MapLibre `hillshade` layer cannot read it. The Esri overlay is grayscale; `--map-hillshade` is the matching ink token for Studio and Atelier.

Map controls are `.icon-btn.icon-btn--touch` inside `.map-viewport`, `.map-controls`, and `.map-toolbar`. The place callout is `.map-popup`. The swatch row is `.map-legend`.

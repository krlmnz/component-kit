# Map editor ↔ kit matrix

Living check for the **map editor** (not a second component set). Two axes:

- **Chrome** — kit classes and tokens in `global.css` (panels, fields, buttons).
- **Map-theme** — tokens that paint MapLibre (`--map-water`, `--map-land`, `--map-park`, `--map-road`, `--map-building`, hillshade, label halos).

Do not paint a basemap with focus or danger (`--focus-*`, `--error`, `--accent`). Shared ramps prefer OKLCH. Map chrome (controls, attribution, overlays on the canvas) is Systems MapLibre/themes work, in flight. Do not add competing components here.

| Editor surface | Kit component / pattern | Token axis (chrome vs map-theme) | Status | Notes |
| --- | --- | --- | --- | --- |
| Floating zoom / locate / layers cluster over the map | None. `.icon-btn--touch` is only a 44px chrome button. | Chrome, drawn over the map | Systems in-flight | Systems owns this cluster. Do not mint a kit zoom stack. |
| Attribution strip | None | Chrome, drawn over the map | Systems in-flight | Map chrome, not a kit footer. |
| Translucent panels over a full-bleed map | `.panel` (opaque document UI: `--surface`, border, header) | Chrome | gap | `.panel` is a document panel. Do not glass it. Overlay chrome stays with Systems. |
| Layers paint stack (reorder, color, opacity, pattern, duplicate) | `.list-row` reorder, `.combo` color/opacity/weight, `.tile` / `.tile-grid` pattern | Chrome for the panel; paint values are map-theme | fit | Pointer reorder, fill, border, and pattern exist on `map-layers.html`. No duplicate action. Swatch hex is not a `--map-*` token. |
| Place card | `place-card.html`: `.panel`, `.field`, `.input`, icon `.tile` | Chrome | fit | Document card. Icon choice updates the trigger. |
| Search / combo (map-biased results, fly-to + marker) | Search is `.input-group` + `.input`. `.combo` is the color/stroke strip, not search. | Chrome | gap | No map-biased results, fly-to, or marker. |
| Color library / CVD vs kit chrome tokens | `color-library.html` static picker; Color Scale ramps use chrome anchors in OKLab | Chrome vs map color | gap | The picker does not write the swatch. No CVD check. Chrome tokens are not a map palette. Prefer OKLCH for shared ramps. |
| Map theme paint vars | Not in `global.css` | Map-theme | gap | `--map-water`, `--map-land`, `--map-park`, `--map-road`, `--map-building`, hillshade. Systems themes paints MapLibre. Do not alias these to focus or danger. |
| Label type + halos | Kit type is UI chrome (`--text-*`) | Map-theme | gap | Label face and halos are MapLibre paint, not kit type. |

Studio’s writing shell is a different consume surface: [`STUDIO-RECIPE.md`](STUDIO-RECIPE.md).

# Contrast

WCAG 2.x relative luminance from the sRGB hexes in `global.css`. `color-mix(in srgb, …)` backgrounds are channel interpolations rounded to 8-bit. A pair passes when the unrounded ratio meets the threshold. Ratios below are rounded to two decimals.

Thresholds:

- **Text 4.5:1.** Button labels are `--text-sm` (12px). Badges are `--text-xs` (11px). Both are normal text.
- **UI 3:1.** Control boundaries, focus and selected strokes, invalid borders, and non-text parts of a control.
- **Link color is not the only cue.** `--accent-text` matches Studio and does not clear 3:1 against `--text`. Anchors and `.btn--link` are underlined.

Theme ids, Studio hexes, and the deltas below are in [`THEMES.md`](THEMES.md).

## Shared status fills

| Token | Light, note, draft, news | Night and signal |
| --- | --- | --- |
| `--success` | `#00A470` | `#00A470` |
| `--success-text` | `#0E7850` (news `#0C6946`) | `#14AA75` |
| `--warn` | `#F89B17` | `#F89B17` |
| `--warn-text` | `#9F5A03` (news `#8A4D02`) | `#F89B17` |
| `--error` | `#DA3540` | `#DA3540` |
| `--error-text` | `#C62A42` (news `#AF253B`) | `#FF8B91` |
| `--error-soft` | `#FFECEC` | `#3A1E20` |
| `--on-error` | `#FFFFFF` | `#FFFFFF` |

`--success-soft` is 14% `--success` on `--surface`. `--success-wash` is 8%. `--warn-soft` is 16%. `--warn-wash` is 10%. `--accent-wash` is 7% `--accent` on `--surface`. Info aliases the accent pair, so its text ratios are the `--accent-text` rows.

Do not paint labels with `--success` or `--warn`. On white, `--success` is 3.21:1 and `--warn` is 2.17:1.

## Surfaces, text, borders, focus

Focus and the selected stroke use `--accent`. The strict surface for each theme is the one with the lowest ratio.

| Theme | `--text` on `--surface` | `--text-2` strict | `--border` strict | `--accent` strict (focus) | `--on-accent` on `--accent` | `--accent-text` on `--surface` |
| --- | --- | --- | --- | --- | --- | --- |
| light | 18.49:1 | 5.46:1 on `--surface-2` | 3.13:1 on `--surface-2` | 5.11:1 on `--surface-2` | 5.83:1 | 7.60:1 |
| night | 15.84:1 | 8.31:1 on `--surface-2` | 3.12:1 on `--surface-2` | 10.05:1 on `--surface-2` | 11.53:1 | 11.87:1 |
| signal | 17.96:1 | 8.21:1 on `--surface-2` | 3.14:1 on `--surface-2` | 9.68:1 on `--surface-2` | 10.60:1 | 11.60:1 |
| note | 12.44:1 | 5.50:1 on `--surface-2` | 3.13:1 on `--surface-2` | 4.86:1 on `--surface-2` | 5.73:1 | 7.87:1 |
| news | 16.15:1 | 5.29:1 on `--bg` | 3.13:1 on `--bg` | 9.32:1 on `--bg` | 13.20:1 | 14.67:1 |
| draft | 16.08:1 | 4.56:1 on `--bg` | 3.14:1 on `--bg` | 5.38:1 on `--bg` | 6.13:1 | 7.99:1 |

`--text` also clears 4.5:1 on `--bg` and `--surface-2` in every theme. `--on-accent` on `--accent-hover` is higher than on `--accent` (the hover fill is darker on light themes and lighter on night and signal, where the label is dark). `--border` also clears 3:1 on the other two surfaces.

`--accent-text` on `--accent-soft` is at least 6.05:1 (light). On the 7% wash it stays above the surface row, because the wash is closer to `--surface` than the soft fill is.

## Status labels

Strict pair is the lowest of `--surface`, `--bg`, `--surface-2`, the soft fill, and the wash.

| Theme | `--success-text` | `--warn-text` | `--error-text` | `#FFFFFF` on `--error` | `--error` on strict surface |
| --- | --- | --- | --- | --- | --- |
| light | 4.69:1 on soft | 4.67:1 on `--surface-2` | 4.82:1 on `--surface-2` | 4.60:1 | 4.03:1 on `--surface-2` |
| night | 5.03:1 on soft | 6.37:1 on soft | 6.75:1 on `#3A1E20` | 4.60:1 | 3.63:1 on `--surface-2` |
| signal | 5.60:1 on soft | 7.02:1 on soft | 6.75:1 on `#3A1E20` | 4.60:1 | 4.03:1 on `--surface-2` |
| note | 4.64:1 on soft | 4.52:1 on `--surface-2` | 4.67:1 on `--surface-2` | 4.60:1 | 3.90:1 on `--surface-2` |
| news | 4.74:1 on `--bg` | 4.72:1 on `--bg` | 4.71:1 on `--bg` | 4.60:1 | 3.25:1 on `--bg` |
| draft | 4.69:1 on soft | 4.68:1 on `--bg` | 4.83:1 on `--bg` | 4.60:1 | 4.04:1 on `--bg` |

Danger buttons use `--on-error` (`#FFFFFF`), not `--on-accent`. Night ink `#071018` on `#DA3540` is 4.16:1. Signal ink `#030608` on `#DA3540` is 4.42:1. The switch thumb still uses `--on-accent`: on night it is 3.58:1 against `--border` and 11.53:1 against `--accent`; on signal, 3.44:1 and 10.60:1.

## Notes

- **Grey Newspaper** is the theme that needed new status text. `#0E7850` on `#D9D9D4` is 3.88:1. The news text hexes are the darker step.
- **Disabled controls** use `opacity: .45`. WCAG contrast does not apply to disabled UI.
- **Color Scale swatches** are sample paints, not chrome.
- **Map layer colors** separate land, water, and roads. They are not text and are not in this table.

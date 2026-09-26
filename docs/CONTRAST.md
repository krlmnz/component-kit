# Contrast table (post-retune)

WCAG 2.x relative luminance, computed from the sRGB hex values in `global.css`. `color-mix(in srgb, …)` backgrounds are channel interpolations rounded to 8-bit, which is the color the mix resolves to. Ratios below are rounded to two decimal places. A pair passes when the unrounded ratio meets the threshold.

Thresholds used here:

- **Text 4.5:1.** Button labels are `--text-sm` (12px) and badges are `--text-xs` (11px). Both are normal text, including when the weight is 600 or 700.
- **UI 3:1.** Boundaries and icons that identify a control (borders, focus/selected strokes, invalid field borders, filled buttons against the page).
- **Link 3:1.** `--accent-text` against `--text`, so link color is not the only distinction. Anchors and `.btn--link` are also underlined.

Body text (`--text` on `--surface`) was already well above 4.5:1 and is unchanged. Hues stay in the original families: accent around OKLCH hue 233, error around 23, success around 162, warn around 62–67. Lightness is what moved.

## Token values

| Token | Light before | Light after | Dark before | Dark after |
| --- | --- | --- | --- | --- |
| `--border` | `#E5E5E5` | `#8A8A8C` | `#434547` | `#6E7271` |
| `--accent` | `#2592C2` | `#1A7EAA` | inherited `#2592C2` | `#1A7EAA` |
| `--accent-hover` | `#1F7FAB` | `#18749C` | inherited `#1F7FAB` | `#177A9E` |
| `--on-accent` | `#FFFFFF` | `#FFFFFF` | inherited `#FFFFFF` | `#FFFFFF` |
| `--accent-text` | `#1B6E96` | `#1B6E96` | `#69C4EA` | `#2399DC` |
| `--text-2` | `#6B7280` | `#666D7B` | `#9CA3AF` | `#9CA3AF` |
| `--success` | `#00A470` | `#00A470` | inherited `#00A470` | `#00A470` |
| `--success-text` | — (labels used `--success`) | `#0E7850` | — | `#14AA75` |
| `--warn` | `#F89B17` | `#F89B17` | inherited `#F89B17` | `#F89B17` |
| `--warn-text` | — (labels mixed `--warn` with `black`) | `#9F5A03` | — (same black mix, ~2.57:1) | `#F89B17` |
| `--error` | `#E5484D` | `#DA3540` | inherited `#E5484D` | `#DA3540` |
| `--error-text` | `#C62A42` | `#C62A42` | `#FF8B91` | `#FF8B91` |
| `--error-soft` | `#FFECEC` | `#FFECEC` | `#3A1E20` | `#3A1E20` |

`--success` and `--warn` stay the bright status hues. They are tint sources, not label colors. Badges, alerts, and the success toast icon use the `*-text` tokens. Soft and wash tokens are `color-mix` with `--surface`, so the badge fill is the same on `--bg` and inside a panel.

Computed mixes:

| Token | Light | Dark |
| --- | --- | --- |
| `--accent-soft` (12%) | `#E4F0F5` | `#1C2A32` |
| `--accent-wash` (6%) | `#F1F7FA` | `#1C252A` |
| `--success-soft` (14%) | `#DBF2EB` | `#18322D` |
| `--success-wash` (8%) | `#EBF8F4` | `#1A2A28` |
| `--warn-soft` (16%) | `#FEEFDA` | `#3F3320` |
| `--warn-wash` (10%) | `#FEF5E8` | `#322B21` |

## Previously failing pairs

| Pair | Before | After |
| --- | --- | --- |
| `#FFFFFF` on `--accent` (primary label, both themes) | 3.52:1 | 4.56:1 |
| `#FFFFFF` on `--accent-hover` | 4.49:1 | 5.23:1 light, 4.87:1 dark |
| `#FFFFFF` on `--error` (danger label, both themes) | 3.91:1 | 4.60:1 |
| `--success` on white, and on the success badge tint | 3.21:1 and 2.74:1 | labels use `--success-text`: 5.50:1 and 4.69:1 light; 5.55:1 and 4.59:1 dark |
| `--warn` on white | 2.17:1 | labels use `--warn-text`: 5.33:1 on white, 4.72:1 on the warn tint |
| Dark warn badge (warn mixed with black on a dark tint) | 2.57:1 | 5.68:1 (`#F89B17` on `#3F3320`) |
| `--border` on `--surface` | 1.26:1 light, 1.72:1 dark | 3.45:1 light, 3.40:1 dark |
| Dark `--accent-text` against `--text` `#FFFFFF` | 1.97:1, no underline | 3.15:1, and links are underlined |
| `--text-2` on `--surface-2` (neutral badge) | 4.32:1 | 4.64:1 light; dark was already 5.91:1 |

## Light theme

Surfaces: `--surface` `#FFFFFF`, `--bg` `#FAFAFA`, `--surface-2` `#F2F2F2`.

| Pair | Ratio | Need | Result |
| --- | --- | --- | --- |
| `--on-accent` on `--accent` | 4.56:1 | 4.5 text | Pass |
| `--on-accent` on `--accent-hover` | 5.23:1 | 4.5 text | Pass |
| `--on-accent` on `--error` | 4.60:1 | 4.5 text | Pass |
| `--on-accent` on danger hover (`brightness(.92)` → `#C9313B`) | 5.27:1 | 4.5 text | Pass |
| `--accent-text` on `--surface` | 5.65:1 | 4.5 text | Pass |
| `--accent-text` on `--bg` | 5.41:1 | 4.5 text | Pass |
| `--accent-text` on `--surface-2` | 5.05:1 | 4.5 text | Pass |
| `--accent-text` on `--accent-soft` `#E4F0F5` | 4.86:1 | 4.5 text | Pass |
| `--accent-text` on `--accent-wash` `#F1F7FA` | 5.23:1 | 4.5 text | Pass |
| `--accent-text` vs `--text` | 3.27:1 | 3.0 link | Pass |
| `--success-text` on `--surface` | 5.50:1 | 4.5 text | Pass |
| `--success-text` on `--bg` | 5.27:1 | 4.5 text | Pass |
| `--success-text` on `--surface-2` | 4.91:1 | 4.5 text | Pass |
| `--success-text` on `--success-soft` `#DBF2EB` | 4.69:1 | 4.5 text | Pass |
| `--success-text` on `--success-wash` `#EBF8F4` | 5.04:1 | 4.5 text | Pass |
| `--warn-text` on `--surface` | 5.33:1 | 4.5 text | Pass |
| `--warn-text` on `--bg` | 5.11:1 | 4.5 text | Pass |
| `--warn-text` on `--surface-2` | 4.76:1 | 4.5 text | Pass |
| `--warn-text` on `--warn-soft` `#FEEFDA` | 4.72:1 | 4.5 text | Pass |
| `--warn-text` on `--warn-wash` `#FEF5E8` | 4.94:1 | 4.5 text | Pass |
| `--error-text` on `--surface` | 5.51:1 | 4.5 text | Pass |
| `--error-text` on `--bg` | 5.28:1 | 4.5 text | Pass |
| `--error-text` on `--surface-2` | 4.92:1 | 4.5 text | Pass |
| `--error-text` on `--error-soft` | 4.84:1 | 4.5 text | Pass |
| `--text` on `--surface` | 18.49:1 | 4.5 text | Pass |
| `--text` on `--bg` | 17.72:1 | 4.5 text | Pass |
| `--text-2` on `--surface` | 5.20:1 | 4.5 text | Pass |
| `--text-2` on `--bg` | 4.98:1 | 4.5 text | Pass |
| `--text-2` on `--surface-2` | 4.64:1 | 4.5 text | Pass |
| `--border` on `--surface` | 3.45:1 | 3.0 UI | Pass |
| `--border` on `--bg` | 3.30:1 | 3.0 UI | Pass |
| `--border` on `--surface-2` | 3.08:1 | 3.0 UI | Pass |
| `--accent` on `--surface` (focus / selected stroke) | 4.56:1 | 3.0 UI | Pass |
| `--accent` on `--bg` | 4.37:1 | 3.0 UI | Pass |
| `--accent` on `--surface-2` | 4.07:1 | 3.0 UI | Pass |
| `--accent-hover` on `--surface` | 5.23:1 | 3.0 UI | Pass |
| `--accent-hover` on `--surface-2` | 4.67:1 | 3.0 UI | Pass |
| `--error` on `--surface` (invalid border) | 4.60:1 | 3.0 UI | Pass |
| `--error` on `--surface-2` | 4.11:1 | 3.0 UI | Pass |
| `--success` on `--surface` (tint source, not a label) | 3.21:1 | 3.0 UI / 4.5 text | Pass as UI, fail as text |
| `--success` on `--success-soft` `#DBF2EB` | 2.74:1 | 4.5 text | Fail — labels use `--success-text` |
| `--warn` on `--surface` (tint source, not a label) | 2.17:1 | — | Not used as text or as a control boundary |
| `--warn` on `--warn-soft` `#FEEFDA` | 1.92:1 | 4.5 text | Fail — labels use `--warn-text` |

## Dark theme

Surfaces: `--surface` `#1C1F22`, `--bg` `#111416`, `--surface-2` `#24272B`. `--text` is `#FFFFFF`.

| Pair | Ratio | Need | Result |
| --- | --- | --- | --- |
| `--on-accent` on `--accent` | 4.56:1 | 4.5 text | Pass |
| `--on-accent` on `--accent-hover` | 4.87:1 | 4.5 text | Pass |
| `--on-accent` on `--error` | 4.60:1 | 4.5 text | Pass |
| `--on-accent` on danger hover (`brightness(.92)` → `#C9313B`) | 5.27:1 | 4.5 text | Pass |
| `--accent-text` on `--surface` | 5.25:1 | 4.5 text | Pass |
| `--accent-text` on `--bg` | 5.87:1 | 4.5 text | Pass |
| `--accent-text` on `--surface-2` | 4.76:1 | 4.5 text | Pass |
| `--accent-text` on `--accent-soft` `#1C2A32` | 4.67:1 | 4.5 text | Pass |
| `--accent-text` on `--accent-wash` `#1C252A` | 4.94:1 | 4.5 text | Pass |
| `--accent-text` vs `--text` | 3.15:1 | 3.0 link | Pass |
| `--success-text` on `--surface` | 5.55:1 | 4.5 text | Pass |
| `--success-text` on `--bg` | 6.20:1 | 4.5 text | Pass |
| `--success-text` on `--surface-2` | 5.03:1 | 4.5 text | Pass |
| `--success-text` on `--success-soft` `#18322D` | 4.59:1 | 4.5 text | Pass |
| `--success-text` on `--success-wash` `#1A2A28` | 5.01:1 | 4.5 text | Pass |
| `--warn-text` on `--surface` | 7.64:1 | 4.5 text | Pass |
| `--warn-text` on `--bg` | 8.54:1 | 4.5 text | Pass |
| `--warn-text` on `--surface-2` | 6.92:1 | 4.5 text | Pass |
| `--warn-text` on `--warn-soft` `#3F3320` | 5.68:1 | 4.5 text | Pass |
| `--warn-text` on `--warn-wash` `#322B21` | 6.45:1 | 4.5 text | Pass |
| `--error-text` on `--surface` | 7.37:1 | 4.5 text | Pass |
| `--error-text` on `--bg` | 8.24:1 | 4.5 text | Pass |
| `--error-text` on `--surface-2` | 6.68:1 | 4.5 text | Pass |
| `--error-text` on `--error-soft` | 6.75:1 | 4.5 text | Pass |
| `--text` on `--surface` | 16.56:1 | 4.5 text | Pass |
| `--text` on `--bg` | 18.49:1 | 4.5 text | Pass |
| `--text-2` on `--surface` | 6.52:1 | 4.5 text | Pass |
| `--text-2` on `--bg` | 7.28:1 | 4.5 text | Pass |
| `--text-2` on `--surface-2` | 5.91:1 | 4.5 text | Pass |
| `--border` on `--surface` | 3.40:1 | 3.0 UI | Pass |
| `--border` on `--bg` | 3.79:1 | 3.0 UI | Pass |
| `--border` on `--surface-2` | 3.08:1 | 3.0 UI | Pass |
| `--accent` on `--surface` | 3.63:1 | 3.0 UI | Pass |
| `--accent` on `--bg` | 4.06:1 | 3.0 UI | Pass |
| `--accent` on `--surface-2` | 3.29:1 | 3.0 UI | Pass |
| `--accent-hover` on `--surface` | 3.40:1 | 3.0 UI | Pass |
| `--accent-hover` on `--surface-2` | 3.08:1 | 3.0 UI | Pass |
| `--error` on `--surface` | 3.60:1 | 3.0 UI | Pass |
| `--error` on `--surface-2` | 3.26:1 | 3.0 UI | Pass |
| `--success` on `--surface` (tint source) | 5.16:1 | 4.5 text | Pass on the bare surface |
| `--success` on `--success-soft` `#18322D` | 4.27:1 | 4.5 text | Fail — labels use `--success-text` |
| `--warn` on `--surface` | 7.64:1 | 4.5 text | Pass (same hex as `--warn-text`) |

## Notes

- **Do not paint labels with `--success` or `--warn`.** On white, `--success` is 3.21:1 (large enough for a non-text icon, short of 4.5 for text) and `--warn` is 2.17:1. Use `--success-text` and `--warn-text`. Dark `--warn-text` can stay the bright amber because that amber is light against the dark surfaces.
- **Links.** `--accent-text` clears 3:1 against `--text` in both themes (3.27:1 light, 3.15:1 dark). `a` and `.btn--link` are underlined anyway, so a link is not identified by color alone. Nav, brand, and resource-card anchors keep `text-decoration: none`; current nav items also carry the accent wash.
- **Borders.** `#8A8A8C` and `#6E7271` are the lightest cool grays that still clear 3:1 against every surface token, including `--surface-2`. The strict pair in each theme is border on `--surface-2` at 3.08:1.
- **One accent and one error for both themes.** `#1A7EAA` and `#DA3540` clear 4.5:1 with white text and 3:1 against dark surfaces, so the dark theme does not need a second fill. Hover is slightly different per theme: light `#18749C` can go darker; dark `#177A9E` stays just darker than the fill so it still clears 3:1 on `--surface-2`.
- **Disabled controls** use `opacity: .45`. WCAG contrast does not apply to disabled UI.
- **Color Scale palette swatches** such as `#FF4E4F` and `#2592C2` are sample paints, not chrome. Invalid color-scale fields use `--error` and `--error-text`.

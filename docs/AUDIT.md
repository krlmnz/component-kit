# Component Kit audit

Reviewed tree: `main` at `b8c58d8` (“Serve Component Kit from the repo root for GitHub Pages”), compared with `src/` on the same commit. This document is a review only. It does not change components, tokens, or the publish copy.

Standards used: perceptual color and accessibility (WCAG 2.x AA: 4.5:1 for normal text, 3:1 for large text and for UI boundaries), tokens instead of one-off CSS, document what ships, keep the kit as editable HTML/CSS, one visual language shared by Map Atelier and andean-road.com, and no sloppy variants or duplicated chrome.

Contrast ratios below were computed from the hex values and `color-mix(in srgb, …)` recipes in the files, using WCAG relative luminance. `color-mix` backgrounds were approximated by interpolating sRGB channels, which matches that color space. Button and badge text uses `--text-sm` (12px) or `--text-xs` (11px). That is normal text. Large text starts at 24px, or about 18.7px when bold.

## Executive summary

The kit has a real shared core. `global.css` defines themeable surfaces, a `.panel` shell, form controls, and the map-editor atoms `.combo`, `.swatch`, `.tile` / `.tile-grid`, `.list-row`, and `.visibility-toggle`. The reference index iframes each standalone HTML file through `component-embed.js`, so preview markup is not copied into `index.html`. On this commit the repository root and `src/` are byte-for-byte identical for every shared file, including the empty `script.js`. Place Card does apply a chosen icon to its trigger, and Map Layers visibility buttons do update `aria-pressed` and their names. Color Scale really interpolates in OKLab.

That core is not yet safe to copy into both products. Primary and danger labels fail AA in both themes (`#FFFFFF` on `--accent` `#2592C2` is 3.52:1; on `--error` `#E5484D` is 3.91:1) because `.btn` text is 12px and the dark theme never recasts `--accent`, `--error`, or `--on-accent`. Success and warning text, and the badge and alert recipes built from them, fail AA on light surfaces; warning badges also fail in the dark theme. `--border` against `--surface` is 1.26:1 in light and 1.72:1 in dark, under the 3:1 UI-boundary bar. Dark-theme links are `--accent-text` `#69C4EA` on `--text` `#FFFFFF` (1.97:1) with no underline.

The components Atelier and the site are most likely to copy have accessibility holes: closed dialogs stay `aria-modal="true"` in the accessibility tree, closed menus stay in the tab order, toasts have no live region, tooltip icon buttons have no accessible name, and the color sliders set `outline: none` with no replacement. Several “components” (badge, toast, tabs, menu, tooltip, modal chrome, the color picker, the entire color scale) live in page `<style>` blocks and raw hex, so linking `global.css` does not deliver them. The index overclaims: it calls type fluid, calls Map Layers rows draggable, and calls the scale a perceptual brand-to-data ramp. The OKLab mix is real; a safe quantitative ramp is not. Sync is clean today and unguarded, so the next edit of only one tree becomes a broken publish.

## Ranked findings

### P0 — ship blockers, contrast, accessibility

#### P0.1 Action and status colors fail AA text contrast

**Where.** `global.css` tokens `--accent` `#2592C2`, `--accent-hover` `#1F7FAB`, `--on-accent` `#FFFFFF`, `--success` `#00A470`, `--warn` `#F89B17`, `--error` `#E5484D`, `--text-2` `#6B7280`, `--surface-2` `#F2F2F2`. Dark overrides in `[data-theme="dark"]` change surfaces, `--text`, `--text-2`, `--accent-text`, and `--error-text` only. Usage: `.btn--primary` and `.btn--danger` in `global.css`; `.badge--success`, `.badge--warn`, `.badge--neutral` in `badge.html`; `.alert--success` and `.alert--warn` in `toast.html`.

**Measured pairs.**

| Pair | Ratio | AA for this size |
| --- | --- | --- |
| `#FFFFFF` on `--accent` `#2592C2` (primary label, both themes) | 3.52:1 | Fail |
| `#FFFFFF` on `--accent-hover` `#1F7FAB` | 4.49:1 | Fail (under 4.5) |
| `#FFFFFF` on `--error` `#E5484D` (danger label, both themes) | 3.91:1 | Fail |
| `--success` `#00A470` on `--surface` `#FFFFFF` | 3.21:1 | Fail |
| Success badge text on `color-mix(success 14%, white)` ≈ `#DBF2EB` | 2.74:1 | Fail |
| Success alert text on `color-mix(success 8%, white)` ≈ `#EBF8F4` | 2.94:1 | Fail |
| `--warn` `#F89B17` on `#FFFFFF` | 2.17:1 | Fail |
| Warn badge ≈ `#A1650F` on ≈ `#FEEFDA` | 4.24:1 | Fail at 11px |
| Warn alert ≈ `#AE6C10` on ≈ `#FEF5E8` | 3.93:1 | Fail |
| Dark warn badge ≈ `#A1650F` on ≈ `#3F3320` | 2.57:1 | Fail |
| Dark success badge `#00A470` on ≈ `#18322D` | 4.27:1 | Fail at 11px |
| `--text-2` `#6B7280` on `--surface-2` `#F2F2F2` (neutral badge) | 4.32:1 | Fail at 11px |

Secondary text on a white surface does pass: `--text-2` on `--surface` is 4.83:1, and `--text` on `--surface` is 18.49:1. `--error-text` `#C62A42` on white is 5.51:1. Dark `--accent-text` `#69C4EA` on `--surface` `#1C1F22` is 8.42:1. The failures are the hues used as label color, plus warning mixes that hard-code `black` and therefore go dark-on-dark when `--surface` flips.

**Why it matters.** Primary, danger, published, and needs-attention are the calls to action and status chips on maps. Both products inherit the same tokens. A dark-theme toggle that leaves `--accent` and `--success` unchanged means the light-theme failure ships in dark as well, and the warning recipe gets worse.

**Suggested fix.** Retune `--accent`, `--accent-hover`, `--on-accent`, `--success`, `--warn`, and `--error` until 12px text on those fills clears 4.5:1 in both themes. Give status text its own tokens (as `--error-text` already does) and point `.badge--*` and `.alert--*` at those, with theme-specific soft backgrounds. Stop mixing status hues with `black`. Add a small contrast table next to the color tokens in `index.html` so the next palette edit can see the ratios.

#### P0.2 Control borders fail non-text contrast, and dark links fail by color alone

**Where.** `--border` `#E5E5E5` on `--surface` `#FFFFFF` and `--bg` `#FAFAFA` (`global.css`). Dark `--border` `#434547` on `--surface` `#1C1F22` and `--bg` `#111416`. Inputs, combos, tiles, swatches, and panels all use this token. Links: `a { color: var(--accent-text); }` with no default underline.

**Measured pairs.**

| Pair | Ratio | Bar |
| --- | --- | --- |
| Light `--border` on `--surface` | 1.26:1 | 3:1 UI, fail |
| Light `--border` on `--bg` | 1.21:1 | Fail |
| Dark `--border` on `--surface` | 1.72:1 | Fail |
| Dark `--border` on `--bg` | 1.92:1 | Fail |
| Dark `--accent-text` `#69C4EA` against `--text` `#FFFFFF` | 1.97:1 | 3:1 link distinction, fail |
| Light `--accent-text` `#1B6E96` against `--text` `#111416` | 3.27:1 | Pass |

Hover does repair the input border: `.input:hover` switches to `--text-2`, which is 4.83:1 on white. The resting state is the one that fails. Focus on `.input` also sets `border-color: var(--accent)` (3.52:1 on white), so the focused field is identifiable. The resting field is not.

**Why it matters.** Hex, opacity, and weight combos are the densest UI in the editor. If the 1px boundary disappears into the surface, Atelier panels and the marketing site lose the control affordance in both themes. Ununderlined dark links that sit 1.97:1 away from body text fail Use of Color for anyone who cannot rely on hue.

**Suggested fix.** Split a `--border-strong` token that clears 3:1 against `--surface` and `--bg` in both themes, and use it on inputs, `.combo__*`, tiles, and swatches. Keep a quieter border only where a shadow or fill already defines the shape. Underline links in body copy, or darken/lighten `--accent-text` until it clears 3:1 against `--text` in both themes.

#### P0.3 Dialogs, menus, and toasts expose the wrong thing to keyboard and assistive tech

**Where.**

- `modal.html`: both overlays stay in the DOM with `role="dialog"` and `aria-modal="true"`. Closed state is `opacity: 0` and `pointer-events: none` on `.modal-overlay`. There is no `hidden`, `aria-hidden`, focus move, focus trap, or Escape handler. Two modal dialogs are therefore exposed at once, including while they look closed.
- `dropdown.html`: `.menu__panel` hides with opacity and `pointer-events: none`. The `role="menuitem"` buttons remain tabbable. The trigger has no `aria-expanded`, `aria-haspopup`, or `aria-controls`. There is no Escape or arrow-key behavior. Outside click does close an open menu.
- `toast.html`: `spawnToast` appends a `.toast` and removes it after 4 seconds. The tray has no `aria-live` and the toast has no `role="status"` or `role="alert"`. There is no dismiss control and no pause.

**Why it matters.** These three files are the overlay language for “Delete this map”, overflow actions, and “Map published”. Copied as they stand, a screen-reader user meets dialogs that are not open, can tab into menu items that are not visible, and never hears save or publish feedback. Auto-dismiss without a way to hold the message also fails users who need more time.

**Suggested fix.** When a dialog is closed, remove it from the accessibility tree (`hidden` or `aria-hidden`) and drop `aria-modal` until it opens; on open, move focus inside, trap Tab, and close on Escape, restoring focus to the trigger. When a menu is closed, hide its items the same way and set `aria-expanded` on the trigger; add Escape and arrow keys. Render toasts in an `aria-live="polite"` region (`assertive` only for errors), and let the user dismiss or pause them. Keep the visual `.panel` / `.panel--pop` shell.

#### P0.4 Unnamed icon buttons, fake buttons, and a slider with focus removed

**Where.**

- `tooltip.html`: three `.icon-btn` controls have `aria-describedby` and no `aria-label` or visible text. The tooltip is the description, not the name. Each button also sets an inline `width`/`height` of 32px over the 28px `.icon-btn` size.
- `badge.html`: `.chip__remove` is a `<span role="button">` with no `tabindex` and no key handler.
- `color-library.html`: `.search-field__clear` is the same pattern. `.color-picker__eyedropper` is a `<span role="button" tabindex="0">` with no activation handler. The search `<input>` has no label (its value is the placeholder word “Value”).
- `color-library.html` `.slider`: `outline: none` and no `:focus-visible` replacement.
- `color-scale.html`: `.cs-pal__x` is `display: none` until `.cs-pal:hover`, so keyboard and touch users cannot remove a palette color. `#csFile` sits in `.cs-upload` and is not associated with the visible “Upload image to extract” text.

**Why it matters.** Icon-only map tools (add pin, settings, preview, clear, remove) are how both products stay compact. A button with an empty name is announced as “button”. A control that only appears on hover is absent for anyone not using a pointer. A range input with its outline removed and nothing in its place has no visible focus.

**Suggested fix.** Give every icon-only control a real `<button>` and an `aria-label` that names the action; keep the tooltip as extra description. Show palette-remove without requiring hover (always available on focus). Restore a visible focus style on `.slider` using the same accent border or outline as `.input`. Associate the file input with its visible label.

### P1 — system debt

#### P1.1 Two trees, one manual copy, no guard

**Where.** `README.md` (edit `src/`, then copy to the repository root). `index.html` (“Edit the source file, not this index”) names `place-card.html` at the URL the browser is on, which on GitHub Pages is the root. `src/.codepen/` exists only under `src/`.

**Evidence.** A byte compare of `badge.html`, `button.html`, `color-library.html`, `color-scale.html`, `component-embed.js`, `dropdown.html`, `global.css`, `index.html`, `inputs.html`, `map-layers.html`, `modal.html`, `place-card.html`, `style.css`, `tabs.html`, `toast.html`, `tooltip.html`, and `script.js` shows the root and `src/` copies identical on `b8c58d8`. Sync is not currently broken.

**Why it matters.** Atelier and the site can easily follow different instructions and edit different copies. The next one-sided edit publishes stale kit files, or leaves `src/` behind the live site. There is no CI check.

**Suggested fix.** Keep both trees until a publish step exists. Add a check that fails when any shared filename differs between root and `src/`. Point `README.md` and the index authoring section at the same edit path. Leave `src/.codepen/` out of the publish copy, as the README already says.

#### P1.2 The shared stylesheet does not contain the components the index lists

**Where.** `global.css` opens with “Every component HTML file loads only this stylesheet” and “never raw values at the call site.” These files then add a second `<style>` block and raw values: `badge.html`, `dropdown.html`, `modal.html`, `tabs.html`, `toast.html`, `tooltip.html`, `color-library.html`, `color-scale.html`, `map-layers.html`, `place-card.html`, `inputs.html` (the switch). `button.html` is the exception: it is markup plus `global.css` only.

The index “Shared primitives” table lists `.btn`, `.panel`, `.side-nav`, `.component-preview`, and `.input`. It does not list `.combo`, `.swatch`, `.tile`, `.list-row`, or `.prop-row`, which are the atoms the README says the products share.

**Why it matters.** Copying a class name from the docs into Atelier does not bring badge, toast, tabs, menu, tooltip, or modal chrome along. Each product will paste a `<style>` block and then fork it. That is already happening inside this repo (see P1.7).

**Suggested fix.** Move badge, alert, toast, tabs, menu, tooltip, modal overlay, and the switch into `global.css` next to `.btn` and `.panel`. Leave page `<style>` blocks for demo layout only (the 340px `.kit-frame`). Teach the primitives table the map atoms. When a value is a color, a space, or a radius, use a token.

#### P1.3 Color Scale is a second color language, and the OKLab mix is not yet a data scale

**Where.** `color-scale.html` stylesheet (`.cs-*`) and the script’s `BRAND` array, `blendPerceptual`, `linearToSrgb`, and `init`. Index copy at `#component-color-scale`: “Perceptual OKLab brand→data scales.”

**What the code actually does.** `rgbToOklab` / `oklabToRgb` use the standard Ottosson matrices. `blendPerceptual` linearly interpolates L, a, and b. `makeBlendScale` builds 11 steps and `sampleColors` downsamples to 5, 7, 9, or 11, keeping the endpoints. That part is perceptual.

The gaps:

- `linearToSrgb` clamps channels into 0–255. Saturated pairs (the brand list includes `#FFE901`, `#FF4E4F`, `#D556AA`) leave sRGB on the way back, and clipping can flatten steps the OKLab L channel had kept even.
- Any two colors may become a quantitative ramp. `--accent` `#2592C2` and `--success` `#00A470` have almost the same luminance (0.248 and 0.277). A choropleth between them does not get reliably lighter as the value rises. The UI still labels the preview “Map / choropleth”.
- `BRAND` hard-codes hex. It repeats `--accent`, `--success`, and `--warn`, then adds a second red, `#FF4E4F`, which is not `--error` `#E5484D`. Error borders in the same file (`.cs-add input.is-err`, `.cs-upload.is-err`) also use `#FF4E4F`.
- Palette swatches are `.cs-pal` / `.cs-swatch` / `.cs-dot`, with radii, gaps, and type in raw pixels (`8px` hex labels, `9px` and `10px` captions, `4px` and `6px` gaps). They do not use `.swatch` or `.combo`.
- `init` shuffles the brand list and builds three random scales, so the reference preview changes on every load.
- The “Shuffle scales” icon is a four-corners path, not a shuffle glyph.

**Why it matters.** This file is the shared answer to “which ramp do we use on the map?” If Atelier and the site both treat a random pair of brand colors as a sequential scale, maps will encode quantity with hue pairs that do not vary in lightness, and the two products will disagree about which red means error.

**Suggested fix.** Keep the OKLab interpolation. Constrain sequential scales so lightness moves monotonically in one direction, and reject or repair steps that clip. Drive the starter palette from tokens, with one error red. Draw palette chips with `.swatch`. Seed the demo so the reference page is stable. Document categorical brand colors and sequential ramps as different tools.

#### P1.4 Reference specimens contradict the atoms and the index

**Where and what.**

- `color-library.html` Icon, Background, and Border rows: the swatch is `--swatch-color:#9A1818` and the hex field value is `000000`. The picker swatch `#C3DDD6` matches its hex field; these three rows do not.
- The same file’s picker is a picture. `.color-picker__cursor` is fixed at `top: 14%; left: 16%`. The hue and alpha ranges do not write `--picker-hue`, the large swatch, or the combo. `.combo__width--active` is stuck on the Border weight field, so it looks focused.
- `map-layers.html` first panel title is “Color Library” on the Map Layers page. Two rows are both named “Water” with the same swatch. The detail header swatch is `#D8DEE1` and the Fill swatch is `#C3DDD6`. There is a Fill combo (including a weight segment) and no Border combo. The index says “Draggable rows, fill and border combos”.
- Drag is cosmetic. `.list-row__handle` sets `cursor: grab` and `aria-hidden="true"`. No drag listeners exist.
- `.panel--flush` is placed on a wrapper `<div>` in `color-library.html` and `map-layers.html`. The rule is `.panel--flush > .panel__body`, so the class does nothing there.
- `place-card.html` toggles `icon-picker-trigger--empty`, which has no rule.
- `map-layers.html` defines `.section-label` and never uses it; labels inline `font-size:var(--text-base); font-weight:700` onto `.field-label` instead.
- `global.css` `.prop-row__body--inputs` is unused. `.input--xs`, `.input--hex`, and `.input--compact` are documented in the index control table and unused by every specimen. The comment above `.combo` says panels should not use `.input--hex` alone, which is consistent, but the index still presents those utilities as the sizing API.

**Why it matters.** People copy the specimen. A hex field that disagrees with its swatch, a panel titled as a different component, and a “draggable” row that does not drag will show up in both products as bugs that look intentional.

**Suggested fix.** Make every specimen tell the truth: one swatch color, the same hex, a Border row where the index promises one, a single Water layer, and a working drag or an honest “order is static in this reference” label. Wire the picker or label it as a static anatomy diagram. Delete unused classes or use them.

#### P1.5 Token scale, naming, and an unfinished dark theme

**Where.** `:root` and `[data-theme="dark"]` in `global.css`. Spacing copy in `index.html` `#spacing`.

**What is there.** Spacing is `--space-0125` 2px, `--space-025` 4px, `--space-05` 8px, `--space-1` 12px, `--space-2` 24px, `--space-3` 30px, `--space-4` 39px, `--space-5` 63px, `--space-6` 96px. The index calls 2/4/8 an addition on top of an “original 12px+ scale.” The steps 30, 39, and 63 are not on an 8px grid, and `--space-1` is 12px while `--space-05` is 8px, so the names do not share one base. Radius is coherent: `--radius-sm` 6px is the component default, `--radius` 12px is used by the modal, `--radius-full` is the pill. Control heights (`--control-height-xs/sm/md` 28/32/36) are the clearest tokens in the file and the combo actually uses them.

Dark theme does not override `--accent`, `--accent-hover`, `--on-accent`, `--success`, `--warn`, `--error`, or the focus and shadow hues beyond the two shadow stacks. `--accent-soft` and `--accent-wash` do adapt, because they are `color-mix` against transparency. Status fills do not.

Type tokens are fixed pixels (`--text-xs` 11 through `--text-2xl` 20). `body` asks for `'Rethink Sans'`, and no HTML file loads a font or declares `@font-face`. `font-weight: 555` on `.panel__title` and `font-weight: 750` on `.docs-topbar__brand` are legal CSS Fonts Level 4 numbers; with a non-variable fallback they snap to a nearby face.

**Why it matters.** A shared kit’s spacing and color names are the API. An irregular scale and a dark theme that only half-overrides encourages one-off pixel values (Color Scale is already full of them) and leaves the contrast bugs in P0.1 in place. The named typeface will not match across Atelier, the site, and this kit until it is actually loaded.

**Suggested fix.** Publish one spacing base and rename or rebuild the steps that fall off it. Finish the dark theme as a full semantic set, including status and accent pairs that pass P0.1. Load Rethink Sans or set the stack to the fallback you are willing to ship. Use weight stops the loaded face actually has (400/500/600/700).

#### P1.6 The reference page describes a kit the files do not implement

**Where.** `index.html`.

- `#type`: “Fluid type tokens scale…” The tokens are fixed px, and the table omits `--text-xl` and `--text-2xl`.
- `#color`: four swatches (`--bg`, `--surface`, `--text`, `--accent`). Missing `--text-2`, `--border`, `--surface-2`, `--accent-text`, `--success`, `--warn`, `--error`, and any dark values. The sentence “Semantic tokens are theme-aware” is only partly true (P1.5).
- `#component-map-layers`: “Draggable rows, fill and border combos” (P1.4).
- Navigation and the `#map-editor` section put Button, Inputs, Modal, Tabs, Toast, Badge, Tooltip, and Dropdown inside “Map editor”.
- `#spacing`, `#radius`, and `#controls` are each packed onto a single line, which fights “editable HTML as the source of truth.”
- SVG attributes in the docs shell are lowercase `viewbox`. In an HTML document the parser remaps that to `viewBox` for SVG elements, so the icons still draw. Component files use `viewBox`. The two styles will diverge if a file is ever parsed as XML.

**Why it matters.** The index is the contract the rest of the kit claims to meet. Fluid type, a complete theme, and draggable layers are product decisions someone will implement against.

**Suggested fix.** Rewrite those sentences to match the tokens and the specimens. Show every semantic color in both themes. Split general components out of the Map editor group. Pretty-print the token tables so they can be edited by hand.

#### P1.7 Tabs, search, and icon buttons have already forked

**Where.**

- `tabs.html` `.tabs__tab`: `--text-sm`, gap `--space-1`, padding `--space-05`, selected color `--accent-text`.
- `map-layers.html` redeclares `.tabs__list` and `.tabs__tab`: `--text-base`, gap `--space-2`, padding `--space-1`, selected color `--text`. Those tabs have `role="tab"` and no tabpanel, no `aria-controls`, and no script. Clicking Design does nothing.
- `tabs.html` script sets `aria-selected` on click only. Tabs are in the tab order, so Tab and Enter work, and arrow-key tab behavior is absent. Panels have no `aria-labelledby`.
- Search: `inputs.html` uses `.input-group`. `color-library.html` reimplements it as `.search-field`, including its own focus ring.
- Icon buttons: `.icon-btn` (28px, used in panel headers) and `.btn.btn--icon` (used on the button page and the docs toolbar) are two components. Tooltips force 32px inline.

**Why it matters.** Map Layers is the screen that should prove the tabs atom. It ships a lookalike with different type, spacing, and selected color, and with ARIA that does not own a panel. Search and icon buttons will fork the same way the moment both products need them.

**Suggested fix.** One `.tabs` implementation in `global.css`, used by `tabs.html` and `map-layers.html`, including `aria-controls` and a tabpanel. One search field built from `.input-group`. One icon-button size token, used by both `.icon-btn` and `.btn--icon`, with no inline pixel overrides.

#### P1.8 Form semantics and listboxes are incomplete, and motion always runs

**Where.** `inputs.html` invalid latitude field has `.field--invalid` and a `.field__error` and does not set `aria-invalid` or `aria-describedby`. The required asterisk on Place name has no `required` or `aria-required`. `map-layers.html` title and description are `.plain-field` inputs whose only name is the placeholder. `place-card.html`, `color-library.html`, and `map-layers.html` use `role="listbox"` / `role="option"` on buttons without arrow-key selection. Place Card’s click path does update the trigger and `aria-selected`; the others do not. No file contains `prefers-reduced-motion`. Toast, modal, menu, docs drawer, and `.btn:active` all animate.

**Why it matters.** The invalid field looks correct and is not announced as an error. Placeholder-only map title fields fail labeling. A listbox that is really a group of buttons will be copied as the icon-picker pattern. Motion is part of the overlay language and cannot be reduced.

**Suggested fix.** Wire error text with `aria-invalid` and `aria-describedby`. Label the map title and description with visible labels. Either implement listbox keyboard semantics or use a named group of toggle buttons and drop `role="listbox"`. Gate transform and opacity animations on `prefers-reduced-motion: reduce`.

### P2 — polish

#### P2.1 Dead files on the publish root

**Where.** `script.js` and `src/script.js` are empty (0 bytes) and no HTML file references them. `style.css` (and `src/style.css`) is only a `html` background: a CodePen watermark SVG that reads “Built on CodePen”. No HTML file links `style.css`. Pages therefore does not show the watermark; a CodePen project that treats `style.css` as the CSS panel will.

**Suggested fix.** Drop both files from the kit story, or replace `style.css` with a comment that points at `global.css`, so the publish root is only files the pages load.

#### P2.2 CodePen project config

**Where.** `src/.codepen/pen.config.json` enables two blocks, `fingerprint-1` and `validate-1`, both `version: latest`. The README correctly keeps this directory out of the publish copy. It contains no component markup.

**Suggested fix.** Leave it under `src/` only. If those blocks are not part of how you edit the kit, remove them from the CodePen project so the kit’s behavior does not depend on unnamed remote blocks.

#### P2.3 Embed messaging trusts any origin

**Where.** `component-embed.js` posts `{ type: 'component-kit:resize', file, height }` with target origin `'*'`, and applies `{ type: 'component-kit:theme' }` from any `message` without reading `event.origin`. `index.html` posts the theme with `'*'` as well. The parent does check `event.source` against the iframe window before resizing, so a stranger cannot spoof the height.

**Why it matters.** Same-origin docs use this to size iframes and share the theme, which works. A cross-origin embed (the kit on GitHub Pages inside another host) lets any frame that can reach the window set the theme, and the height message includes the filename.

**Suggested fix.** Pass an explicit origin from the parent and ignore other messages. Keep the `event.source` check.

#### P2.4 Repeated chrome and demo-only noise

**Where.** The same close-icon SVG is inlined in every panel header. The visibility-eye SVG is repeated for every layer row in `map-layers.html`. `.kit-frame { width: 340px; max-width: 100%; }` is copied in four files. Theme toggles are inline `onclick` strings; `color-scale.html` sets `document.documentElement.dataset.theme`, and the other pages set `document.body.parentElement.dataset.theme` to `''` (the attribute remains, the value is not `dark`). The index toggle removes the attribute and stores `component-kit-theme` in `localStorage`; standalone pages do not read it. Color Scale hex captions are 8px. The docs `h1` uses `--text-2xl` (20px). `.chip__remove` is 14×14px.

**Suggested fix.** One icon sprite or a single `<template>` for close and visibility. One `.kit-frame` rule. One theme-toggle snippet that matches the index (remove the attribute, respect stored theme). Raise the smallest scale captions to `--text-xs`. Treat 20px as body-adjacent type, and add a real display step if the docs title should read as a title.

## Architecture notes

**Root versus `src/`.** `src/` is the CodePen-side source tree. The repository root is the GitHub Pages tree (`.nojekyll` is present, so Pages will not ignore underscored paths; there are none that matter). Shared HTML, CSS, and JS are duplicated by hand. On `b8c58d8` that copy is exact. The risk is process, not a current diff. `index.html`’s “single source” claim is true for a different split: the index iframes `place-card.html?embed=1` and does not paste Place Card markup. It is false for the root/`src/` split, which the index never mentions.

**`component-embed.js`.** An IIFE. It no-ops unless the page is framed or `?embed=1` is set. It adds `component-embed` on `<html>`, hides `.theme-toggle` and the direct `.stage__title` / `.stage__label` children, and reports content height to the parent via `postMessage`. A `ResizeObserver` and a subtree `MutationObserver` re-send height, which is why typing in an embedded field can grow the iframe. It also applies a parent theme message by setting or clearing `data-theme` on `<html>`. It does not contain component markup. `global.css` `.component-embed` makes the page background transparent, sets `body { overflow: hidden }`, and changes `.toast-tray` to `position: absolute`. Default iframe height in `index.html` is 240px until the first message; if the script did not run, embed mode would clip at that height.

**`script.js`.** Empty in both trees. Unused.

**`src/.codepen/`.** CodePen project config only. Not published. See P2.2.

**What is actually shared today.** Tokens, reset, `.btn`, `.field` / `.input` / `.select` / `.textarea`, `.panel`, `.icon-btn`, `.swatch`, `.combo`, `.list-row`, `.visibility-toggle`, `.tile`, and the docs shell. Everything else is local to a page.

## Token and color system

Semantic names (`--bg`, `--surface`, `--text`, `--text-2`, `--accent`, `--accent-text`, `--on-accent`, `--success`, `--warn`, `--error`, `--error-text`, `--error-soft`) are the right shape. Focus, shadow, duration, radius, and control size are tokenized and the combo uses them. `--focus-ring` is `0 0 0 3px var(--accent-soft)`, and `--accent-soft` is 12% accent. That ring against the surface is about 1.14:1 (light) and 1.17:1 (dark). Fields that also flip the border to `--accent` are still visible. `.plain-field` in `map-layers.html` drops the outline and relies on that ring plus a `--surface-2` fill, which is a weak indicator. `.slider` relies on nothing.

One-off colors that bypass the tokens:

- `#FF4E4F` in `color-scale.html` (brand list and error borders), beside `--error` `#E5484D`.
- `#00A470` and `#F89B17` as chip swatch fills in `badge.html`, which happen to equal `--success` and `--warn` but are written as hex.
- Picker and hue slider stops in `color-library.html` (`#000`, `#fff`, `#f00`, `#ff0`, `#0f0`, `#0ff`, `#00f`, `#f0f`) are legitimate picker physics; the field fallback `--picker-hue: #2592c2` duplicates `--accent` in a different case.
- Map swatches (`#A9C77B`, `#D9CFC2`, `#F5F0E6`, `#7EC8E3`, `#D8DEE1`, `#C3DDD6`, `#9A1818`, and the library grid) are example paints. Those should stay instance data, not new tokens, as long as the chrome around them uses tokens.
- Overlays: `modal.html` `rgba(17, 20, 22, .45)` and `.docs-overlay` `rgba(17, 20, 22, .38)` hard-code the light `--text` RGB.
- `color-mix(..., black)` in badge and toast warning text (P0.1).

`--text-xs` at 11px is the size used for badges, hints, and nav labels. Anything painted with `--text-2` on `--surface-2`, or with `--success` / `--warn`, is the first thing that fails AA. Prefer `--text` or a dedicated status-text token at that size.

## Component consistency

| Surface | Uses shared atoms | Local one-off |
| --- | --- | --- |
| Button | `.btn` and variants only | Inline alignment on the demo rows |
| Inputs | `.field`, `.input`, `.select`, `.textarea`, `.combo` | Switch track; checkbox row; modal’s email field does not use `.field` or `.input` (inline border, padding, radius in `modal.html`) |
| Place Card | `.panel`, `.icon-btn`, `.field`, `.tile` | `.icon-picker-trigger`, `.icon-edit-panel`, `.state-key`. Behavior for choosing an icon is real |
| Map Layers | `.panel`, `.list-row`, `.swatch`, `.combo`, `.tile`, `.visibility-toggle` | `.upload-btn` (a second button), `.plain-field`, a forked `.tabs__tab`, `.layer-head`, `.subgrid-label`. Visibility toggle behavior is real. Drag, Design tab, and the “Color Library” title are not |
| Color Library | `.panel`, `.combo`, `.swatch`, `.tile`, `.prop-row` | `.color-picker*`, `.slider`, `.search-field`, `.swatch-grid`. Hex/swatch mismatch on the three property rows |
| Color Scale | `.panel`, `.icon-btn`, `.btn` | Entire `.cs-*` system, raw px, second red, random init |
| Badge, toast, tooltip, dropdown, tabs, modal chrome | `.btn`, `.panel`, `.icon-btn` where a header exists | The component itself |

`.combo` is the best atom in the kit: `inputs.html`, `color-library.html`, and `map-layers.html` share the same hex / opacity / width structure and `--control-height-sm`. The specimens disagree about when the width segment appears (Fill in Map Layers, Border in Color Library, both variants on the inputs page) and about whether the swatch matches the hex. Color Scale should be the next consumer of `.swatch`, and it is not.

## Accessibility

**What already holds.** `lang="en"` and a viewport meta are on every page. `:focus-visible` draws a 2px `--accent` outline, and `.input:focus-visible` replaces it with an accent border plus the soft ring. `.icon-btn`, `.tile`, `.swatch`, and `.visibility-toggle` keep a focus outline. The docs shell sets `aria-expanded` on the menu, tree, and section toggles, closes the drawer on Escape, and sets `aria-current="location"` from scroll position. Place Card’s trigger uses `aria-expanded` and `aria-controls`. Layer visibility uses `aria-pressed` and updates the label. Combo inputs have `aria-label`s. Primary text on a white page passes. Light `--accent-text` on white passes (5.65:1).

**What fails.** P0.1 through P0.4. In addition: closed dialogs and menus (P0.3); slider focus removed; hover-only palette delete; placeholder-only map fields; invalid fields without `aria-invalid`; listbox roles without listbox keyboard behavior; tabs without `aria-controls`; no `prefers-reduced-motion`. Tooltip buttons are keyboard-reachable and the tooltip shows on `:focus-within`, which is the right hook, and they still have no name. Touch users get no tooltip on long-press because the show rule is hover and focus.

**Reduced motion.** Absent. The motions to gate are `.btn` transform, menu opacity, modal scale, toast `toast-in`, the docs drawer transform, and Color Scale’s swatch `scaleY` on hover.

## Suggested next workstreams

1. **Tokens that pass AA in both themes.** Retune accent, on-accent, success, warn, error, and border; add status-text tokens; fix link distinction; publish the contrast table in the color section. This removes P0.1 and P0.2 and finishes the dark theme in P1.5.
2. **Widget behavior worth copying.** Dialogs, menus, and toasts (P0.3), then names, focus, and keyboard-operable remove/clear controls (P0.4), then form errors, labels, listboxes, tabs, and reduced motion (P1.8).
3. **One visual language in `global.css`.** Move page-local component CSS into the shared file (P1.2), collapse the forked tabs, search, and icon button (P1.7), and correct the specimens so swatches, titles, and index copy match (P1.4).
4. **Color Scale as a data tool.** Monotonic OKLab ramps, token palette, one error red, `.swatch`, stable seed (P1.3).
5. **Sync and docs.** A root-versus-`src/` equality check (P1.1), index copy that matches the code (P1.6), and removal or isolation of empty `script.js` and the CodePen watermark stylesheet (P2.1).

# Status, focus, and selection

Link `global.css` once. Studio and published Andean Road surfaces use these tokens and classes for error, success, warn, info, keyboard focus, and selection. Do not add a stylesheet that sets a one-off red for an upload banner or a one-off outline for focus.

Both themes define the fills: light on `:root`, dark on `[data-theme="dark"]` (put that attribute on the document element). Washes, alert borders, and the selection pair are `color-mix()` or aliases of those fills, so they follow the active theme. Info is the accent hue. There is no third theme and no second blue.

Ratios are in [`CONTRAST.md`](CONTRAST.md). Fill hexes are unchanged from that table.

## What each token is for

| Token | Use it for | Do not use it for |
| --- | --- | --- |
| `--error`, `--success`, `--warn`, `--info` | Control borders, icons, and the mix that builds soft, wash, and border. `--info` is `--accent`. | Label or body text. `--warn` on white is 2.17:1. `--success` on white is 3.21:1, enough for a non-text icon and short of 4.5:1 for text. |
| `--error-text`, `--success-text`, `--warn-text`, `--info-text` | Labels, alert copy, badge text, field errors, toast icons. | Large filled buttons. Danger and primary buttons use `--on-accent` on the fill. |
| `--error-soft`, `--success-soft`, `--warn-soft`, `--info-soft` | Badge fill. The error alert fill (`--error-soft` is the tuned opaque red, not a mix). | Text color. |
| `--error-wash`, `--success-wash`, `--warn-wash`, `--info-wash` | Large-surface tint. Info, success, and warn alerts use wash. `--error-wash` is 8% error on `--surface` (same weight as `--success-wash`) for a lighter red field. `--error-text` on it is 4.92:1 light and 6.95:1 dark. | A replacement for `--error-soft` on `.alert--error` or `.badge--error`. |
| `--error-border`, `--success-border`, `--warn-border`, `--info-border` | The alert stroke. These are the mixes the banners used to write inline (35% status into `--border`, 40% for warn). | The invalid field stroke. That stays `--error`, which clears 3:1 on `--surface`. `--warn-border` does not clear 3:1 on a light page; the warn label does the work. |
| `--focus-color` | Keyboard-focus hue. Defaults to `--accent`. Set this to recolor focus everywhere the kit draws it. | Selected tiles. Those use `--selected-color`. |
| `--focus-outline` | The `:focus-visible` outline (`2px solid var(--focus-color)`). | Input box-shadows. Those use `--focus-ring`. |
| `--focus-ring` | The 3px halo on text fields, combos, and other controls that hide the outline. | Invalid fields. Those use `--error-ring`. |
| `--error-ring` | Box-shadow when an invalid field is focused. | A resting border. The resting invalid border is `--error`. |
| `--selected-color` | Selected stroke. Defaults to `--accent`. | Focus, unless you want them to be the same color (they start that way). |
| `--selected-ring` | The 1px ring on `.tile--selected`. | Text selection. |
| `--selection-bg` | `::selection` background. This is `--accent-wash`. | Alert backgrounds. |
| `--selection-text` | `::selection` text. This is `--text` (17.11:1 on the wash in light, 15.59:1 in dark). | Link color. |

An info badge is `.badge--accent`. It already paints `--accent-soft` and `--accent-text`, which are `--info-soft` and `--info-text`.

## Classes

### Inline field error

Specimen: `inputs.html`.

```html
<label class="field field--invalid">
  <span class="field__label">Latitude</span>
  <input class="input" type="text" value="200.4" aria-invalid="true" aria-describedby="latitude-error">
  <span class="field__error" id="latitude-error">Must be between -90 and 90.</span>
</label>
```

`.field__error` is `--error-text`. The control border is `--error`. Focus keeps that border and swaps the halo to `--error-ring`.

### Banner, including an upload failure

Specimen: `toast.html` (status row and the upload status alert).

```html
<div class="alert alert--error" role="alert">
  <div class="alert__body">
    <div class="alert__title">Couldn't upload image</div>
    Use a JPG, PNG, or WebP under 8 MB.
  </div>
</div>
```

The same shell with `alert--success`, `alert--warn`, or `alert--info` is the other three banners. Copy is `*-text`. The icon uses `currentColor`, so it is the text color, not the raw fill. A live error that appears after an action gets `role="alert"`. A live success or info note gets `role="status"`.

Color Scale's dropzone already uses the tokens on `.cs-upload.is-err` (`--error` border, `--error-text` copy). A message next to that control is still `.alert--error`, not a new rule.

### Toast

`.toast.toast--error` and `.toast.toast--success`. The icon is `--error-text` or `--success-text`. The toast body stays `--text` on `--surface`. `toast.html` announces through the polite and assertive live regions.

### Focus

Do not set `outline: 2px solid var(--accent)` in a component. The kit's `:focus-visible` rule uses `outline: var(--focus-outline)`. Text inputs, selects, and textareas set `outline: none` and draw `border-color: var(--focus-color)` plus `box-shadow: var(--focus-ring)`.

To recolor focus without forking components:

```css
:root { --focus-color: var(--accent); }
```

`--focus-ring` and `--focus-outline` follow `--focus-color`. Leave `--focus-color` unset when focus should stay accent.

### Selected chrome

`.tile.tile--selected` uses `--selected-color` and `--selected-ring`. A selected swatch uses the same color for its outer ring. Text selection is `::selection` / `::-moz-selection` with `--selection-bg` and `--selection-text`.

## Quick map

| Need | Class | Tokens the class already applies |
| --- | --- | --- |
| Field error | `.field.field--invalid` + `.field__error` | `--error`, `--error-text`, `--error-ring` |
| Upload or other error banner | `.alert.alert--error` | `--error-border`, `--error-soft`, `--error-text` |
| Success / warn / info banner | `.alert.alert--success` / `--warn` / `--info` | `*-border`, `*-wash`, `*-text` |
| Error or success toast | `.toast.toast--error` / `.toast.toast--success` | icon `*-text` |
| Keyboard focus | `:focus-visible` from `global.css` | `--focus-outline`, `--focus-color`, `--focus-ring` |
| Selected tile | `.tile--selected` | `--selected-color`, `--selected-ring` |

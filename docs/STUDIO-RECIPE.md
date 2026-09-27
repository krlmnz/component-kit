# Studio recipe

How [Studio](https://andean-road.com/editor/) (`/editor/`) consumes this kit. Class contracts only. Not a token list.

## Consume

Pin a kit revision. Load the built stylesheet (`global.css`). Style Studio with the classes below. Do not copy specimen pages or their `<style>` blocks.

## Classes

| Contract | Use |
| --- | --- |
| `.alert--error`, `.alert--info`, `.alert--success` | Status banners. |
| `.field`, `.field--invalid`, `.input` | Form controls. Invalid keeps the error border and ring. |
| `.icon-btn` | Compact icon control (28px, 16px glyph). |
| `.icon-btn--touch` | Toolbar mirror (44px, 20px glyph). |

Selection and focus tokens arrive with [#10](https://github.com/krlmnz/component-kit/pull/10): `--focus-color`, `--focus-outline`, `--focus-ring`, `--error-outline`, `--error-ring`, `--selected-color`, `--selected-ring`, `--selection-bg`, `--selection-text`. Use those. Do not add a second focus or selection ramp in Studio.

## Focus scope

Kit `:focus-visible` is for published pages and form controls.

The writing shell inside `#studio` clears frame outlines on the title, the body, and the ProseMirror surface. It keeps error and invalid (`.alert--error`, `.field--invalid`).

Every status or focus change needs an explicit scope note: published page, form control, or `#studio` writing shell.

## Themes

Studio theme ids, one to one: `light`, `night`, `note`, `signal`, `news`, `draft`.

The kit specimen’s `data-theme="dark"` switch is not that list. Do not treat a single kit `dark` as the long-term theme model.

## Stays in Studio

Editor shell information architecture, published article typography, site chrome, and map blocks. Map editor layout is in [`MAP-EDITOR-KIT-MATRIX.md`](MAP-EDITOR-KIT-MATRIX.md).

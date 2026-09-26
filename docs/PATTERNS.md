# Canonical patterns

Link `global.css` once. Badge, chip, switch, tabs, menu, modal, alert, toast, tooltip, color picker, Color Scale (`.cs-*`), Map Layers, and Place Card chrome all live there. A page `<style>` block is for specimen layout that is not part of the system (the Place Card state key, the modal demo column).

## One of each

**Tabs.** `.tabs`, `.tabs__list`, `.tabs__tab`, `.tabs__panel`. Underline is the default; `.tabs--pill` is the alternate. A tab sets `aria-controls` to its panel. `tabs.html` and the Places / Design switch in `map-layers.html` use this markup and the same click behavior. Do not restyle `.tabs__tab` in a page.

**Search.** `.input-group` with `.input-group__icon`, an `.input`, and an optional `.input-group__clear`. There is no `.search-field`.

**Icon buttons.** `.icon-btn` is the icon-only control for panel chrome, toolbars, and tips. Its box is `--icon-btn-size` (`--control-height-xs`, 28px). `.btn--icon` is that same box on the button family when the action needs a border or a fill. `.btn--md` steps up to `--control-height-sm`; `.btn--lg` steps up to `--control-height-md`. Do not set inline width or height.

## Atoms the specimens use

`.combo`, `.swatch`, `.tile` / `.tile-grid`, `.panel`, `.list-row`, `.visibility-toggle`, `.field-label`, `.prop-row`.

Put `.panel--flush` on the `.panel`, not on a wrapper. A combo’s swatch and hex are the same color. A fill combo omits `.combo__width`; a border combo includes it. Do not leave `.combo__width--active` on at rest.

## Left alone on purpose

- Color Scale ramp math stays in `color-scale.html`. Only the `.cs-*` rules moved.
- The Color Library picker is a static anatomy diagram. The field does not write the swatch.
- Map Layers reorders when you drag a handle with a pointer. This reference does not reorder from the keyboard.
- Dialogs are native `<dialog class="modal">` elements. Closed dialogs stay out of the accessibility tree; focus moves in, stays inside, and returns to the opener. Menus hide their panels until opened. Toasts announce through polite and assertive live regions.

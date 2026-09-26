# Canonical patterns

## Icon buttons

`.icon-btn` is the icon-only control. `.btn--icon` is the same idea on the button family when the action needs a border or a fill. Do not invent a `.btn-icon` family, and do not set inline width or height.

**Desktop compact (28/16).** `.icon-btn` is `--control-height-xs` (28px) square. Its glyph is 16×16.

**Touch (44/20).** `.icon-btn--touch` is `--icon-btn-size-touch`, which is `--control-height-touch` (44px) square. Its glyph is `--icon-size-md` (20px). Use this for a toolbar mirror, including Studio’s editor toolbar.

**Border or fill.** `.btn--icon.btn--touch` uses that same 44×44 box and 20×20 glyph. Pair it with `.btn` and a variant such as `.btn--secondary` or `.btn--primary`.

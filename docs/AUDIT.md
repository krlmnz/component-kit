# Component Kit audit

This file is a pointer. It supersedes the older audit that used to live at this path.

That older claim list is historical. It is not a description of current `main`, and it is not a backlog. Do not reopen work from it. The list included P0 contrast failures, unguarded sync between the repository root and `src/`, page-local chrome, and the rest of the ranked findings written against an earlier tree.

Read these instead:

- [`docs/CONTRAST.md`](CONTRAST.md) — contrast ratios for the tokens on `main`
- [`docs/PATTERNS.md`](PATTERNS.md) — shared chrome and the canonical tabs, search, and icon-button patterns

Open pull requests that own token work this note does not touch:

- [#9](https://github.com/krlmnz/component-kit/pull/9) — black primary button
- [#10](https://github.com/krlmnz/component-kit/pull/10) — status, focus, and selection tokens

`script.js` and `style.css` (at the repository root and under `src/`) are gone. The scripts were empty. The stylesheets were only a CodePen watermark, and no HTML file linked them. Pages load `global.css`.

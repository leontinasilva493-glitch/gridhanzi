# GridHanzi interface design

GridHanzi presents a calm, practical writing-tool experience: warm paper, dark ink and a restrained seal-red accent. Preserve the existing typography and task-first layout; the worksheet and its content remain the focus.

## Main-site UI colors

Use the `hs-*` semantic Tailwind colors declared in `src/app/globals.css` for new or edited main-site UI. They preserve existing colors rather than redefining the site's legacy theme variables.

| Token | Value | Purpose |
| --- | --- | --- |
| `hs-ink` | `#17253c` | Navigation and strong UI text |
| `hs-link` | `#24466e` | Links and secondary headings |
| `hs-muted` | `#566276` | Supporting copy |
| `hs-seal` | `#b62822` | Brand emphasis, link hover and active state |
| `hs-paper` | `#fffdf8` | Warm navigation surface |
| `hs-line` | `#ded7ca` | UI dividers and borders |
| `hs-hover` | `#f7f1e7` | Subtle menu hover surface |

Use contextual Tailwind utilities such as `text-hs-link`, `border-hs-line`, and `bg-hs-paper/95`. Reuse the existing `hs-card`, `hs-display`, `hs-kicker`, `hs-primary-button`, and `hs-secondary-button` patterns. Preserve clear keyboard focus, accessible contrast, and touch targets when changing controls.

## Scope and exceptions

- These tokens govern main-site interface elements, not every color in the repository. Add a token when a repeated UI role warrants it, rather than forcing unlike colors together.
- Worksheet paper, tracing, grid lines, print styles and PDF rendering are a separate visual system. Do not replace their colors without print and PDF verification.
- Hanzi Gacha's card rarity, machine and opening animation have a distinct game palette. Keep the learning handoff and rarity cues legible when coordinating shared navigation or surrounding UI.
- Keep desktop navigation visible from 1024 CSS pixels and retain the mobile menu below that width. Test both English and Chinese labels, including the Hanzi Gacha link.
- Check key Chinese UI translations when changing source copy. Brand names, HSK and learning content can intentionally remain unchanged; do not translate vocabulary as interface chrome.
- Compare desktop and mobile screenshots for layout changes. Test worksheet preview and PDF when touching shared controls or paper rendering.

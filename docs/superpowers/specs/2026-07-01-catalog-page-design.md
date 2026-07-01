# Catalog page — design

**Date:** 2026-07-01
**Status:** Approved

## Goal

Add a standalone **Каталог** page with three stacked collection sections, linked from the header/burger nav. Each section reuses the exact design and behaviour of the homepage "Наши букеты" grid (cards, cart, lightbox, reveal). All three collections are CMS-managed. Ships responsive from the start.

## Sections

The catalog page stacks three sections, one above the other, each identical in structure to "Наши букеты" (`eyebrow` + `<h2>` + `.card-grid`):

1. **Моно Букеты** → `content/mono.json`
2. **Сборные букеты** → `content/composed.json`
3. **Композиции в корзинах и коробках** → `content/arrangements.json`

## New / changed files

### New: `catalog.html`
Same shell as `index.html` / `checkout.html`:
- `<header class="site-header">` — brand, `.site-nav` (with the new Каталог link), cart link, burger button, mobile socials.
- `<main>` — three `<section class="section">`, each with `.section__head` (eyebrow + gradient title) and an empty `.card-grid` with a unique id (`#grid-mono`, `#grid-composed`, `#grid-arrangements`).
- Lightbox markup (`#lightbox`), footer, `<meta viewport>`.
- Scripts: `assets/js/cart.js`, `assets/js/catalog-render.js`, plus a small inline bootstrap that (a) sets up scroll-reveal `observeReveal`, (b) calls `FloresCatalog.initLightbox()`, (c) fetches each JSON and renders into its grid.
- **No new CSS** — reuses `.section`, `.card-grid`, `.bouquet-card`, header/footer/nav classes from `main.css`.

### New: `assets/js/catalog-render.js` → `window.FloresCatalog`
Extracted from the inline script in `index.html` (DRY):
- `escHtml(s)` — HTML escaping.
- `bouquetCardHTML(b)` — one card's markup (price + "В корзину" only when `price` is a number; unchanged from current).
- `renderCatalog(grid, data, observeReveal)` — accepts the grid element and the reveal callback as params (decoupled from globals); filters `available !== false`, renders, wires reveal, calls `window.FloresCart.updateUI()` if present. On the fetch-error path the caller shows the existing "Каталог временно недоступен" message.
- `initLightbox()` — the delegated `.bouquet-card__media` → `#lightbox` open/close logic, currently inline in `index.html`.

### Changed: `index.html`
- Replace the inline `escHtml` / `bouquetCardHTML` / `renderCatalog` / lightbox definitions with usage of `window.FloresCatalog` (load `catalog-render.js` before the inline script). The homepage keeps rendering `content/bouquets.json` into `#bouquet-grid`; behaviour unchanged.
- Add `<a href="catalog.html">Каталог</a>` to the (currently empty) `.site-nav`.

### Changed: `checkout.html`
- Add the same `<a href="catalog.html">Каталог</a>` to `.site-nav` (keeping the existing "Вернуться на главную" link).

### New: 3 JSON collections
`content/mono.json`, `content/composed.json`, `content/arrangements.json`, each `{ "items": [ … ] }` with the same schema as `bouquets.json` (`title`, `image`, `price`, `description`, `available`). Seed each with **one** sample item whose `image` points to that section's SVG.

### New: 3 SVG illustrations
`assets/images/catalog-mono.svg`, `catalog-composed.svg`, `catalog-arrangements.svg` — unique decorative floral SVGs in the design-system palette (warm beige / peach / warm text tokens as literal colors), used as the seed card image per section. Motifs: mono = single stem; composed = multi-stem bouquet; arrangements = flowers in a box/basket. Used as CSS `background-image`, so `.svg` files work as-is.

### Changed: `admin/config.yml`
Add three file entries to the existing `catalog` collection, mirroring the `bouquets` entry's fields (`title`, `image`, `price`, `description`, `available`):
- `mono` → `content/mono.json`, label «Моно букеты»
- `composed` → `content/composed.json`, label «Сборные букеты»
- `arrangements` → `content/arrangements.json`, label «Композиции в корзинах и коробках»

## Data flow

`catalog.html` inline bootstrap → `fetch(content/<section>.json)` → `FloresCatalog.renderCatalog(grid, data, observeReveal)` → cards injected → cart + lightbox + reveal wired (shared code). Same path the homepage already uses, now driven by the shared module.

## Error handling

Per grid, on fetch/parse failure show the existing fallback markup ("Каталог временно недоступен — позвоните нам…") inside that grid; other sections still render independently.

## Responsive

Reuses the existing fluid `.card-grid` (`repeat(auto-fit, minmax(...))`) — collapses to one column on mobile. Verify hero of catalog (first section head), the three grids, and nav/burger at ~360px and ~768px. Nav "Каталог" link reachable via burger on mobile.

## Out of scope

- No per-section banner/cover image (mirrors "Наши букеты", which has none).
- No changes to cart, checkout, or order flow.
- No new design tokens or CSS components.

## Open questions

None.

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workflow

- **Do not self-verify in the browser.** Never start a dev/preview server or use browser automation (screenshots, navigation) to check your own changes unless the user explicitly asks. Make the edit and stop — the user reviews visually.

## Project

**Flores** — a static single-page image site (сайт-визитка / landing) for a flower boutique. Plain **HTML + CSS** with a sprinkle of vanilla JS (scroll reveal only). **No framework, no build step.**

Dev server with live reload (the only dev dependency is `live-server`):

```bash
npm install      # once
npm run dev      # http://localhost:3000 — auto-reloads on file changes
```

`npm run dev` watches `index.html`, `assets/`, and `docs/` and refreshes the browser on every save. For a quick no-Node preview you can still just open `index.html` directly, or `python3 -m http.server 3000`.

## Structure

- **`index.html`** — the entire page. One-page landing: hero, sections, footer.
- **`assets/css/main.css`** — design tokens (`:root`), base element styles, and shared component classes. Single source of truth for styling.
- **`docs/design-system.md`** — the visual identity spec (read it before any styling work).
- **`assets/`** — images and other static assets live here.

Keep the page **semantic**: `<header>`, `<nav>`, `<section>`, `<footer>`, `<button>`, `<a>` for their real roles — accessibility comes for free without a framework.

## Design system (important)

**`docs/design-system.md` is the Single Source of Truth** for visual identity — read it before any styling work. Theme: **Soft Beige Bloom** (warm beige + peach background + light glassmorphism panels + gentle warm highlights).

All tokens are CSS custom properties in **`assets/css/main.css`** (linked from `index.html`). Keep `main.css` and `docs/design-system.md` in sync — change both in the same edit.

- **Never hardcode colors, font sizes, spacing, radii, or z-index.** Use tokens: `var(--accent-*)`, `var(--text-*)` (colors *and* type scale), `var(--glass-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--z-*)`.
- **Glassmorphism — the 5 Rules of Glass** (design-system.md §3.3): never nest glass directly in glass (alternate raised glass → cutout well → flat chip); only one `backdrop-filter` per stacking context (outermost shell only); max 2 glass layers deep, then go opaque (`--surface-solid`); borders are glare not frames; follow the depth ramp L0→L4.
- **Glass over photos/complex backgrounds** (design-system.md §3.5): default `.glass-panel` is tuned for the flat beige gradient and washes out images. On a surface sitting over a photo or busy background, add **`.glass-panel--photo`** (lower-opacity tint `--glass-bg-photo` + lighter blur `--glass-blur-photo`) so the image reads through. The washout is driven by fill opacity, not blur — fix legibility with tint, not by maxing blur.
- This is a **light-glass** theme: dark warm text on frosted-cream surfaces over a beige base. Keep text legible with `--text-primary` / `--text-secondary`.
- Always write both `-webkit-backdrop-filter` and `backdrop-filter` (Safari ≤17).
- `rem` for typography & large layout spacing; `px` for border radii & widths.

## Styling

- **One stylesheet of record:** `assets/css/main.css`. Style with semantic class names (`.hero`, `.bouquet-card`, `.glass-panel`).
- **No inline styles** except for dynamically computed values (e.g. a card's background image URL).
- **Reuse before re-inventing:** prefer shared component classes (`.glass-panel`, `.btn`, field styles) over one-off CSS per block.
- All styles must align with `docs/design-system.md` and use the tokens from `main.css` — never hardcode raw colors/sizes.

### CSS vendor prefixes

Never add `-webkit-` prefixes for properties that are fully standard — they add noise and trigger deprecation warnings in Chrome DevTools.

- **Drop entirely (no prefix needed in any modern browser):** `transform`, `transition`, `animation`/`@keyframes`, `border-radius`, `box-shadow`, `flex`/flexbox, `grid`, `user-select`, `background-size`, `calc()`, `linear-gradient`/`radial-gradient`, `columns`.
- **Keep BOTH prefixed + unprefixed:** `backdrop-filter` (Safari ≤17 still needs `-webkit-backdrop-filter` — write both until ~2026) and `appearance` (reliable form-control resets on iOS Safari).
- **`-webkit-` only (no standard equivalent, keep as-is):** `-webkit-text-stroke`, `-webkit-text-fill-color`, `-webkit-tap-highlight-color`, `-webkit-touch-callout`.

## Responsive (mobile-first, always)

**Every block ships responsive from the start — never desktop-only.** When building or changing any section, lay it out so it works on phones and tablets in the same edit, not as a later pass.

- **Breakpoints:** target three ranges — **mobile** (`≤640px`), **tablet** (`641–1024px`), **desktop** (`>1024px`). Use `min-width` media queries (mobile-first); add tablet/desktop refinements on top of a base that already works narrow.
- **Fluid by default:** prefer fluid grids/flex (`repeat(auto-fit, minmax(...))`), `max-width` + `%`, and `clamp()` for large display type so layouts adapt without many breakpoints. Reach for media queries only where the fluid version breaks.
- **Test narrow first:** verify the hero, nav, card grids, and the contact block at ~360px and ~768px before considering a section done. Cards collapse to one column, nav stays reachable, nothing overflows horizontally.
- **Touch targets:** interactive elements (`.btn`, nav links) keep a comfortable tap size (~44px min height) on mobile.
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` is already in `index.html` — keep it.

## Typography & fonts

Three typefaces via Google Fonts (`<link>` in `index.html` `<head>`): **Manrope** (body, `--font-body`), **Fraunces** (serif display headings `h2`/`h3`, `--font-display`), and **Marck Script** (handwritten accent — hero `h1` + logo, `--font-script`). Use the type-scale tokens (`--text-xs`…`--text-3xl`), never raw `font-size` values.

## JavaScript

Minimal. The only script is a small `IntersectionObserver` that toggles `.is-visible` on `.reveal` sections for the scroll-in animation (design-system.md §12). Guard motion with `prefers-reduced-motion`. Don't pull in libraries or a bundler for a one-page static site.

## Backend (orders) & Deployment

The site is static, but checkout posts orders to a tiny PHP endpoint. **Full details: `docs/deploy.md` — read it before touching deploy or order flow.**

- **Backend = one file:** `api/order.php` — accepts `POST /api/order.php` (JSON) from `checkout.html`/`cart.js` and forwards the order to **Telegram** (Bot API). **No database** — MySQL is not used. cURL with a stream fallback (some hosts disable cURL).
- **Secrets:** Telegram bot token + chat id live in **`api/config.php`** (committed — the repo is **private**). `api/config.sample.php` is the template. `order.php` also reads `getenv()` as a fallback.
- **Hosting model:** classic **PHP + FTP** (target: **hoster.by**). Deploy is automated via GitHub Actions (`.github/workflows/deploy.yml`) on push to `master`/`main` — it FTP-syncs the working tree to the host (FTP creds from GitHub Secrets, `server-dir: ./public_html/`).
  - **Host requirement:** the host must allow **outbound connections** to `api.telegram.org` — many free PHP hosts block this, so `order.php` can't deliver orders there. Test the order flow locally with `php -S localhost:8000` before relying on a host.
- **CMS auth is unrelated to hosting:** the `*.workers.dev` URL in `admin/config.yml` is only the Sveltia CMS OAuth proxy on Cloudflare — it does **not** handle orders.
- **Security note:** because secrets sit in a private repo's git history, treat the stand's token/FTP as throwaway; use a separate test bot and rotate everything when moving to prod.

## Conventions

- Default UI language for copy: decide per content; keep the page a single `index.html`.
- Vendored fonts via CDN `<link>`; keep external dependencies to a minimum (ideally just Google Fonts).

### Currency Symbol
* Use the plain-text `Br` symbol for the Belarusian ruble, written inline right after the amount (e.g. `95 Br`).
* For plain-text contexts (e.g. form submissions, emails), `BYN` is also acceptable.
* Do not use the `<span class="byn-icon">` / `.ruble-by` glyph approach — it has been retired.

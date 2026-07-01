# Catalog Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `catalog.html` page with three CMS-managed collection sections stacked vertically, reusing the homepage "Наши букеты" card grid design and behaviour.

**Architecture:** Extract the homepage's inline card-render + lightbox JS into a shared `assets/js/catalog-render.js` module (`window.FloresCatalog`), then reuse it on both `index.html` (1 grid) and the new `catalog.html` (3 grids fed by 3 JSON files). No new CSS — reuse existing `main.css` classes. Three decorative SVGs seed one sample card per section.

**Tech Stack:** Plain HTML + CSS + vanilla JS. No framework, no build step. Sveltia CMS via `admin/config.yml`. Data as static JSON in `content/`.

## Global Constraints

- **No framework, no build step.** Plain HTML/CSS/vanilla JS only.
- **No new CSS / no new design tokens.** Reuse existing classes (`.section`, `.card-grid`, `.bouquet-card`, header/nav/footer) and tokens in `assets/css/main.css`.
- **No inline styles** except dynamically computed values (card `background-image` URL — matches existing pattern).
- **Do NOT self-verify in the browser** (CLAUDE.md). Verification = static checks (`node -c`, `python3 -m json.tool`, grep). Visual review is the user's.
- **Currency:** plain-text `Br` after the amount (e.g. `95 Br`). No `.byn-icon` glyph.
- **Mobile-first responsive** from the start; reuse the fluid `.card-grid`.
- **Commit** after every task.

---

### Task 1: Extract shared render + lightbox module; refactor `index.html`

Pull the inline `escHtml` / `bouquetCardHTML` / `renderCatalog` / lightbox logic out of `index.html` into a reusable module, then switch the homepage to it. Homepage behaviour must stay identical.

**Files:**
- Create: `assets/js/catalog-render.js`
- Modify: `index.html` (script include ~460; render block 523-567; lightbox block 506-521, 569-574; nav 30-31)

**Interfaces:**
- Produces `window.FloresCatalog`:
  - `escHtml(s: any) -> string`
  - `bouquetCardHTML(b: {title,image,price,description}) -> string`
  - `renderCatalog(grid: HTMLElement, data: object|array, observeReveal: (el:Element)=>void) -> void`
  - `initLightbox() -> void`

- [ ] **Step 1: Create `assets/js/catalog-render.js`**

```javascript
// Flores — общий рендер карточек каталога + лайтбокс.
// Один источник правды: используется на index.html (сетка «Наши букеты»)
// и catalog.html (три сетки разделов).
(function (global) {
  'use strict';

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function bouquetCardHTML(b) {
    var hasPrice = typeof b.price === 'number';
    var price = hasPrice
      ? '<span class="bouquet-card__price">' + b.price + ' Br</span>' : '';
    var addBtn = hasPrice
      ? '<button type="button" class="btn btn--primary bouquet-card__add" data-name="' +
        escHtml(b.title) + '" data-price="' + b.price + '" data-image="' +
        encodeURI(b.image || '') + '">В корзину</button>'
      : '';
    return '' +
      '<article class="bouquet-card reveal">' +
        '<div class="bouquet-card__media" style="background-image: url(\'' +
          encodeURI(b.image || '') + '\');"></div>' +
        '<div class="bouquet-card__body">' +
          '<h3>' + escHtml(b.title) + '</h3>' +
          '<p>' + escHtml(b.description) + '</p>' +
          price + addBtn +
        '</div>' +
      '</article>';
  }

  // grid — целевая .card-grid; observeReveal — функция подписки на scroll-reveal.
  function renderCatalog(grid, data, observeReveal) {
    var all = Array.isArray(data) ? data : (data && data.items ? data.items : []);
    var visible = all.filter(function (b) { return b.available !== false; });
    grid.innerHTML = visible.map(bouquetCardHTML).join('');
    if (typeof observeReveal === 'function') {
      grid.querySelectorAll('.reveal').forEach(observeReveal);
    }
    if (global.FloresCart) global.FloresCart.updateUI();
  }

  // Лайтбокс через делегирование — работает и для динамических карточек.
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var lightboxImg = document.getElementById('lightbox-img');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var overlay = lightbox.querySelector('.lightbox__overlay');

    document.addEventListener('click', function (e) {
      var media = e.target.closest('.bouquet-card__media');
      if (!media) return;
      var m = media.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (m && m[1]) {
        lightboxImg.src = m[1];
        lightbox.classList.add('is-open');
      }
    });

    function close() { lightbox.classList.remove('is-open'); }
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  }

  global.FloresCatalog = {
    escHtml: escHtml,
    bouquetCardHTML: bouquetCardHTML,
    renderCatalog: renderCatalog,
    initLightbox: initLightbox
  };
})(window);
```

- [ ] **Step 2: Verify JS parses**

Run: `node -c assets/js/catalog-render.js && echo OK`
Expected: `OK`

- [ ] **Step 3: Add the script include in `index.html`**

Find (currently line ~460):
```html
    <script src="assets/js/cart.js"></script>
    <!-- Scroll reveal (the page's only JS — design-system.md §12) -->
```
Replace with (add `catalog-render.js` after `cart.js`):
```html
    <script src="assets/js/cart.js"></script>
    <script src="assets/js/catalog-render.js"></script>
    <!-- Scroll reveal (the page's only JS — design-system.md §12) -->
```

- [ ] **Step 4: Replace the inline lightbox block in `index.html`**

Find (lines ~506-521):
```javascript
      // Lightbox Logic
      const lightbox = document.getElementById('lightbox');
      const lightboxImg = document.getElementById('lightbox-img');
      const closeBtn = document.querySelector('.lightbox__close');
      const overlay = document.querySelector('.lightbox__overlay');

      // Лайтбокс через делегирование — работает и для динамических карточек
      document.addEventListener('click', function (e) {
        const media = e.target.closest('.bouquet-card__media');
        if (!media) return;
        const urlMatch = media.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
        if (urlMatch && urlMatch[1]) {
          lightboxImg.src = urlMatch[1];
          lightbox.classList.add('is-open');
        }
      });
```
Replace with:
```javascript
      // Lightbox — общий модуль (assets/js/catalog-render.js)
      FloresCatalog.initLightbox();
```

- [ ] **Step 5: Replace the inline render block in `index.html`**

Find (lines ~523-567):
```javascript
      // Каталог букетов из content/bouquets.json -------------------------
      const bouquetGrid = document.getElementById('bouquet-grid');

      function escHtml(s) {
        return String(s == null ? '' : s)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      }

      function bouquetCardHTML(b) {
        const hasPrice = typeof b.price === 'number';
        const price = hasPrice
          ? `<span class="bouquet-card__price">${b.price} Br</span>` : '';
        const addBtn = hasPrice
          ? `<button type="button" class="btn btn--primary bouquet-card__add" data-name="${escHtml(b.title)}" data-price="${b.price}" data-image="${encodeURI(b.image || '')}">В корзину</button>`
          : '';
        return `
            <article class="bouquet-card reveal">
              <div class="bouquet-card__media" style="background-image: url('${encodeURI(b.image || '')}');"></div>
              <div class="bouquet-card__body">
                <h3>${escHtml(b.title)}</h3>
                <p>${escHtml(b.description)}</p>
                ${price}
                ${addBtn}
              </div>
            </article>`;
      }

      function renderCatalog(data) {
        const all = Array.isArray(data) ? data : (data.items || []);
        const visible = all.filter((b) => b.available !== false);
        bouquetGrid.innerHTML = visible.map(bouquetCardHTML).join('');
        bouquetGrid.querySelectorAll('.reveal').forEach(observeReveal);
        if (window.FloresCart) window.FloresCart.updateUI();
      }

      if (bouquetGrid) {
        fetch('content/bouquets.json')
          .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(renderCatalog)
          .catch(() => {
            bouquetGrid.innerHTML =
              '<p class="bouquet-card__body">Каталог временно недоступен — позвоните нам, и мы соберём букет под вас.</p>';
          });
      }
```
Replace with:
```javascript
      // Каталог букетов из content/bouquets.json — общий модуль FloresCatalog.
      const bouquetGrid = document.getElementById('bouquet-grid');
      if (bouquetGrid) {
        fetch('content/bouquets.json')
          .then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then((data) => FloresCatalog.renderCatalog(bouquetGrid, data, observeReveal))
          .catch(() => {
            bouquetGrid.innerHTML =
              '<p class="bouquet-card__body">Каталог временно недоступен — позвоните нам, и мы соберём букет под вас.</p>';
          });
      }
```

- [ ] **Step 6: Remove the now-orphaned `closeLightbox` wiring in `index.html`**

Find (lines ~569-574, now after the render block):
```javascript
      function closeLightbox() {
        lightbox.classList.remove('is-open');
      }

      closeBtn.addEventListener('click', closeLightbox);
      overlay.addEventListener('click', closeLightbox);
```
Delete these lines entirely (lightbox close is now handled inside `FloresCatalog.initLightbox()`).

- [ ] **Step 7: Add the "Каталог" nav link in `index.html`**

Find (lines ~30-31):
```html
          <nav class="site-nav" aria-label="Основная навигация">
          </nav>
```
Replace with:
```html
          <nav class="site-nav" aria-label="Основная навигация">
            <a href="catalog.html">Каталог</a>
          </nav>
```

- [ ] **Step 8: Verify no orphaned references remain**

Run: `grep -nE "closeLightbox|function bouquetCardHTML|function renderCatalog|function escHtml" index.html; echo "exit=$?"`
Expected: `exit=1` (no matches — all moved to the module).

- [ ] **Step 9: Commit**

```bash
git add assets/js/catalog-render.js index.html
git commit -m "Extract catalog render + lightbox into shared FloresCatalog module"
```

---

### Task 2: Three decorative SVG illustrations

Create one unique floral SVG per section, in the design-system palette, used as the seed card image. Viewport 800×600 so they read well as `.bouquet-card__media` background covers.

**Files:**
- Create: `assets/images/catalog-mono.svg`
- Create: `assets/images/catalog-composed.svg`
- Create: `assets/images/catalog-arrangements.svg`

**Palette (literal hex from tokens):** bg `#f7efe6`→`#eedbc8`, accent `#cf9a73`/`#e0b49a`, gold `#c8a36a`, stem green `#7fae6f`, stroke `#4a3a30`.

- [ ] **Step 1: Create `assets/images/catalog-mono.svg` (single stem)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="Моно букет — один цветок">
  <defs>
    <linearGradient id="bgMono" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7efe6"/>
      <stop offset="1" stop-color="#eedbc8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgMono)"/>
  <g fill="none" stroke="#7fae6f" stroke-width="6" stroke-linecap="round">
    <path d="M400 560 C398 460 402 380 400 300"/>
    <path d="M400 430 C360 410 340 380 336 344"/>
    <path d="M400 400 C440 384 462 356 468 322"/>
  </g>
  <g stroke="#4a3a30" stroke-width="3">
    <ellipse cx="336" cy="344" rx="26" ry="12" transform="rotate(-30 336 344)" fill="#7fae6f" opacity="0.5"/>
    <ellipse cx="468" cy="322" rx="26" ry="12" transform="rotate(30 468 322)" fill="#7fae6f" opacity="0.5"/>
  </g>
  <g transform="translate(400 250)" stroke="#4a3a30" stroke-width="3">
    <circle r="34" fill="#c8a36a"/>
    <g fill="#e0b49a">
      <ellipse cx="0" cy="-70" rx="30" ry="52"/>
      <ellipse cx="0" cy="70" rx="30" ry="52"/>
      <ellipse cx="-70" cy="0" rx="52" ry="30"/>
      <ellipse cx="70" cy="0" rx="52" ry="30"/>
    </g>
    <g fill="#cf9a73">
      <ellipse cx="-50" cy="-50" rx="30" ry="48" transform="rotate(-45 -50 -50)"/>
      <ellipse cx="50" cy="-50" rx="30" ry="48" transform="rotate(45 50 -50)"/>
      <ellipse cx="-50" cy="50" rx="30" ry="48" transform="rotate(45 -50 50)"/>
      <ellipse cx="50" cy="50" rx="30" ry="48" transform="rotate(-45 50 50)"/>
    </g>
    <circle r="34" fill="#c8a36a"/>
  </g>
</svg>
```

- [ ] **Step 2: Create `assets/images/catalog-composed.svg` (multi-stem bouquet)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="Сборный букет — несколько цветов">
  <defs>
    <linearGradient id="bgComposed" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7efe6"/>
      <stop offset="1" stop-color="#eedbc8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgComposed)"/>
  <g fill="none" stroke="#7fae6f" stroke-width="6" stroke-linecap="round">
    <path d="M400 560 C300 470 250 380 250 280"/>
    <path d="M400 560 C400 460 400 380 400 260"/>
    <path d="M400 560 C500 470 550 380 550 280"/>
  </g>
  <path d="M330 540 L470 540 L440 585 L360 585 Z" fill="#e0b49a" stroke="#4a3a30" stroke-width="3"/>
  <g stroke="#4a3a30" stroke-width="3">
    <g transform="translate(250 260)">
      <circle r="24" fill="#cf9a73"/>
      <g fill="#e0b49a"><circle cx="0" cy="-40" r="20"/><circle cx="38" cy="-12" r="20"/><circle cx="24" cy="32" r="20"/><circle cx="-24" cy="32" r="20"/><circle cx="-38" cy="-12" r="20"/></g>
      <circle r="20" fill="#c8a36a"/>
    </g>
    <g transform="translate(400 240)">
      <circle r="28" fill="#c8a36a"/>
      <g fill="#cf9a73"><circle cx="0" cy="-46" r="22"/><circle cx="44" cy="-14" r="22"/><circle cx="27" cy="37" r="22"/><circle cx="-27" cy="37" r="22"/><circle cx="-44" cy="-14" r="22"/></g>
      <circle r="22" fill="#e0b49a"/>
    </g>
    <g transform="translate(550 260)">
      <circle r="24" fill="#cf9a73"/>
      <g fill="#e0b49a"><circle cx="0" cy="-40" r="20"/><circle cx="38" cy="-12" r="20"/><circle cx="24" cy="32" r="20"/><circle cx="-24" cy="32" r="20"/><circle cx="-38" cy="-12" r="20"/></g>
      <circle r="20" fill="#c8a36a"/>
    </g>
  </g>
</svg>
```

- [ ] **Step 3: Create `assets/images/catalog-arrangements.svg` (flowers in a box)**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img" aria-label="Композиция в коробке">
  <defs>
    <linearGradient id="bgArr" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f7efe6"/>
      <stop offset="1" stop-color="#eedbc8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bgArr)"/>
  <g stroke="#4a3a30" stroke-width="3">
    <g fill="#cf9a73">
      <circle cx="300" cy="300" r="46"/>
      <circle cx="400" cy="270" r="52"/>
      <circle cx="500" cy="300" r="46"/>
      <circle cx="350" cy="340" r="40"/>
      <circle cx="450" cy="340" r="40"/>
    </g>
    <g fill="#e0b49a">
      <circle cx="300" cy="300" r="22"/>
      <circle cx="400" cy="270" r="26"/>
      <circle cx="500" cy="300" r="22"/>
      <circle cx="350" cy="340" r="18"/>
      <circle cx="450" cy="340" r="18"/>
    </g>
    <g fill="none" stroke="#7fae6f" stroke-width="5" stroke-linecap="round">
      <path d="M260 360 C230 340 220 320 224 300"/>
      <path d="M540 360 C570 340 580 320 576 300"/>
    </g>
  </g>
  <g stroke="#4a3a30" stroke-width="4" fill="#c8a36a">
    <path d="M250 380 L550 380 L560 500 L240 500 Z"/>
    <path d="M240 380 L560 380 L560 410 L240 410 Z" fill="#d8b87f"/>
  </g>
</svg>
```

- [ ] **Step 4: Verify all three are well-formed XML**

Run: `for f in mono composed arrangements; do python3 -c "import xml.dom.minidom,sys; xml.dom.minidom.parse('assets/images/catalog-'+'$f'+'.svg')" && echo "$f OK"; done`
Expected: three `OK` lines.

- [ ] **Step 5: Commit**

```bash
git add assets/images/catalog-mono.svg assets/images/catalog-composed.svg assets/images/catalog-arrangements.svg
git commit -m "Add three catalog section illustrations (SVG)"
```

---

### Task 3: Three JSON collections

Seed each section with one sample item pointing to its SVG. Same schema as `content/bouquets.json`.

**Files:**
- Create: `content/mono.json`
- Create: `content/composed.json`
- Create: `content/arrangements.json`

- [ ] **Step 1: Create `content/mono.json`**

```json
{
  "items": [
    {
      "title": "Моно роза",
      "image": "assets/images/catalog-mono.svg",
      "price": 45,
      "description": "Один крупный цветок в авторской упаковке — лаконично и выразительно.",
      "available": true
    }
  ]
}
```

- [ ] **Step 2: Create `content/composed.json`**

```json
{
  "items": [
    {
      "title": "Сборный пастельный",
      "image": "assets/images/catalog-composed.svg",
      "price": 120,
      "description": "Несколько сортов в мягкой пастельной гамме, собрано вручную.",
      "available": true
    }
  ]
}
```

- [ ] **Step 3: Create `content/arrangements.json`**

```json
{
  "items": [
    {
      "title": "Композиция в коробке",
      "image": "assets/images/catalog-arrangements.svg",
      "price": 160,
      "description": "Цветы в шляпной коробке с флористической губкой — стоит без вазы.",
      "available": true
    }
  ]
}
```

- [ ] **Step 4: Verify all three are valid JSON**

Run: `for f in mono composed arrangements; do python3 -m json.tool "content/$f.json" > /dev/null && echo "$f OK"; done`
Expected: three `OK` lines.

- [ ] **Step 5: Commit**

```bash
git add content/mono.json content/composed.json content/arrangements.json
git commit -m "Add seed JSON for three catalog collections"
```

---

### Task 4: Create `catalog.html`

The new page: same header/footer/lightbox shell as `index.html`, three stacked sections, inline bootstrap that renders each JSON via `FloresCatalog`.

**Files:**
- Create: `catalog.html`

**Interfaces:**
- Consumes `window.FloresCatalog.renderCatalog` / `initLightbox` (Task 1), `window.FloresCart` (existing `cart.js`), and `content/{mono,composed,arrangements}.json` (Task 3).

- [ ] **Step 1: Create `catalog.html`**

Copy the `<head>` (fonts + `main.css` + viewport + favicon), `<header>`, footer, and lightbox markup from `index.html` verbatim so the shell matches. Use this exact structure for the body:

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Каталог — Flores</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Manrope:wght@400;500;600;700&family=Marck+Script&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="assets/css/main.css" />
  </head>
  <body>
    <!-- Header — copy verbatim from index.html <header>…</header>,
         its .site-nav already contains <a href="catalog.html">Каталог</a> -->
    <header class="site-header">
      <div class="container">
        <a class="brand" href="index.html">Flores</a>
        <div class="header-right">
          <nav class="site-nav" aria-label="Основная навигация">
            <a href="catalog.html">Каталог</a>
          </nav>
          <div class="social-links mobile-socials">
            <a href="#" class="social-link" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="#" class="social-link" aria-label="Telegram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"></path><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></a>
            <a href="tel:+375445115517" class="social-link" aria-label="Телефон"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></a>
          </div>
        </div>
        <div class="header-controls">
          <a class="social-link cart-link" href="checkout.html" aria-label="Корзина">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span class="cart-badge" hidden>0</span>
          </a>
          <button class="burger-btn" aria-label="Открыть меню"><span></span><span></span><span></span></button>
        </div>
      </div>
    </header>

    <main>
      <section class="section" id="mono">
        <div class="container">
          <div class="section__head reveal">
            <span class="eyebrow">Каталог</span>
            <h2 class="gradient-title">Моно букеты</h2>
          </div>
          <div class="card-grid" id="grid-mono"></div>
        </div>
      </section>

      <section class="section" id="composed">
        <div class="container">
          <div class="section__head reveal">
            <span class="eyebrow">Каталог</span>
            <h2 class="gradient-title">Сборные букеты</h2>
          </div>
          <div class="card-grid" id="grid-composed"></div>
        </div>
      </section>

      <section class="section" id="arrangements">
        <div class="container">
          <div class="section__head reveal">
            <span class="eyebrow">Каталог</span>
            <h2 class="gradient-title">Композиции в корзинах и коробках</h2>
          </div>
          <div class="card-grid" id="grid-arrangements"></div>
        </div>
      </section>
    </main>

    <!-- Footer — copy verbatim from index.html <footer>…</footer> -->

    <!-- Lightbox — copy verbatim from index.html #lightbox markup -->
    <div class="lightbox" id="lightbox">
      <div class="lightbox__overlay"></div>
      <button class="lightbox__close" aria-label="Закрыть">&times;</button>
      <img class="lightbox__img" id="lightbox-img" src="" alt="" />
    </div>

    <script src="assets/js/cart.js"></script>
    <script src="assets/js/catalog-render.js"></script>
    <script>
      // Scroll reveal (same as index.html — design-system.md §12)
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const revealObserver = prefersReduced ? null : new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });

      function observeReveal(el) {
        if (revealObserver) revealObserver.observe(el);
        else el.classList.add("is-visible");
      }
      document.querySelectorAll(".reveal").forEach(observeReveal);

      FloresCatalog.initLightbox();

      // Три раздела каталога → три JSON → общий рендер.
      [
        { grid: 'grid-mono', src: 'content/mono.json' },
        { grid: 'grid-composed', src: 'content/composed.json' },
        { grid: 'grid-arrangements', src: 'content/arrangements.json' }
      ].forEach(function (sec) {
        var grid = document.getElementById(sec.grid);
        if (!grid) return;
        fetch(sec.src)
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (data) { FloresCatalog.renderCatalog(grid, data, observeReveal); })
          .catch(function () {
            grid.innerHTML =
              '<p class="bouquet-card__body">Раздел временно недоступен — позвоните нам, и мы соберём букет под вас.</p>';
          });
      });

      // Бургер-меню — та же логика, что на других страницах.
      const burgerBtn = document.querySelector('.burger-btn');
      const headerRight = document.querySelector('.header-right');
      if (burgerBtn && headerRight) {
        burgerBtn.addEventListener('click', () => {
          document.body.classList.toggle('menu-open');
          burgerBtn.classList.toggle('is-active');
          headerRight.classList.toggle('is-active');
        });
      }
    </script>
  </body>
</html>
```

Note: when creating the file, replace the two "copy verbatim" comments (footer and — if the real header differs — header/favicon/preload lines) with the exact markup from `index.html` so the shell is identical. Confirm the burger toggle classes match `checkout.html:508-520` (`menu-open`, `is-active`).

- [ ] **Step 2: Verify structure**

Run: `grep -c 'card-grid' catalog.html; grep -o 'id="grid-[a-z]*"' catalog.html`
Expected: `3` grids, ids `grid-mono` / `grid-composed` / `grid-arrangements`.

- [ ] **Step 3: Verify script wiring & burger classes**

Run: `grep -n "catalog-render.js\|FloresCatalog.initLightbox\|menu-open\|is-active" catalog.html`
Expected: shows the module include, `initLightbox()` call, and burger toggle classes matching `checkout.html`.

- [ ] **Step 4: Commit**

```bash
git add catalog.html
git commit -m "Add catalog page with three stacked collection sections"
```

---

### Task 5: Add "Каталог" nav link to `checkout.html`

**Files:**
- Modify: `checkout.html:26-27`

- [ ] **Step 1: Add the link**

Find (lines ~26-27):
```html
          <nav class="site-nav" aria-label="Основная навигация">
            <a href="index.html">Вернуться на главную</a>
```
Replace with:
```html
          <nav class="site-nav" aria-label="Основная навигация">
            <a href="catalog.html">Каталог</a>
            <a href="index.html">Вернуться на главную</a>
```

- [ ] **Step 2: Verify**

Run: `grep -n 'href="catalog.html"' checkout.html`
Expected: one match inside `.site-nav`.

- [ ] **Step 3: Commit**

```bash
git add checkout.html
git commit -m "Add Каталог nav link to checkout header"
```

---

### Task 6: Register three collections in Sveltia CMS

Add three file entries to the existing `catalog` collection, mirroring the `bouquets` field schema.

**Files:**
- Modify: `admin/config.yml` (append to `collections[0].files`)

- [ ] **Step 1: Add the three file entries**

Find the end of the existing `bouquets` file entry:
```yaml
              - { name: available, label: Показывать на сайте, widget: boolean, default: true }
```
Append immediately after it (same indentation as the `- name: bouquets` entry, i.e. 6 spaces before `-`):
```yaml
      - name: mono
        label: Моно букеты
        file: content/mono.json
        fields:
          - name: items
            label: Моно букеты
            label_singular: Букет
            widget: list
            summary: '{{fields.title}} — {{fields.price}} Br'
            fields:
              - { name: title, label: Название, widget: string }
              - { name: image, label: Фото, widget: image }
              - { name: price, label: 'Цена (Br)', widget: number, value_type: int, min: 0 }
              - { name: description, label: Описание, widget: text }
              - { name: available, label: Показывать на сайте, widget: boolean, default: true }
      - name: composed
        label: Сборные букеты
        file: content/composed.json
        fields:
          - name: items
            label: Сборные букеты
            label_singular: Букет
            widget: list
            summary: '{{fields.title}} — {{fields.price}} Br'
            fields:
              - { name: title, label: Название, widget: string }
              - { name: image, label: Фото, widget: image }
              - { name: price, label: 'Цена (Br)', widget: number, value_type: int, min: 0 }
              - { name: description, label: Описание, widget: text }
              - { name: available, label: Показывать на сайте, widget: boolean, default: true }
      - name: arrangements
        label: Композиции в корзинах и коробках
        file: content/arrangements.json
        fields:
          - name: items
            label: Композиции
            label_singular: Композиция
            widget: list
            summary: '{{fields.title}} — {{fields.price}} Br'
            fields:
              - { name: title, label: Название, widget: string }
              - { name: image, label: Фото, widget: image }
              - { name: price, label: 'Цена (Br)', widget: number, value_type: int, min: 0 }
              - { name: description, label: Описание, widget: text }
              - { name: available, label: Показывать на сайте, widget: boolean, default: true }
```

- [ ] **Step 2: Verify YAML parses and lists 4 files**

Run: `python3 -c "import yaml; d=yaml.safe_load(open('admin/config.yml')); print([f['name'] for f in d['collections'][0]['files']])"`
Expected: `['bouquets', 'mono', 'composed', 'arrangements']`
(If PyYAML is missing: `pip install pyyaml` or inspect the file manually — indentation must match the `bouquets` entry exactly.)

- [ ] **Step 3: Commit**

```bash
git add admin/config.yml
git commit -m "Register mono/composed/arrangements collections in CMS"
```

---

## Self-Review

**Spec coverage:**
- New `catalog.html` with 3 stacked sections → Task 4. ✓
- Sections Моно/Сборные/Композиции + 3 JSON → Tasks 3, 4. ✓
- Nav link in header + burger (index, checkout, catalog) → Tasks 1 (index), 4 (catalog), 5 (checkout). ✓
- Shared render module (DRY) → Task 1. ✓
- 3 unique SVG images → Task 2. ✓
- CMS management of 3 collections → Task 6. ✓
- No new CSS, reuse classes → all tasks (no `.css` edits). ✓
- Error handling per grid → Task 4 (per-section catch). ✓
- Responsive via fluid `.card-grid` → reused, no changes needed. ✓

**Placeholder scan:** The two "copy verbatim from index.html" notes in Task 4 (footer + header/favicon) are explicit instructions to duplicate existing exact markup, not TODOs — the body/section/script content is fully specified. No other placeholders.

**Type consistency:** `FloresCatalog.renderCatalog(grid, data, observeReveal)` and `initLightbox()` signatures match between Task 1 (definition), Task 1 Step 5 (index usage), and Task 4 (catalog usage). `observeReveal` defined in both index (existing) and catalog (Task 4 bootstrap). JSON schema (`title/image/price/description/available`) consistent across Tasks 3 and 6.

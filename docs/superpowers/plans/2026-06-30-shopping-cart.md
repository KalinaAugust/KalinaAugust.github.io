# Корзина и оформление заказа — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Дать посетителю набирать букеты из каталога в корзину и оформлять заказ через Formspree, заменив старую форму заказа; всё по правилам проекта (классы в main.css, без inline-стилей).

**Architecture:** Общее cart-ядро выносится в новый `assets/js/cart.js` (localStorage, ключ `cart`, элементы `{name, price, quantity}`), подключается на обе версии главной и на checkout. Карточки получают кнопку «В корзину» (делегирование по `.bouquet-card__add` + `data-*`). Шапка получает `.cart-badge`. `checkout.html` переписывается на классы main.css и шлёт заказ AJAX-ом в Formspree. Старая секция формы `#order` удаляется на обеих версиях.

**Tech Stack:** Plain HTML/CSS/vanilla JS, no build step. localStorage. Formspree (AJAX). Google Fonts (без изменений).

## Global Constraints

- **No build step, no frameworks, no new dependencies.** Vanilla JS. Новый `assets/js/cart.js` — обычный файл, подключается `<script src>` (это не библиотека/бандлер).
- **Ноль inline-стилей** в затронутых файлах, кроме динамического `background-image` карточек. Все стили — в `assets/css/main.css`, с синхронной правкой `docs/design-system.md` (правило проекта).
- **Никаких `onclick=` / `event.target`** — только `addEventListener` и делегирование.
- **Цена выводится как `<price> Br`.**
- **Формат позиции корзины:** `{ name: string, price: number, quantity: number }`, ключ localStorage — `cart` (не менять — этот формат уже читают существующие части).
- **Состояния видимости** (badge, empty/success/error) — через HTML-атрибут `hidden`, не через inline `style.display`.
- **Шрифтовой `<link>` не трогаем** — он уже одинаков на index.html и checkout.html.
- **Self-verify запрещён:** агент не запускает dev-сервер/браузер. JS-проверка — `node` (`new Function`). Визуальную проверку выполняет пользователь.
- **Formspree endpoint** — плейсхолдер `https://formspree.io/f/PLACEHOLDER_ID`, реальный ID впишет пользователь.
- **Не трогать:** `content/bouquets.json`, `admin/*`, `experiments/`.

---

### Task 1: CSS-компоненты корзины в main.css + синк design-system.md

**Files:**
- Modify: `assets/css/main.css` (добавить блок в конец)
- Modify: `docs/design-system.md` (добавить секцию в конец)

**Interfaces:**
- Produces: классы `.cart-link`, `.cart-badge` (+ `.cart-badge[hidden]`), `.bouquet-card__add`, `.checkout-section`, `.checkout-head`, `.checkout-subhead`, `.checkout-layout`, `.cart-items`, `.cart-item`, `.cart-item__details/__title/__price/__controls/__btn/__qty`, `.checkout-total`, `.checkout-submit`, `.checkout-error`, `.checkout-success-title`, `.empty-cart`. Их используют Tasks 3-5.

- [ ] **Step 1: Добавить CSS-блок в конец `assets/css/main.css`**

```css

/* ===== Shopping cart & checkout ===== */
.cart-link {
  position: relative;
}
.cart-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  background: var(--color-danger);
  color: #fff;
  font-size: var(--text-xs);
  font-weight: 600;
  line-height: 1;
  border-radius: var(--radius-pill);
}
.cart-badge[hidden] {
  display: none;
}
.bouquet-card__add {
  margin-top: var(--space-3);
  width: 100%;
}
.checkout-section {
  padding-top: var(--space-6);
}
.checkout-head {
  text-align: left;
  margin-bottom: var(--space-8);
}
.checkout-subhead {
  margin-bottom: var(--space-4);
}
.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
}
@media (max-width: 880px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }
}
.cart-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4);
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
}
.cart-item__details {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.cart-item__title {
  font-weight: 600;
}
.cart-item__price {
  color: var(--text-secondary);
}
.cart-item__controls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
.cart-item__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s ease;
}
.cart-item__btn:hover {
  background: var(--glass-bg);
}
.cart-item__qty {
  min-width: 16px;
  text-align: center;
  font-weight: 500;
}
.checkout-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--space-6);
  padding-top: var(--space-4);
  border-top: 1px solid var(--glass-border);
  font-family: var(--font-display);
  font-size: var(--text-xl);
}
.checkout-submit {
  width: 100%;
}
.checkout-error {
  margin-bottom: var(--space-4);
  color: var(--color-danger);
}
.checkout-success-title {
  color: var(--color-success);
}
.empty-cart {
  text-align: center;
  padding: var(--space-10);
}
```

- [ ] **Step 2: Документировать компоненты в конце `docs/design-system.md`**

Добавить в конец файла:

```markdown

## 14. Cart & Checkout Components

Shopping cart and checkout styling (all tokens, no hardcoded values).

- **`.cart-link` / `.cart-badge`** — header cart icon wrapper (`position: relative`) and the item-count badge (`--color-danger`, `--radius-pill`, `--text-xs`). Hidden via the `hidden` attribute; `.cart-badge[hidden]` enforces `display: none` over the flex display.
- **`.bouquet-card__add`** — full-width «В корзину» button under a card body; pairs with `.btn.btn--primary`.
- **`.checkout-layout`** — two-column grid (cart items + delivery form), collapses to one column ≤880px.
- **`.cart-item*`** — a cart line: glass row (`--glass-bg`/`--glass-border`/`--radius-lg`) with title, price, and `−`/qty/`+` controls (`.cart-item__btn` on `--glass-bg-light`).
- **`.checkout-total`** — total row, `--font-display`, `--text-xl`.
- **`.empty-cart`** — centered panel reused for empty-cart and success states (toggled via `hidden`).
- **`.checkout-error`** (`--color-danger`) / **`.checkout-success-title`** (`--color-success`) — feedback states.
```

- [ ] **Step 3: Проверить, что CSS не сломал парсинг (баланс скобок)**

Run:
```bash
node -e "const c=require('fs').readFileSync('assets/css/main.css','utf8');const o=(c.match(/{/g)||[]).length,x=(c.match(/}/g)||[]).length;if(o!==x)throw new Error('brace mismatch '+o+'/'+x);if(!/\.cart-badge\[hidden\]/.test(c))throw new Error('cart-badge[hidden] missing');console.log('CSS OK',o,'blocks')"
```
Expected: `CSS OK <n> blocks`

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.css docs/design-system.md
git commit -m "feat: add cart & checkout component styles"
```

---

### Task 2: Общее cart-ядро `assets/js/cart.js`

**Files:**
- Create: `assets/js/cart.js`

**Interfaces:**
- Produces: глобал `window.FloresCart` с методами `read() -> CartItem[]`, `write(cart)`, `count(cart?) -> number`, `add(name, price)`, `updateBadge()`. Делегированный обработчик `.bouquet-card__add` и обновление `.cart-badge` на `DOMContentLoaded`. `CartItem = {name:string, price:number, quantity:number}`. Потребляют Tasks 3-5.

- [ ] **Step 1: Создать `assets/js/cart.js`**

```js
// assets/js/cart.js — shared shopping-cart core for Flores (no build step)
(function () {
  'use strict';
  var STORAGE_KEY = 'cart';

  function cartRead() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function cartWrite(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function cartCount(cart) {
    return (cart || cartRead()).reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }

  function cartAdd(name, price) {
    var p = Number(price);
    if (!name || isNaN(p)) return;
    var cart = cartRead();
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ name: name, price: p, quantity: 1 });
    }
    cartWrite(cart);
    updateCartBadge();
  }

  function updateCartBadge() {
    var badge = document.querySelector('.cart-badge');
    if (!badge) return;
    var count = cartCount();
    if (count > 0) {
      badge.textContent = count;
      badge.removeAttribute('hidden');
    } else {
      badge.setAttribute('hidden', '');
    }
  }

  // Delegated "add to cart" for catalog cards (works for static & dynamic cards)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.bouquet-card__add');
    if (!btn) return;
    cartAdd(btn.dataset.name, btn.dataset.price);
  });

  document.addEventListener('DOMContentLoaded', updateCartBadge);

  window.FloresCart = {
    read: cartRead,
    write: cartWrite,
    count: cartCount,
    add: cartAdd,
    updateBadge: updateCartBadge
  };
})();
```

- [ ] **Step 2: Проверить синтаксис**

Run:
```bash
node --check assets/js/cart.js && echo "cart.js syntax OK"
```
Expected: `cart.js syntax OK`

- [ ] **Step 3: Commit**

```bash
git add assets/js/cart.js
git commit -m "feat: add shared cart core (assets/js/cart.js)"
```

---

### Task 3: index.html — кнопка в карточке, badge, cart.js, удаление формы заказа

**Files:**
- Modify: `index.html` (header badge ~45-48; hero/delivery `#order` anchors line ~75 и ~183; `#order` section ~368-405; catalog module `bouquetCardHTML`/`renderCatalog`/`populateOrderSelect` ~612-647; Cart Logic block ~685-719; добавить `<script src>`)

**Interfaces:**
- Consumes: `FloresCart` и делегирование из Task 2; классы из Task 1; `content/bouquets.json`.

- [ ] **Step 1: Шапка — badge на класс вместо inline**

Заменить блок ссылки-корзины:

```html
            <a class="social-link" href="checkout.html" aria-label="Корзина" style="position: relative;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span id="cart-badge" style="display:none; background:var(--color-danger); color:white; border-radius:50%; width:16px; height:16px; font-size:10px; align-items:center; justify-content:center; position:absolute; top:-6px; right:-8px;">0</span>
            </a>
```

на:

```html
            <a class="social-link cart-link" href="checkout.html" aria-label="Корзина">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="cart-badge" hidden>0</span>
            </a>
```

- [ ] **Step 2: Кнопка «В корзину» в `bouquetCardHTML`**

Заменить функцию:

```js
      function bouquetCardHTML(b) {
        const price = (typeof b.price === 'number')
          ? `<span class="bouquet-card__price">${b.price} Br</span>` : '';
        return `
            <article class="bouquet-card reveal">
              <div class="bouquet-card__media" style="background-image: url('${encodeURI(b.image || '')}');"></div>
              <div class="bouquet-card__body">
                <h3>${escHtml(b.title)}</h3>
                <p>${escHtml(b.description)}</p>
                ${price}
              </div>
            </article>`;
      }
```

на:

```js
      function bouquetCardHTML(b) {
        const hasPrice = typeof b.price === 'number';
        const price = hasPrice
          ? `<span class="bouquet-card__price">${b.price} Br</span>` : '';
        const addBtn = hasPrice
          ? `<button type="button" class="btn btn--primary bouquet-card__add" data-name="${escHtml(b.title)}" data-price="${b.price}">В корзину</button>`
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
```

- [ ] **Step 3: Убрать `populateOrderSelect` из `renderCatalog` и саму функцию**

Заменить:

```js
      function populateOrderSelect(bouquets) {
        const select = document.getElementById('order-bouquet');
        if (!select) return;
        select.innerHTML = '<option value="" disabled selected>Выберите букет из коллекции</option>';
        bouquets.forEach((b) => {
          const opt = document.createElement('option');
          opt.textContent = b.title;
          select.appendChild(opt);
        });
        const custom = document.createElement('option');
        custom.textContent = 'Хочу индивидуальный заказ';
        select.appendChild(custom);
      }

      function renderCatalog(data) {
        const all = Array.isArray(data) ? data : (data.items || []);
        const visible = all.filter((b) => b.available !== false);
        bouquetGrid.innerHTML = visible.map(bouquetCardHTML).join('');
        bouquetGrid.querySelectorAll('.reveal').forEach(observeReveal);
        populateOrderSelect(visible);
      }
```

на:

```js
      function renderCatalog(data) {
        const all = Array.isArray(data) ? data : (data.items || []);
        const visible = all.filter((b) => b.available !== false);
        bouquetGrid.innerHTML = visible.map(bouquetCardHTML).join('');
        bouquetGrid.querySelectorAll('.reveal').forEach(observeReveal);
      }
```

- [ ] **Step 4: Удалить блок «Cart Logic» из inline-скрипта**

Удалить целиком (логика теперь в cart.js):

```js
      // Cart Logic
      function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const badge = document.getElementById('cart-badge');
        if (!badge) return;
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (count > 0) {
          badge.textContent = count;
          badge.style.display = 'inline-flex';
        } else {
          badge.style.display = 'none';
        }
      }

      function addToCart(name, price) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existingItem = cart.find(item => item.name === name);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ name, price, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();

        // Visual feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Добавлено!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 1500);
      }

      updateCartBadge();
```

(Если отступы/пустые строки слегка отличаются — ориентироваться по содержимому через Read; удалить от комментария `// Cart Logic` до завершающего вызова `updateCartBadge();` включительно. Блок мобильного меню `if (burgerBtn && headerRight) { ... }` выше — оставить.)

- [ ] **Step 5: Подключить cart.js перед reveal-скриптом**

Найти строку `<!-- Scroll reveal (the page's only JS — design-system.md §12) -->` и вставить ПЕРЕД ней:

```html
    <script src="assets/js/cart.js"></script>
```

- [ ] **Step 6: Перенаправить ссылки `#order` на каталог**

Заменить (hero, ~строка 75):
```html
                <a class="btn btn--ghost" href="#order">Заказать</a>
```
на:
```html
                <a class="btn btn--ghost" href="#bouquets">Заказать</a>
```

Заменить (delivery-cta, ~строка 183):
```html
              <a class="btn btn--primary delivery-cta__btn" href="#order">Заказать букет</a>
```
на:
```html
              <a class="btn btn--primary delivery-cta__btn" href="#bouquets">Заказать букет</a>
```

- [ ] **Step 7: Удалить секцию формы заказа `#order`**

Удалить целиком блок от комментария `<!-- Order Form -->` до закрывающего `</section>` этой секции включительно (открывается `<section class="section" id="order" ...>`, внутри `.order-card`, `<form class="order-form" ...>`, заканчивается `</section>` перед `<!-- Contact -->`). Использовать Read, чтобы точно определить границы, и удалить ровно эту секцию (соседние секции не трогать).

- [ ] **Step 8: Проверки**

Run (синтаксис inline-скрипта):
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const m=h.match(/<!-- Scroll reveal[\s\S]*?<script>([\s\S]*?)<\/script>/);if(!m)throw new Error('script block not found');new Function(m[1]);console.log('JS syntax OK')"
```
Expected: `JS syntax OK`

Run (чистота — не должно остаться старого):
```bash
grep -n "addToCart\|id=\"cart-badge\"\|populateOrderSelect\|order-bouquet\|id=\"order\"\|event.target\|style=\"display:none" index.html || echo "clean"
```
Expected: `clean`

Run (новое на месте):
```bash
grep -c "bouquet-card__add\|cart.js\|class=\"cart-badge\"" index.html
```
Expected: число ≥ 3

- [ ] **Step 9: Визуальная проверка (выполняет пользователь)**

`npm run dev`: на карточках есть «В корзину», клик увеличивает badge; формы заказа `#order` больше нет; «Заказать» в hero ведёт к каталогу; ничего не сломалось на ~360/768px.

- [ ] **Step 10: Commit**

```bash
git add index.html
git commit -m "feat: add-to-cart on catalog cards, drop legacy order form (index.html)"
```

---

### Task 4: index-green.html — та же чистая корзина

**Files:**
- Modify: `index-green.html` (header badge ~45-48; hero/delivery `#order` anchors ~77 и ~257; 6 card buttons ~139-199; `#order` section ~443; Cart Logic block ~704-738; добавить `<script src>`)

**Interfaces:**
- Consumes: `FloresCart`/делегирование (Task 2), классы (Task 1).

- [ ] **Step 1: Шапка — badge на класс (тот же блок, что в index.html)**

Заменить:
```html
            <a class="social-link" href="checkout.html" aria-label="Корзина" style="position: relative;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span id="cart-badge" style="display:none; background:var(--color-danger); color:white; border-radius:50%; width:16px; height:16px; font-size:10px; align-items:center; justify-content:center; position:absolute; top:-6px; right:-8px;">0</span>
            </a>
```
на:
```html
            <a class="social-link cart-link" href="checkout.html" aria-label="Корзина">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="cart-badge" hidden>0</span>
            </a>
```

- [ ] **Step 2: 6 кнопок карточек — класс + data-* вместо inline/onclick**

Для каждой из шести кнопок заменить inline-вариант на чистый. Образец (первая):

Было:
```html
                  <button class="btn btn--primary" style="padding: 8px 16px; font-size: 0.875rem;" onclick="addToCart('Утренний свет', 120)">В корзину</button>
```
Стало:
```html
                  <button type="button" class="btn btn--primary bouquet-card__add" data-name="Утренний свет" data-price="120">В корзину</button>
```

Применить ко всем шести (значения `data-name`/`data-price` берутся из текущего `onclick="addToCart('<name>', <price>)"` каждой кнопки):
- `Утренний свет` / `120`
- `Персиковый шёлк` / `140`
- `Тёплый беж` / `95`
- `Весенний бриз` / `110`
- `Малиновый закат` / `160`
- `Снежная королева` / `135`

- [ ] **Step 3: Удалить блок «Cart Logic» из inline-скрипта index-green.html**

Удалить от комментария `// Cart Logic` до завершающего `updateCartBadge();` включительно (тот же блок, что в index.html Task 3 Step 4). Соседнюю логику (мобильное меню и т.п.) не трогать. Ориентироваться по содержимому через Read.

- [ ] **Step 4: Подключить cart.js**

Перед inline-блоком скролл-reveal (`<!-- Scroll reveal ... -->` или соответствующим `<script>` в конце body) вставить:
```html
    <script src="assets/js/cart.js"></script>
```
(Если коммент-маркер reveal отличается — вставить непосредственно перед последним inline `<script>` страницы.)

- [ ] **Step 5: Перенаправить ссылки `#order` на каталог**

Заменить (`~строка 77`):
```html
                <a class="btn btn--ghost" href="#order">Заказать</a>
```
на:
```html
                <a class="btn btn--ghost" href="#bouquets">Заказать</a>
```
Заменить (`~строка 257`):
```html
              <a class="btn btn--primary delivery-cta__btn" href="#order">Заказать букет</a>
```
на:
```html
              <a class="btn btn--primary delivery-cta__btn" href="#bouquets">Заказать букет</a>
```

- [ ] **Step 6: Удалить секцию формы заказа `#order`**

Удалить целиком секцию `<section class="section" id="order" ...> … </section>` (открывается ~строка 443), как в index.html Task 3 Step 7. Границы определить через Read; соседние секции не трогать.

- [ ] **Step 7: Проверки**

Run:
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('index-green.html','utf8');const ms=h.match(/<script>([\s\S]*?)<\/script>/g)||[];ms.forEach(s=>new Function(s.replace(/^<script>/,'').replace(/<\/script>$/,'')));console.log('JS syntax OK',ms.length,'blocks')"
```
Expected: `JS syntax OK <n> blocks`

Run:
```bash
grep -n "addToCart\|id=\"cart-badge\"\|onclick=\|id=\"order\"\|event.target\|href=\"#order\"" index-green.html || echo "clean"
```
Expected: `clean`

Run:
```bash
grep -c "bouquet-card__add\|cart.js\|class=\"cart-badge\"" index-green.html
```
Expected: число ≥ 8 (6 кнопок + cart.js + badge)

- [ ] **Step 8: Визуальная проверка (выполняет пользователь)**

`npm run dev` → `index-green.html`: кнопки «В корзину» работают, badge растёт, формы `#order` нет.

- [ ] **Step 9: Commit**

```bash
git add index-green.html
git commit -m "feat: clean cart wiring + drop legacy order form (index-green.html)"
```

---

### Task 5: checkout.html — переработка на main.css + Formspree

**Files:**
- Modify: `checkout.html` (полная замена содержимого файла)

**Interfaces:**
- Consumes: `FloresCart` (Task 2), классы (Task 1).
- Produces: рабочая страница оформления (отправка в Formspree после подстановки реального ID).

- [ ] **Step 1: Перезаписать `checkout.html` целиком**

```html
<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Оформление заказа — Flores</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Manrope:wght@400;500;600;700&family=Marck+Script&display=swap"
      rel="stylesheet"
    />

    <!-- Design tokens & components -->
    <link rel="stylesheet" href="assets/css/main.css" />
  </head>
  <body>
    <!-- Header -->
    <header class="site-header">
      <div class="container">
        <a class="brand" href="index.html">Flores</a>
        <div class="header-right">
          <a class="social-link" href="index.html" aria-label="На главную">Вернуться в каталог</a>
        </div>
      </div>
    </header>

    <main>
      <section class="section checkout-section">
        <div class="container">
          <div class="section__head checkout-head">
            <h1 class="gradient-title">Оформление заказа</h1>
          </div>

          <div id="checkout-container" class="checkout-layout">
            <!-- Cart items -->
            <div>
              <h2 class="eyebrow checkout-subhead">Ваш заказ</h2>
              <div id="cart-items-container" class="cart-items"></div>
              <div class="checkout-total">
                <span>Итого:</span>
                <span id="cart-total">0 Br</span>
              </div>
            </div>

            <!-- Delivery form -->
            <div>
              <div class="glass-panel panel--pad">
                <h2 class="eyebrow checkout-subhead">Данные доставки</h2>
                <form id="checkout-form" class="order-form">
                  <div class="input-wrapper">
                    <label class="input-label" for="co-name">Ваше имя</label>
                    <input id="co-name" name="name" type="text" class="input-cutout" placeholder="Как к вам обращаться?" required />
                  </div>
                  <div class="input-wrapper">
                    <label class="input-label" for="co-phone">Телефон</label>
                    <input id="co-phone" name="phone" type="tel" class="input-cutout" placeholder="+375 (29) 000-00-00" required />
                  </div>
                  <div class="input-wrapper">
                    <label class="input-label" for="co-address">Адрес доставки</label>
                    <input id="co-address" name="address" type="text" class="input-cutout" placeholder="Улица, дом, квартира" required />
                  </div>
                  <p id="checkout-error" class="checkout-error" hidden>Не удалось отправить заказ. Попробуйте ещё раз или позвоните нам.</p>
                  <button type="submit" class="btn btn--primary checkout-submit">Подтвердить заказ</button>
                </form>
              </div>
            </div>
          </div>

          <div id="empty-state" class="empty-cart glass-panel" hidden>
            <h2 class="gradient-title">Ваша корзина пуста</h2>
            <p class="lead">Перейдите на главную страницу, чтобы выбрать букет.</p>
            <a href="index.html" class="btn btn--primary">В каталог</a>
          </div>

          <div id="success-state" class="empty-cart glass-panel" hidden>
            <h2 class="gradient-title checkout-success-title">Заказ успешно оформлен!</h2>
            <p class="lead">Наш менеджер скоро свяжется с вами для подтверждения доставки.</p>
            <a href="index.html" class="btn btn--primary">На главную</a>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="site-footer">
      <div class="container">
        <p class="site-footer__brand">Flores</p>
        <p>© 2026 Flores · Цветочная мастерская</p>
      </div>
    </footer>

    <script src="assets/js/cart.js"></script>
    <script>
      (function () {
        // Formspree: вписать реальный ID формы вместо PLACEHOLDER_ID (см. docs/cms-setup.md)
        var FORMSPREE_ENDPOINT = 'https://formspree.io/f/PLACEHOLDER_ID';

        var itemsEl = document.getElementById('cart-items-container');
        var totalEl = document.getElementById('cart-total');
        var containerEl = document.getElementById('checkout-container');
        var emptyEl = document.getElementById('empty-state');
        var successEl = document.getElementById('success-state');
        var errorEl = document.getElementById('checkout-error');
        var form = document.getElementById('checkout-form');

        function esc(s) {
          return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function cartTotal(cart) {
          return cart.reduce(function (sum, i) { return sum + i.price * i.quantity; }, 0);
        }

        function render() {
          var cart = FloresCart.read();
          if (cart.length === 0) {
            containerEl.setAttribute('hidden', '');
            successEl.setAttribute('hidden', '');
            emptyEl.removeAttribute('hidden');
            return;
          }
          emptyEl.setAttribute('hidden', '');
          containerEl.removeAttribute('hidden');
          itemsEl.innerHTML = cart.map(function (item, index) {
            return '<div class="cart-item">'
              + '<div class="cart-item__details">'
              + '<span class="cart-item__title">' + esc(item.name) + '</span>'
              + '<span class="cart-item__price">' + item.price + ' Br</span>'
              + '</div>'
              + '<div class="cart-item__controls">'
              + '<button type="button" class="cart-item__btn" data-index="' + index + '" data-delta="-1" aria-label="Уменьшить">−</button>'
              + '<span class="cart-item__qty">' + item.quantity + '</span>'
              + '<button type="button" class="cart-item__btn" data-index="' + index + '" data-delta="1" aria-label="Увеличить">+</button>'
              + '</div>'
              + '</div>';
          }).join('');
          totalEl.textContent = cartTotal(cart) + ' Br';
        }

        function changeQuantity(index, delta) {
          var cart = FloresCart.read();
          if (!cart[index]) return;
          cart[index].quantity += delta;
          if (cart[index].quantity <= 0) cart.splice(index, 1);
          FloresCart.write(cart);
          FloresCart.updateBadge();
          render();
        }

        itemsEl.addEventListener('click', function (e) {
          var btn = e.target.closest('.cart-item__btn');
          if (!btn) return;
          changeQuantity(Number(btn.dataset.index), Number(btn.dataset.delta));
        });

        function orderSummary(cart) {
          var lines = cart.map(function (i) {
            return i.name + ' × ' + i.quantity + ' = ' + (i.price * i.quantity) + ' Br';
          });
          lines.push('Итого: ' + cartTotal(cart) + ' Br');
          return lines.join('\n');
        }

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          errorEl.setAttribute('hidden', '');
          var cart = FloresCart.read();
          if (cart.length === 0) { render(); return; }
          var fd = new FormData(form);
          var payload = {
            name: fd.get('name'),
            phone: fd.get('phone'),
            address: fd.get('address'),
            order: orderSummary(cart)
          };
          fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          })
            .then(function (res) {
              if (!res.ok) throw new Error('HTTP ' + res.status);
              FloresCart.write([]);
              FloresCart.updateBadge();
              containerEl.setAttribute('hidden', '');
              successEl.removeAttribute('hidden');
            })
            .catch(function () {
              errorEl.removeAttribute('hidden');
            });
        });

        render();
      })();
    </script>
  </body>
</html>
```

- [ ] **Step 2: Проверки**

Run (нет inline-стилей и нет своего `<style>`):
```bash
grep -n "style=\|<style" checkout.html || echo "no inline styles — clean"
```
Expected: `no inline styles — clean`

Run (синтаксис inline-скрипта):
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('checkout.html','utf8');const m=h.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);if(!m)throw new Error('inline script not found');new Function(m[1]);console.log('checkout JS OK')"
```
Expected: `checkout JS OK`

- [ ] **Step 3: Визуальная проверка (выполняет пользователь)**

Добавить пару букетов на главной → открыть `checkout.html`: позиции, +/−, итог; пустая корзина → empty-state; submit с реальным Formspree-ID → success + очистка; при ошибке сети — инлайн-ошибка, корзина цела.

- [ ] **Step 4: Commit**

```bash
git add checkout.html
git commit -m "feat: rebuild checkout on design system + Formspree submit"
```

---

### Task 6: Документация Formspree

**Files:**
- Modify: `docs/cms-setup.md` (добавить секцию в конец)

- [ ] **Step 1: Добавить секцию в конец `docs/cms-setup.md`**

```markdown

## 6. Отправка заказов из корзины (Formspree)

Страница `checkout.html` отправляет заказ AJAX-ом в Formspree.

1. Зарегистрироваться на https://formspree.io (бесплатный план).
2. Создать новую форму, указать email получателя заказов.
3. Скопировать endpoint вида `https://formspree.io/f/abcdwxyz`.
4. В `checkout.html` заменить `https://formspree.io/f/PLACEHOLDER_ID` на этот адрес
   (переменная `FORMSPREE_ENDPOINT` в inline-скрипте).
5. Закоммитить и запушить — Cloudflare Pages передеплоит. Отправить тестовый
   заказ и проверить, что письмо пришло.

Заказ уходит как JSON с полями `name`, `phone`, `address` и `order` (список
букетов с количеством и итогом).
```

- [ ] **Step 2: Commit**

```bash
git add docs/cms-setup.md
git commit -m "docs: add Formspree setup for cart checkout"
```

---

## Порядок и зависимости

Task 1 (CSS) и Task 2 (cart.js) — фундамент, идут первыми (можно в любом порядке между собой). Tasks 3, 4, 5 зависят от 1 и 2, между собой независимы. Task 6 — документация, последняя.

## Self-Review (выполнено автором плана)

- **Покрытие спеки:** кнопка/badge/модуль → T2+T3; checkout+Formspree → T5; стили в main.css + design-system синк → T1; удаление `#order` → T3/T4; index-green чистка → T4; Formspree-инструкция → T6. Все разделы спеки покрыты.
- **Плейсхолдеры:** только намеренный `PLACEHOLDER_ID` (Formspree) + `~строка N` как ориентиры (точные блоки даны дословно). Логических TODO нет.
- **Согласованность типов:** `FloresCart.{read,write,count,add,updateBadge}`, `CartItem{name,price,quantity}`, классы `.cart-*`/`.checkout-*`/`.bouquet-card__add`, ключ localStorage `cart` — едины во всех задачах. `hidden`-атрибут для всех состояний.

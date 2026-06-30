# Каталог букетов через CMS — план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Дать владельцу править каталог букетов через визуальную админку Sveltia CMS, сохранив сайт чистой статикой на Cloudflare Pages.

**Architecture:** Каталог хранится в `content/bouquets.json` (`{ "items": [...] }`). `index.html` при загрузке делает `fetch` и рендерит карточки из существующих классов, переинициализируя лайтбокс и `<select>` заказа. Админка — две статичные страницы (`admin/`), подключающие Sveltia с CDN; сохранение = коммит в GitHub. Авторизация — GitHub OAuth через воркер `sveltia-cms-auth`.

**Tech Stack:** Plain HTML/CSS/vanilla JS (no build step), Sveltia CMS (CDN), Cloudflare Pages + Cloudflare Workers, GitHub OAuth.

## Global Constraints

- **No build step. No frameworks. No new dependencies.** Только vanilla JS внутри существующего `<script>` в `index.html`.
- **Не хардкодить цвета/размеры/отступы** — переиспользовать существующие классы `.bouquet-card`, `.card-grid` и токены. Новых CSS-правил не добавлять.
- **Не трогать:** `experiments/`, `assets/css/*`, `docs/design-system.md`.
- **Цена рендерится как `<price> Br`** (как сейчас: «120 Br»).
- **`backdrop-filter`** и прочий CSS не затрагиваются.
- **Self-verify запрещён:** агент НЕ запускает dev-сервер и НЕ открывает браузер. Визуальные проверки помечены «(проверяет пользователь)». Валидация JSON через `node` допустима.
- Язык интерфейса/копий — русский.

---

### Task 1: Данные каталога — `content/bouquets.json`

Переносим 6 существующих захардкоженных карточек в JSON. Структура — объект с ключом `items` (так пишет file-коллекция Sveltia), значение — массив букетов.

**Files:**
- Create: `content/bouquets.json`

**Interfaces:**
- Produces: файл `content/bouquets.json` вида `{ "items": Bouquet[] }`, где
  `Bouquet = { title: string, image: string, price: number, description: string, available: boolean }`.
  `image` — путь от корня сайта (`assets/images/<file>`). Этот контракт потребляют Task 2 (рендер) и Task 3 (config.yml).

- [ ] **Step 1: Создать файл с переносом 6 карточек**

`content/bouquets.json`:

```json
{
  "items": [
    {
      "title": "Утренний свет",
      "image": "assets/images/morning_light.jpg",
      "price": 120,
      "description": "Пионовидные розы, эвкалипт, мягкая пастель.",
      "available": true
    },
    {
      "title": "Персиковый шёлк",
      "image": "assets/images/peach_silk.jpg",
      "price": 140,
      "description": "Ранункулюсы, фрезия, лёгкая зелень.",
      "available": true
    },
    {
      "title": "Тёплый беж",
      "image": "assets/images/warm_beige.jpg",
      "price": 95,
      "description": "Сухоцветы и пампасная трава, монохром.",
      "available": true
    },
    {
      "title": "Весенний бриз",
      "image": "assets/images/spring_breeze.jpg",
      "price": 110,
      "description": "Тюльпаны, гортензия, лёгкая прохлада и свежесть.",
      "available": true
    },
    {
      "title": "Малиновый закат",
      "image": "assets/images/crimson_sunset.jpg",
      "price": 160,
      "description": "Красные розы, диантусы, яркий и сочный акцент.",
      "available": true
    },
    {
      "title": "Снежная королева",
      "image": "assets/images/snow_queen.jpg",
      "price": 135,
      "description": "Белоснежные лилии, гипсофила, строгая элегантность.",
      "available": true
    }
  ]
}
```

- [ ] **Step 2: Проверить валидность JSON и число элементов**

Run:
```bash
node -e "const d=require('./content/bouquets.json'); if(!Array.isArray(d.items)||d.items.length!==6) throw new Error('bad'); console.log('OK', d.items.length)"
```
Expected: `OK 6`

- [ ] **Step 3: Коммит**

```bash
git add content/bouquets.json
git commit -m "feat: add bouquet catalog data (migrated from static cards)"
```

---

### Task 2: Динамический рендер каталога в `index.html`

Заменяем статичные карточки на пустой `.card-grid` + JS-модуль, который читает JSON и строит карточки. Лайтбокс переводим на делегирование (работает с динамическими узлами), reveal-наблюдатель делаем переиспользуемым, селект заказа заполняем из данных.

**Files:**
- Modify: `index.html` (статичные карточки — строки ~125-179; reveal-блок ~601-618; лайтбокс ~646-655; опции селекта ~442-451)

**Interfaces:**
- Consumes: `content/bouquets.json` (`{ items: Bouquet[] }`) из Task 1.
- Produces: ничего для последующих задач (изолированная правка одной страницы).

- [ ] **Step 1: Очистить статичный список карточек**

Заменить весь блок `<div class="card-grid"> ... </div>` (строки ~125-179, со всеми шестью `<article class="bouquet-card reveal">`) на один пустой контейнер:

```html
          <div class="card-grid" id="bouquet-grid"></div>
```

- [ ] **Step 2: Упростить опции селекта заказа**

Блок `<select id="order-bouquet">` (строки ~442-451) — убрать захардкоженные названия букетов, оставив только плейсхолдер (опции добавит JS в Step 4):

```html
                <select id="order-bouquet" class="input-cutout" required>
                  <option value="" disabled selected>Выберите букет из коллекции</option>
                </select>
```

- [ ] **Step 3: Сделать reveal-наблюдатель переиспользуемым**

Заменить существующий reveal-блок (строки ~601-618):

```js
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const items = document.querySelectorAll(".reveal");
      if (prefersReduced || !("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
      } else {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                io.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15 }
        );
        items.forEach((el) => io.observe(el));
      }
```

на версию с функцией `observeReveal` (её вызовет рендер каталога для новых карточек):

```js
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const io = (!prefersReduced && "IntersectionObserver" in window)
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  entry.target.classList.add("is-visible");
                  io.unobserve(entry.target);
                }
              });
            },
            { threshold: 0.15 }
          )
        : null;

      function observeReveal(el) {
        if (io) io.observe(el);
        else el.classList.add("is-visible");
      }

      document.querySelectorAll(".reveal").forEach(observeReveal);
```

- [ ] **Step 4: Лайтбокс через делегирование + модуль каталога**

Заменить существующий блок навешивания лайтбокса на `.bouquet-card__media` (строки ~646-655):

```js
      document.querySelectorAll('.bouquet-card__media').forEach(media => {
        media.addEventListener('click', function() {
          const bgImg = this.style.backgroundImage;
          const urlMatch = bgImg.match(/url\(['"]?(.*?)['"]?\)/);
          if (urlMatch && urlMatch[1]) {
            lightboxImg.src = urlMatch[1];
            lightbox.classList.add('is-open');
          }
        });
      });
```

на делегированный обработчик + рендер каталога:

```js
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

      // Каталог букетов из content/bouquets.json -------------------------
      const bouquetGrid = document.getElementById('bouquet-grid');

      function escHtml(s) {
        return String(s == null ? '' : s)
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      }

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

- [ ] **Step 5: Проверка синтаксиса скрипта**

Извлечь JS из `<script>` и проверить парсером Node (без запуска браузера):

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('index.html','utf8');const m=h.match(/<!-- Scroll reveal[\s\S]*?<script>([\s\S]*?)<\/script>/);if(!m)throw new Error('script block not found');new Function(m[1]);console.log('JS syntax OK')"
```
Expected: `JS syntax OK`

- [ ] **Step 6: Визуальная проверка (проверяет пользователь)**

Пользователь запускает `npm run dev` и подтверждает:
- 6 карточек отображаются как раньше (фото, название, описание, цена «… Br»);
- клик по фото открывает лайтбокс;
- в селекте «Что будем собирать?» все 6 названий + «Хочу индивидуальный заказ»;
- на ~360px и ~768px сетка корректна, нет горизонтального скролла;
- (опц.) временно переименовать `content/bouquets.json` → видно fallback-сообщение, страница не падает; вернуть имя обратно.

- [ ] **Step 7: Коммит**

```bash
git add index.html
git commit -m "feat: render bouquet catalog from content/bouquets.json"
```

---

### Task 3: Админка Sveltia — `admin/`

Две статичные страницы. `config.yml` описывает file-коллекцию с list-полем `items`, поля которого совпадают с моделью из Task 1.

**Files:**
- Create: `admin/index.html`
- Create: `admin/config.yml`

**Interfaces:**
- Consumes: модель `Bouquet` и путь `content/bouquets.json` из Task 1.
- Produces: рабочая админка по адресу `/<сайт>/admin/` (после разовой настройки из Task 4).

- [ ] **Step 1: Страница админки**

`admin/index.html`:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Каталог — админка</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

- [ ] **Step 2: Конфиг CMS**

`admin/config.yml` (плейсхолдеры `OWNER/REPO` и URL воркера заменяются в Task 4):

```yaml
backend:
  name: github
  repo: OWNER/REPO
  branch: master
  base_url: https://REPLACE-WITH-WORKER.workers.dev

media_folder: assets/images
public_folder: assets/images

collections:
  - name: catalog
    label: Каталог
    files:
      - name: bouquets
        label: Букеты
        file: content/bouquets.json
        fields:
          - name: items
            label: Букеты
            label_singular: Букет
            widget: list
            summary: '{{fields.title}} — {{fields.price}} Br'
            fields:
              - { name: title, label: Название, widget: string }
              - { name: image, label: Фото, widget: image }
              - { name: price, label: 'Цена (Br)', widget: number, value_type: int, min: 0 }
              - { name: description, label: Описание, widget: text }
              - { name: available, label: Показывать на сайте, widget: boolean, default: true }
```

- [ ] **Step 3: Проверка валидности YAML**

Run:
```bash
node -e "const fs=require('fs');const s=fs.readFileSync('admin/config.yml','utf8');if(!/file:\s*content\/bouquets\.json/.test(s)||!/widget:\s*list/.test(s))throw new Error('config sanity failed');console.log('config OK')"
```
Expected: `config OK`

(Глубокая YAML-валидация и проверка входа в админку выполняются после Task 4, когда подставлены реальные `repo`/`base_url`.)

- [ ] **Step 4: Коммит**

```bash
git add admin/index.html admin/config.yml
git commit -m "feat: add Sveltia CMS admin for bouquet catalog"
```

---

### Task 4: Инструкция по настройке — `docs/cms-setup.md`

Разовая настройка деплоя и авторизации (клики в дашбордах, кода нет). Завершается заполнением реальных значений в `admin/config.yml`.

**Files:**
- Create: `docs/cms-setup.md`
- Modify: `admin/config.yml` (подстановка `repo` и `base_url` — выполняет пользователь по инструкции)

**Interfaces:**
- Consumes: `admin/config.yml` из Task 3.

- [ ] **Step 1: Написать инструкцию**

`docs/cms-setup.md`:

```markdown
# Настройка CMS-каталога (разово)

Цель: открыть владельцу админку `https://<сайт>/admin/` с входом через GitHub.

## 1. Деплой на Cloudflare Pages
1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
2. Выбрать этот репозиторий, ветка `master`.
3. Framework preset: **None**. Build command: **пусто**. Build output directory: `/` (корень).
4. Deploy. Получите адрес вида `https://flores-xxxx.pages.dev`.

## 2. GitHub OAuth App
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. Homepage URL: адрес сайта с шага 1.
3. Authorization callback URL: `https://<воркер>.workers.dev/callback`
   (точный адрес воркера появится в шаге 3 — можно вернуться и дописать).
4. Сохранить **Client ID** и сгенерировать **Client Secret**.

## 3. Воркер авторизации sveltia-cms-auth
1. Репозиторий воркера: https://github.com/sveltia/sveltia-cms-auth (есть кнопка
   «Deploy to Cloudflare»).
2. Задеплоить как Cloudflare Worker. Получите адрес `https://<воркер>.workers.dev`.
3. В переменных воркера задать `GITHUB_CLIENT_ID` и `GITHUB_CLIENT_SECRET`
   из шага 2. (При необходимости `ALLOWED_DOMAINS` = домен сайта.)
4. Вернуться в OAuth App (шаг 2.3) и убедиться, что callback указывает на
   `https://<воркер>.workers.dev/callback`.

## 4. Прописать значения в admin/config.yml
В `admin/config.yml` заменить:
- `repo: OWNER/REPO` → реальный `владелец/имя-репозитория`;
- `base_url: https://REPLACE-WITH-WORKER.workers.dev` → адрес воркера из шага 3.
Закоммитить и запушить — Cloudflare передеплоит автоматически.

## 5. Проверка
1. Открыть `https://<сайт>/admin/`.
2. «Login with GitHub» → авторизоваться.
3. Каталог → Букеты: добавить тестовый букет с фото, сохранить.
4. Через ~1 минуту проверить, что он появился на главной странице.
5. Удалить тестовый букет, сохранить.
```

- [ ] **Step 2: Коммит**

```bash
git add docs/cms-setup.md
git commit -m "docs: add CMS setup guide (Cloudflare Pages + GitHub OAuth)"
```

- [ ] **Step 3: Настройка по инструкции (выполняет пользователь)**

Пользователь проходит шаги 1-5 из `docs/cms-setup.md`, подставляет реальные `repo`/`base_url` в `admin/config.yml`, коммитит и проверяет вход в админку и появление товара на сайте.

---

## Порядок и зависимости

Task 1 → Task 2 (рендер читает данные) и Task 3 (config ссылается на тот же файл) могут идти после Task 1 независимо. Task 4 — последняя (нужен задеплоенный сайт и созданные `admin/`-файлы).

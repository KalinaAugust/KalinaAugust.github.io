# Корзина и оформление заказа — дизайн

Дата: 2026-06-30
Статус: утверждён к реализации

## Цель

Дать посетителю набрать несколько букетов из каталога в корзину и оформить
заказ. Сайт остаётся статикой (no build step). Заказ реально уходит владельцу
через Formspree (email). Корзина заменяет существующую форму заказа на главной.

Контекст: предыдущий имплементер уже накидал черновик корзины (cart-логика в
`index.html`, `checkout.html`), но против правил
проекта — inline-стили, собственный `<style>` в `checkout.html`, чужой шрифт
Caveat, `event.target` (deprecated), в `index.html` кнопок «в корзину» нет, и
отправка заказа никуда не идёт. Этот дизайн переделывает корзину начисто.

## Решения (утверждены)

- Отправка заказа: **Formspree** (AJAX POST, endpoint-ID — плейсхолдер +
  инструкция).
- Корзина **заменяет** форму заказа на главной (секция `#order` удаляется).

## Модель данных

`localStorage`, ключ `cart` — массив позиций:
`CartItem = { name: string, price: number, quantity: number }`.

(Совпадает с тем, что уже читает черновой `checkout.html`, — не ломаем формат.)

## Компоненты

### 1. Кнопка «В корзину» на карточке (index.html)
В `bouquetCardHTML` (модуль каталога) к телу карточки добавляется
`<button class="btn btn--primary bouquet-card__add" data-name="<title>" data-price="<price>">В корзину</button>`.
Никаких `onclick`/inline-стилей. Клик ловится делегированием на `#bouquet-grid`:
читает `data-name`/`data-price`, вызывает `cartAdd(name, price)`.

### 2. Иконка корзины в шапке (index.html)
Ссылка на `checkout.html` с иконкой и `<span class="cart-badge">` — счётчик
суммарного количества. Класс `.cart-badge` (стили в main.css), без inline.
Обновляется функцией `updateCartBadge()` при загрузке и после `cartAdd`.

### 3. Модуль корзины (общий код в index.html)
Функции:
- `cartRead()` → массив из localStorage (с защитой от битого JSON → `[]`).
- `cartAdd(name, price)` — инкремент существующей позиции по `name` либо
  добавление новой; запись в localStorage; `updateCartBadge()`. `price`
  приводится к числу; если `NaN` — позиция не добавляется.
- `updateCartBadge()` — сумма `quantity`; если 0 — badge скрыт через
  HTML-атрибут `hidden`, иначе атрибут снят и в badge выводится число.

### 4. Страница оформления (checkout.html)
Переписывается полностью:
- Подключает те же шрифты, что `index.html` (Manrope/Fraunces/Marck Script;
  **без Caveat**) и `assets/css/main.css`. Никакого `<style>` в странице.
- Список `.cart-item` с контролами +/− (делегирование, не inline `onclick`),
  итог `.checkout-total`.
- Форма доставки (имя, телефон, адрес) — поля на существующих классах
  (`.input-wrapper`, `.input-label`, `.input-cutout`).
- Состояния: `empty-state` (корзина пуста), `success-state` (заказ отправлен) —
  переключаются HTML-атрибутом `hidden`, не inline `style.display`.
- Submit: `fetch` POST на Formspree с `Accept: application/json`; тело —
  имя/телефон/адрес + текстовая сводка заказа (строки `название × qty = sum`
  и `Итого`). При `res.ok` → очистить корзину, показать success. При ошибке →
  показать инлайн-ошибку, корзину НЕ трогать.

## Стили

Все классы корзины — в `assets/css/main.css`, с синхронной правкой
`docs/design-system.md` (правило проекта). Используются существующие токены
(проверено: `--color-success`, `--color-danger`, `--glass-bg-light`,
`--glass-bg`, `--glass-border`, `--radius-lg/sm`, `--space-*`, `--text-xl`
существуют). Новые классы:
`.cart-badge`, `.bouquet-card__add`, `.checkout-layout`, `.cart-items`,
`.cart-item`, `.cart-item__details/__title/__price/__controls/__btn/__qty`,
`.checkout-total`, `.empty-cart`. Видимость состояний — атрибутом `hidden`, не
отдельными классами. Никаких inline-стилей нигде, кроме динамического
`background-image` карточек.

## Удаление формы заказа (index.html)

Секция `<section ... id="order"> … </section>` удаляется целиком. Из
catalog-модуля удаляются `populateOrderSelect` и её вызов в `renderCatalog`
(селекта `#order-bouquet` больше нет). Навигационные ссылки на `#order`
(если есть) — снять или перенаправить на каталог.

## Поток данных

```
карточка «В корзину» → cartAdd → localStorage[cart] → updateCartBadge (badge в шапке)
checkout.html → cartRead → рендер позиций/итога → submit → fetch(Formspree)
  → ok: cart=[] + success-state | error: инлайн-ошибка, cart цел
```

## Настройка (вне кода, инструкция пользователю)

В Formspree создать форму, получить endpoint `https://formspree.io/f/<id>`,
вписать вместо `PLACEHOLDER_ID` в `checkout.html`. Добавить короткую секцию в
`docs/cms-setup.md` (или отдельную доку) с этим шагом.


## Тестирование

- Локально (`npm run dev`) — проверяет пользователь:
  - на карточке есть «В корзину»; клик увеличивает badge в шапке;
  - повторное добавление того же букета увеличивает quantity, не дублирует;
  - `checkout.html`: позиции, +/−, итог считаются верно; пустая корзина →
    empty-state;
  - submit с тестовым Formspree-ID → success-state, корзина очищена; при
    оффлайн/ошибке — инлайн-ошибка, корзина цела;
  - формы заказа `#order` на главной больше нет, страница не ломается;
- Синтаксис JS — `node --check`-эквивалент (извлечь скрипт, `new Function`).
- Нет inline-стилей cart и нет `event.target`/`onclick` в затронутых файлах
  (grep).

## Затрагиваемые файлы

- `index.html` — кнопка в `bouquetCardHTML`, шапка+badge, cart-модуль; удаление
  секции `#order` и `populateOrderSelect`.
- `checkout.html` — полная переработка на main.css + шрифты проекта + Formspree.
- `assets/css/main.css` (+ `docs/design-system.md`) — компонентные классы.
- `docs/cms-setup.md` — шаг про Formspree-ID.
- НЕ трогаем: `content/bouquets.json`, `admin/*`, `experiments/`.

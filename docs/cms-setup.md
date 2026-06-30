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

## 6. Отправка заказов из корзины (Telegram через PHP)

Страница `checkout.html` шлёт заказ AJAX-ом на свой эндпоинт `/api/order.php`
(файл `api/order.php`), а тот пересылает заявку в Telegram. Лимитов на число
заявок нет, токен бота живёт только на сервере (PHP-исходник браузеру не отдаётся).

> Сайт деплоится по **FTP в `public_html`** (см. `.github/workflows/deploy.yml`),
> поэтому используется PHP-эндпоинт, а не serverless. Хостинг должен поддерживать
> PHP (на shared-хостинге это почти всегда так).

### Настройка (уже выполнена)

Бот и получатель прописаны в константах в начале `api/order.php`:
- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather;
- `TELEGRAM_CHAT_ID` — id чата, куда падают заказы.

Чтобы **сменить бота или получателя**:
1. Новый токен — @BotFather → `/newbot` (или `/token` для существующего).
2. Узнать chat_id: написать боту сообщение, открыть
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates`, взять `chat.id`
   (у групп id отрицательный — бота нужно добавить в группу).
3. Заменить две константы в `api/order.php`, закоммитить и запушить.

Заказ уходит как JSON с полями `name`, `phone`, `address`, `payment`, `comment`
и `order` (список букетов с количеством и итогом). Обязателен только `phone`.

> Локально (`npm run dev` / live-server) PHP не выполняется — это статический
> сервер. Проверять отправку нужно на боевом хостинге (или любом локальном PHP:
> `php -S localhost:8000` из корня проекта, затем POST на `/api/order.php`).

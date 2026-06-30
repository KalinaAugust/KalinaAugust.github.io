# Deployment & order backend

How Flores is deployed and how the order → Telegram flow works.

## Overview

The site is static **HTML/CSS/JS**, but checkout sends each order to a small **PHP** endpoint that forwards it to **Telegram**. Hosting is classic **PHP + FTP** (target: **hoster.by**), deployed automatically by **GitHub Actions** on every push to `master`/`main`.

```
checkout.html / cart.js  --POST JSON-->  api/order.php  --Bot API-->  Telegram
                                              ^
                            secrets from api/config.php (or env)
```

There is **no database** — MySQL is not used anywhere.

## Components

| Path | Role |
|------|------|
| `api/order.php` | Endpoint `POST /api/order.php` (JSON body). Builds the message and sends it to Telegram. Uses cURL, with a `stream`/`allow_url_fopen` fallback for hosts where cURL is disabled. |
| `api/config.php` | **Secrets**: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`. Committed to the repo (the repo is **private**). `order.php` falls back to `getenv()` if a constant is missing. |
| `api/config.sample.php` | Template — copy to `config.php` and fill in real values. |
| `.github/workflows/deploy.yml` | CI: on push to `master`/`main`, FTP-syncs the working tree to the host. |

## Host requirement (important)

`order.php` makes an **outbound HTTPS request** to `api.telegram.org`. The host **must allow outbound connections** to external servers.

⚠️ **Many free PHP hosts block outbound connections** (and/or sit behind an anti-bot challenge that breaks AJAX/API POSTs), so `order.php` cannot deliver orders there even though static pages load. Verify outbound is allowed before relying on a host. **hoster.by** (the prod target) allows it.

For day-to-day testing, run locally — see below.

## Secrets model

Secrets are split by who needs them:

- **Telegram token + chat id** → `api/config.php`, committed to the repo. The repo is **private** specifically because this file is in it.
- **FTP credentials** → **GitHub Actions Secrets** (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`), referenced as `${{ secrets.* }}` in `deploy.yml` — kept out of git history.

Set the FTP secrets once:

```bash
gh secret set FTP_SERVER
gh secret set FTP_USERNAME
gh secret set FTP_PASSWORD
```

> ⚠️ Anything committed stays in git history forever, even after a repo goes public or leaks. The bot token in `api/config.php` is in history — **rotate it via @BotFather** before going to production, and use a **separate test bot** while developing.

## Local testing (recommended)

PHP is installed on macOS and the local machine has no outbound restrictions, so the full order → Telegram flow works locally:

```bash
cd /path/to/flores
php -S localhost:8000
```

Open `http://localhost:8000/checkout.html`, submit a test order — it really sends to Telegram (using `api/config.php`). This is the most faithful test of the backend before deploying.

## Deploy steps

1. Commit changes (including `api/config.php` with real values).
2. `git push origin master`.
3. GitHub Actions runs **Deploy to FTP** → FTP-syncs files to `server-dir` (`./public_html/`).
4. Watch the run: `gh run watch <run-id> --exit-status` (or the Actions tab).

The workflow excludes dev-only files (`.git*`, `node_modules`, `package*.json`, `CLAUDE.md`, `README.md`, `.agents`, `.superpowers`, `.idea`).

## Verifying the order flow on a host

1. Open `checkout.html` on the deployed site and submit a test order.
2. **Order arrives in Telegram → done.** ✅
3. **No message?** Open `https://<your-domain>/api/order.php` directly in the browser:
   - A JSON error response → PHP works; the problem is the outbound call to Telegram. Confirm the host allows outbound connections and that **cURL / `allow_url_fopen`** is enabled. `order.php` already falls back to the stream method when cURL is off.
   - **Empty reply / nothing** → the host is blocking the request (outbound block or anti-bot challenge), or PHP isn't running. Check the host's PHP and security settings, or test locally instead.

## hoster.by checklist (prod)

- [ ] Set `FTP_SERVER` / `FTP_USERNAME` / `FTP_PASSWORD` GitHub Secrets to hoster.by values.
- [ ] In `deploy.yml`: confirm `server-dir` matches the real web root (hoster.by is usually `public_html/`, sometimes `www/` — check the file manager).
- [ ] **Rotate the Telegram bot token** via @BotFather; put the new token in `api/config.php`.
- [ ] Push to `master`, then re-test the order flow on the host.

## Not part of hosting: the CMS

`admin/config.yml` points to a `*.workers.dev` URL — that is the **Sveltia CMS OAuth proxy** on Cloudflare, used only to log into the content admin. It is independent of where the site/PHP is hosted and does **not** handle orders. See `docs/cms-setup.md`.

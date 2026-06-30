<?php
// Шаблон конфига для api/order.php.
// Скопируйте этот файл в api/config.php и впишите реальные значения.
// api/config.php в .gitignore — секреты в публичный репозиторий НЕ попадают.
// На боевом сервере config.php генерируется при деплое из GitHub Actions secrets
// (см. .github/workflows/deploy.yml).

const TELEGRAM_BOT_TOKEN = 'PUT-YOUR-BOT-TOKEN-HERE';
const TELEGRAM_CHAT_ID   = 'PUT-YOUR-CHAT-ID-HERE';

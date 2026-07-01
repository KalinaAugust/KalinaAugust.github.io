<?php
// Flores — приём заказа с checkout.html и отправка в Telegram.
// Эндпоинт: POST /api/order.php  (тело — JSON)
//
// Работает на обычном PHP-хостинге (FTP-деплой в public_html).
//
// СЕКРЕТЫ НЕ ХРАНЯТСЯ ЗДЕСЬ. Токен бота и chat_id берутся из api/config.php
// (этот файл в .gitignore — в публичный репозиторий не попадает) либо из
// переменных окружения. На боевой сервер config.php генерируется при деплое
// из GitHub Actions secrets (см. .github/workflows/deploy.yml).
// Локально: скопируйте api/config.sample.php → api/config.php и впишите значения.

$cfgFile = __DIR__ . '/config.php';
if (is_file($cfgFile)) { require $cfgFile; }

$BOT_TOKEN = defined('TELEGRAM_BOT_TOKEN') ? TELEGRAM_BOT_TOKEN : (getenv('TELEGRAM_BOT_TOKEN') ?: '');
$CHAT_ID   = defined('TELEGRAM_CHAT_ID')   ? TELEGRAM_CHAT_ID   : (getenv('TELEGRAM_CHAT_ID')   ?: '');

header('Content-Type: application/json; charset=utf-8');

function respond($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function e($s) {
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

// Отправка сообщения в Telegram. Сначала пробуем cURL, иначе stream-fallback
// (на части хостингов cURL отключён).
function tg_send($url, array $payload) {
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);

    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_POSTFIELDS     => $json,
            CURLOPT_TIMEOUT        => 15,
        ]);
        $res  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return $res !== false && $code < 300;
    }

    $ctx = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => "Content-Type: application/json\r\n",
        'content'       => $json,
        'timeout'       => 15,
        'ignore_errors' => true,
    ]]);
    return @file_get_contents($url, false, $ctx) !== false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond(['ok' => false, 'error' => 'Method not allowed'], 405);
}

if ($BOT_TOKEN === '' || $CHAT_ID === '') {
    respond(['ok' => false, 'error' => 'Server not configured'], 500);
}

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) {
    respond(['ok' => false, 'error' => 'Invalid JSON'], 400);
}

$phone = trim((string)($body['phone'] ?? ''));
if ($phone === '') {
    respond(['ok' => false, 'error' => 'Phone is required'], 400);
}

$isCallback = (($body['type'] ?? '') === 'callback');

if ($isCallback) {
    // Заявка на обратный звонок с лендинга (блок «Закажите звонок»).
    // Форма #callback-form отправляет только телефон.
    $lines = ['📞 <b>Заявка на звонок — Flores</b>', ''];
    $lines[] = '📞 <b>Телефон:</b> ' . e($phone);
    $lines[] = '';
    $lines[] = '💐 Консультация: свадьбы / оформление мероприятий / входные группы';
} else {
    $lines = ['🌸 <b>Новый заказ Flores</b>', ''];
    if (!empty($body['name']))    { $lines[] = '👤 <b>Имя:</b> ' . e($body['name']); }
    $lines[] = '📞 <b>Телефон:</b> ' . e($phone);
    if (!empty($body['address'])) { $lines[] = '📍 <b>Адрес:</b> ' . e($body['address']); }
    if (!empty($body['payment'])) { $lines[] = '💳 <b>Оплата:</b> ' . e($body['payment']); }
    if (!empty($body['cardText'])) { $lines[] = '💌 <b>Текст на открытке:</b> ' . e($body['cardText']); }
    if (!empty($body['comment'])) { $lines[] = '📝 <b>Комментарий:</b> ' . e($body['comment']); }
    if (array_key_exists('offersConsent', $body)) {
        $lines[] = '📬 <b>Согласие на спецпредложения:</b> ' . (!empty($body['offersConsent']) ? 'да' : 'нет');
    }
    $lines[] = '';
    $lines[] = '🛒 <b>Состав заказа:</b>';
    $lines[] = e($body['order'] ?? '—');
}

$ok = tg_send(
    'https://api.telegram.org/bot' . $BOT_TOKEN . '/sendMessage',
    [
        'chat_id'                  => $CHAT_ID,
        'text'                     => implode("\n", $lines),
        'parse_mode'               => 'HTML',
        'disable_web_page_preview' => true,
    ]
);

if (!$ok) {
    respond(['ok' => false, 'error' => 'Telegram delivery failed'], 502);
}

respond(['ok' => true]);

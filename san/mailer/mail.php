<?php

$recepient = "kalininaugust@gmail.com";
$sitename = 'afktorg.by';
$pagetitle = "Заявка от клиента с сайта \"$sitename\"";

$arr = array_map('trim', $_GET);

$message = "Номер телефона: {$arr['phone']}\nИмя: {$arr['name']}\nОрганизация: {$arr['org']}";

$result = mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

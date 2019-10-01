<?php

$recepient = "kalininaugust@gmil.com";
$sitename = 'afktorg.by';
$pagetitle = "Заявка от клиента с сайта \"$sitename\"";

$arr = array_map('trim', $_GET);

$message = "Номер телефона: {$arr['phone']}\nКатегория: {$arr['type']}";

$result = mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

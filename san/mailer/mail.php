<?php

$recepient = "info@ghost-writerservice.de";
$sitename = 'ghost-writerservice.de';
$pagetitle = "Заявка от клиента с сайта \"$sitename\"";

$arr = array_map('trim', $_GET);

$message = "Telefonnummer: {$arr['phone']}\nThema: {$arr['theme']}\nNickname: {$arr['name']}\nArt der wissenschaftlichen Arbeit: {$arr['worktype']}\nFachrichtung: {$arr['subjectText']}\nSeitenanzahl: {$arr['pages']}\nAbgabetermin: {$arr['date']}\nE-Mail: {$arr['email']}";

$result = mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");

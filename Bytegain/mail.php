<?php

$recepient = "interest@bytegain.com";
$sitename = "Bytegain";

$email = trim($_GET["email"]);

$pagetitle = "Message from \"$sitename\"";
$message = "Email: $email";


mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");
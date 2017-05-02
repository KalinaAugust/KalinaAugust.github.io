<?php

$recepient = "interest@bytegain.com";
$sitename = "Bytegain";

$name = trim($_GET["pop-name"]);
$email = trim($_GET["pop-email"]);
$textarea = trim($_GET["textarea"]);

$pagetitle = "Message from \"$sitename\"";
$message = "Name: $name \nEmail: $email \nMessage: $textarea";


mail($recepient, $pagetitle, $message, "Content-type: text/plain; charset=\"utf-8\"\n From: $recepient");


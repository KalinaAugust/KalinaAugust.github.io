<?php
    $name = $_POST["name"];
    $formName = $_POST["form-name"];
    $email = $_POST["email"];
    $phone = $_POST["phone"];
    $message = $_POST["message"];
    $profession = $_POST["profession"];

    $to = "recipient@example.com";
    $subject = "Contact Form Submission from M&A";
    $from = "test@hostinger-tutorials.com";
    $headers = "From:" . $from;

    $formatedMessage = "Форма: $formName \nИмя: $name \nТелефон: $phone \nПочта: $email \nТекст: $message \nПрофессия: $profession";

    mail($to, $subject, $formatedMessage, $headers);
    echo "The email message was sent.";
?>

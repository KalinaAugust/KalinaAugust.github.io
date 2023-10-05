<?php
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "recipient@example.com";
    $subject = "Contact Form Submission from M&A";

    $from = "test@hostinger-tutorials.com";
    $headers = "From:" . $from;
    mail($to, $subject, $message, $headers);
    echo "The email message was sent.";
?>

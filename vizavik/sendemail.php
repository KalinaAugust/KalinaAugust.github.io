<?php

	if(empty($_POST['name']) || (!empty($_POST['email']) && !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))) {
		echo "No arguments Provided!";
		return false;
	}

	$name = $_POST['name'];
	$email_address = $_POST['email'];
	$phone = $_POST['phone'];

	$to = "goooglemax1993@gmail.com";
	$to1 = "vizavikby@gmail.com";
	$email_subject = "Имя: $name";
	$email_body = "Вы получили новое сообщение с сайта vizavik.by \n\n"."Подробнее:\n\nИмя: $name\n\nТелефон: $phone";
	$headers = "From: noreply@vizavik.by\n";
	$headers .= "Reply-To: $email_address";
	mail($to,$email_subject,$email_body,$headers);
	mail($to1,$email_subject,$email_body,$headers);
	return true;

?>
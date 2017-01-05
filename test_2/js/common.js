$(document).ready(function() {

	//Аякс  формa
	$(".main_form").submit(function() {
		$.ajax({
			type: "POST",
			url: "http://web-server.com/processored.php",
			data: $(".main_form").serialize()
		}).done(function() {
			alert("Спасибо за заявку!");
		});
		return false;
	});

});
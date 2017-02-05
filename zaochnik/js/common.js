$(document).ready(function() {

	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$(".arrow_to_footer").click(function() {
		$.scrollTo($(".main_form"), 800, {
			offset: -90
		});
	});

});
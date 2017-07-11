$(document).ready(function() {


	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$(".turnir").click(function() {
		$.scrollTo($(".third-section"), 800, {
			offset: 0
		});
	});



});
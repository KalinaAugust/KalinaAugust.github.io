$(document).ready(function() {

 // menu
$(".hidden_menu").click(function() {
	$(this).next().slideToggle();
});

	//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox();

	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$("a.to_sect_two").click(function() {
		$.scrollTo($(".sect_two"), 800, {
			offset: -90
		});
	});

	$("a.to_section_three").click(function() {
		$.scrollTo($(".section_three"), 800, {
			offset: -90
		});
	});

		$("a.to_sect_five").click(function() {
		$.scrollTo($(".sect_five"), 800, {
			offset: -90
		});
	});

			$("a.to_sect_eight").click(function() {
		$.scrollTo($(".sect_eight"), 800, {
			offset: -90
		});
	});

			$("a.go_up").click(function() {
		$.scrollTo($(".sect_one"), 800, {
			offset: -90
		});
	});

			$("a.to_sect_seven").click(function() {
		$.scrollTo($(".sect_seven"), 800, {
			offset: -90
		});
	});

	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$(".main_form").submit(function() {
		$.ajax({
			type: "GET",
			url: "mail_pop.php",
			data: $(".main_form").serialize()
		}).done(function() {
			var url = "thanks.html";
			$(location).attr('href',url);
			setTimeout(function() {
				$.fancybox.close();
			}, 1000);
		});
		return false;
	});

	$(".footer_form").submit(function() {
		$.ajax({
			type: "GET",
			url: "mail_footer.php",
			data: $(".footer_form").serialize()
		}).done(function() {
			var url = "thanks.html";
			$(location).attr('href',url);
			setTimeout(function() {
				$.fancybox.close();
			}, 1000);
		});
		return false;
	});

		// slider
  $('.slider').slick({
  	dots: true,
  	infinite: true,
  	speed: 300,
  	slidesToShow: 1,
  	adaptiveHeight: true,
  	nextArrow: '<img class="next" src="../Sailex/images/next.png" alt="alt" />',
  	prevArrow: '<img class="prev" src="../Sailex/images/prev.png" alt="alt" />'
  });

});
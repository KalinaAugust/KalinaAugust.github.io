$(document).ready(function() {

$(".hidden_menu").click(function() {
	$(this).next().slideToggle();
});




	//Таймер обратного отсчета
	//Документация: http://keith-wood.name/countdown.html
	//<div class="countdown" date-time="2015-01-07"></div>
	var austDay = new Date($(".countdown").attr("date-time"));
	$(".countdown").countdown({until: austDay, format: 'yowdHMS'});

	//Попап менеджер FancyBox
	//Документация: http://fancybox.net/howto
	//<a class="fancybox"><img src="image.jpg" /></a>
	//<a class="fancybox" data-fancybox-group="group"><img src="image.jpg" /></a>
	$(".fancybox").fancybox();

	//Навигация по Landing Page
	//$(".top_mnu") - это верхняя панель со ссылками.
	//Ссылки вида <a href="#contacts">Контакты</a>
	$(".top_mnu").navigation();

	//Добавляет классы дочерним блокам .block для анимации
	//Документация: http://imakewebthings.com/jquery-waypoints/
	$(".block").waypoint(function(direction) {
		if (direction === "down") {
			$(".class").addClass("active");
		} else if (direction === "up") {
			$(".class").removeClass("deactive");
		};
	}, {offset: 100});

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



	//Кнопка "Наверх"
	//Документация:
	//http://api.jquery.com/scrolltop/
	//http://api.jquery.com/animate/
	$("#top").click(function () {
		$("body, html").animate({
			scrollTop: 0
		}, 800);
		return false;
	});
	
	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$("form").submit(function() {
		$.ajax({
			type: "GET",
			url: "mail.php",
			data: $("form").serialize()
		}).done(function() {
			alert("Спасибо за заявку!");
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
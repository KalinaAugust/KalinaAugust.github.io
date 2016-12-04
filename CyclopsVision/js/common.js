$(document).ready(function() {



$(".hidden_menu").click(function() {
	$(this).next().slideToggle();
});
	





	
var navLi = $(".nav li");

$('.tracked').waypoint( function() {
 var hash = $(this).attr('id');

 navLi.removeClass("active");

$.each( navLi, function() {
 if ( $(this).children('a').attr('href').slice(1) == hash ) {
  $(this).addClass("active");
}
});
}, {
	offset: '30%'
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



	//Плавный скролл до блока .div по клику на .scroll
	//Документация: https://github.com/flesler/jquery.scrollTo
	$(".scroll_1").click(function() {
		$.scrollTo($(".sect_one"), 800, {
			offset: -90
		});
	});

		$(".scroll_2").click(function() {
		$.scrollTo($(".sect_two"), 800, {
			offset: -90
		});
	});

	$(".scroll_3").click(function() {
		$.scrollTo($(".sect_three"), 800, {
			offset: -90
		});
	});

	$(".scroll_4").click(function() {
		$.scrollTo($(".sect_four"), 800, {
			offset: -90
		});
	});

	//Каруселька
	//Документация: http://owlgraphic.com/owlcarousel/
	var owl = $(".carousel");
	owl.owlCarousel({
		items : 4
	});
	owl.on("mousewheel", ".owl-wrapper", function (e) {
		if (e.deltaY > 0) {
			owl.trigger("owl.prev");
		} else {
			owl.trigger("owl.next");
		}
		e.preventDefault();
	});
	$(".next_button").click(function(){
		owl.trigger("owl.next");
	});
	$(".prev_button").click(function(){
		owl.trigger("owl.prev");
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







if (window.matchMedia('(min-width: 992px)').matches) {

// паралакс секций кроме первой
jQuery(document).ready(function(){
	$objWindow = $(window);
	$('section[data-type="background"]').each(function(){
		var $bgObj = $(this);
		$(window).scroll(function() {
			var yPos = -($objWindow.scrollTop() / $bgObj.data('speed'));
			var coords = '100% '+ yPos + 'px';
			$bgObj.css({ backgroundPosition: coords });
		});
	});
});

// паралакс заголовка первой секции
$(window).scroll(function() {

	var st = $(this).scrollTop();

	$(".prlx_text").css({
		"transform" : "translate(0%, " + st /3.4 + "%"
	});

		$(".prlx_text2").css({
		"transform" : "translate(0%, " + st /4.9 + "%"
	});

});

	//Добавляет классы дочерним блокам .block для анимации
	//Документация: http://imakewebthings.com/jquery-waypoints/
	$(".block1").waypoint(function(direction) {
		if (direction === "down") {
			$(".prlx_conten1").addClass("animation");
		} else if (direction === "up") {
			$(".prlx_conten1").removeClass("deanimation");
		};
	}, {offset: 200});

	$(".block2").waypoint(function(direction) {
		if (direction === "down") {
			$(".prlx_conten2").addClass("animation");
		} else if (direction === "up") {
			$(".prlx_conten2").removeClass("deanimation");
		};
	}, {offset: 300});

	$(".block3").waypoint(function(direction) {
		if (direction === "down") {
			$(".prlx_conten3").addClass("animation");
		} else if (direction === "up") {
			$(".prlx_conten3").removeClass("deanimation");
		};
	}, {offset: 300});


}

});
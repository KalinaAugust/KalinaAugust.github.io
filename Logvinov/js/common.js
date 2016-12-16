$(document).ready(function() {

  $('.slider').slick({
  	dots: true,
  	infinite: true,
  	speed: 300,
  	slidesToShow: 1,
  	adaptiveHeight: true,
  	nextArrow: '<img class="img_right" src="../Logvinov/img/arrow-right.png" alt="alt" />',
  	prevArrow: '<img class="img_left" src="../Logvinov/img/arrow-left.png" alt="alt" />'
  });

$('.multiple_slider').slick({
  slidesToShow: 2,
  slidesToScroll: 1,
  autoplay: false,
  customPaging: '30%',
  nextArrow: '<img class="img_right2" src="../Logvinov/img/arrow-right2.png" alt="alt" />',
  prevArrow: '<img class="img_left2" src="../Logvinov/img/arrow-left2.png" alt="alt" />'
});

	//Аякс отправка форм
	//Документация: http://api.jquery.com/jquery.ajax/
	$(".ajax_form").submit(function() {
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

});
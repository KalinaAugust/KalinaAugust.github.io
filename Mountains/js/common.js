$(document).ready(function() {

	//slider 
  $('.slider').slick({
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2500,
  speed: 6000,
  dots: false,
  arrows: false,
});







	// //Плавный скролл до блока .div по клику на .scroll
	// //Документация: https://github.com/flesler/jquery.scrollTo
	// $("a.scroll").click(function() {
	// 	$.scrollTo($(".div"), 800, {
	// 		offset: -90
	// 	});
	// });

});
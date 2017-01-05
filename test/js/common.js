$(document).ready(function() {


  $('.slider').slick({
  	dots: true,
  	infinite: true,
  	speed: 300,
  	centerMode: true,
  	variableWidth: true,
  	slidesToShow: 1,
  	adaptiveHeight: true,
  	nextArrow: '<img class="img_right" src="../test/img/right.png" alt="alt" />',
  	prevArrow: '<img class="img_left" src="../test/img/left.png" alt="alt" />'
  });

});
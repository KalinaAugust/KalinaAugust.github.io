$(document).ready(function () {

    $('.main-page .billboard-slider').slick({
        infinite: true,
        autoplay: true,
        arrows: false,
        speed: 1000,
        fade: true,
        autoplaySpeed: 3000,
        cssEase: 'linear'
    });

    $('.main-page .recommendation-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        centerMode: true,
        nextArrow: '<div class="main-page__next-arrow"></div>',
        prevArrow: '<div class="main-page__prev-arrow"></div>'
    });

    $('.main-page .cafe-slider').slick({
        slidesToShow: 5,
        centerMode: true,
        centerPadding: '80px',
        nextArrow: '<div class="main-page__next-arrow"></div>',
        prevArrow: '<div class="main-page__prev-arrow"></div>'
    });

    $('.main-page .actions-slider').slick({
        slidesToShow: 1,
        infinite: true,
        nextArrow: '<div class="main-page__next-arrow"></div>',
        prevArrow: '<div class="main-page__prev-arrow"></div>'
    });



    // // pop up activator
    // $('.button__pop-up').magnificPopup({
    //     fixedContentPos: true
    // }); //pop-up



    (function addActive() {
        var myURL = window.location.pathname;
        var splitedURL = myURL.split("/");
        var lastURLItem = splitedURL[splitedURL.length - 1];

        var starHref = 'a[href="';
        var endHref = '"]';
        var activePage = $('.nav ' + starHref + lastURLItem + endHref);

        activePage.addClass('active');

    })();


});
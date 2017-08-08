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
        nextArrow: '<div class="main-page__next-arrow"></div>',
        prevArrow: '<div class="main-page__prev-arrow"></div>',
        responsive: [
            {
                breakpoint: 880,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.main-page .cafe-slider').slick({
        slidesToShow: 5,
        centerMode: true,
        centerPadding: '80px',
        nextArrow: '<div class="main-page__next-arrow"></div>',
        prevArrow: '<div class="main-page__prev-arrow"></div>',
        responsive: [
            {
                breakpoint: 1680,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: false
                }
            },
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    centerMode: false
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 560,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: false
                }
            }
        ]
    });

    $('.main-page .actions-slider').slick({
        slidesToShow: 1,
        infinite: true,
        nextArrow: '<div class="main-page__next-arrow"></div>',
        prevArrow: '<div class="main-page__prev-arrow"></div>'
    });


    // mobile menu button
    var menu = $('.mobile-nav');
    var burger = $('.header__burger');
    burger.click(function () {
        menu.toggleClass('open');
        $(this).toggleClass('open');

    });






    // pop up activator
    $('.content-item').magnificPopup({
        fixedContentPos: true
    });



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
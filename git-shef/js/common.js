$(document).ready(function () {

    $('.main-page .first-slider').slick({
        infinite: true,
        autoplay: true,
        arrows: false,
        speed: 700,
        fade: true,
        autoplaySpeed: 2500,
        cssEase: 'linear'
    });


    // nextArrow: '<div class="main-page__next-arrow"></div>',
        // prevArrow: '<div class="main-page__prev-arrow"></div>'

    // // pop up activator
    // $('.button__pop-up').magnificPopup({
    //     fixedContentPos: true
    // }); //pop-up



    // (function addActive() {
    //     var myURL = window.location.pathname;
    //     var splitedURL = myURL.split("/");
    //     var lastURLItem = splitedURL[splitedURL.length - 1];

    //     if ( lastURLItem == "about-us.html") {

    //         $('.header a[href="about-us.html"]').addClass('active');

    //     } else if (lastURLItem == "our-team.html") {

    //         $('.header a[href="our-team.html"]').addClass('active');

    //     } else if (lastURLItem == "examples.html") {

    //         $('.header a[href="examples.html"]').addClass('active');
    //     }


    // })();


});
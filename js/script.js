'use strict';

$(document).ready(function (){
    $("#click").click(function (){
        const to = $(this).attr('data-scroll');
        $('html, body').animate({
            scrollTop: $("#" + to).offset().top
        }, 1000);
    });

    // slider
    $('.utp-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: true
    });

    //popup
    $('.gallery-container').magnificPopup({
        type:'image',
        delegate: 'a',
        gallery: {enabled:true},
    });
});



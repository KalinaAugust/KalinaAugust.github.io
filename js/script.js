'use strict';

$(document).ready(function (){
    $("#click").click(function (){
        const to = $(this).attr('data-scroll');
        $('html, body').animate({
            scrollTop: $("#" + to).offset().top - 100
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

    // send email from contact form
    $("#submit-contact-form").click(function () {
        var name = $("#name").val();
        var email = $("#email").val();
        var phone = $("#phone").val();
        var message = $("#message").val();

        $.ajax({
            url: "mail.php",
            method: "POST",
            data: {
                name: name,
                email: email,
                phone: phone,
                message: message,
            },
            success: function (response) {
                $("#response").html(response);
            }
        });
    });
});



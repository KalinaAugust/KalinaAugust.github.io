'use strict';

$(document).ready(function (){
    $(".click-to-scroll").click(function (){
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
        gallery: { enabled:true },
    });

    // form popup
    $('.open-popup-link').magnificPopup({
        type:'inline',
        closeBtnInside: true,
        midClick: true
    });

    function formsReset() {
        $("#name").val('');
        $("#email").val('');
        $("#phone").val('');
        $("#message").val('');

        $("#cv-name").val('');
        $("#cv-email").val('');
        $("#cv-phone").val('');
        $("#cv-message").val('');
        $("#cv-profession").val('');
    }

    // send email from contact form
    $(".submit-form-button").click(function () {
        var formType = $(this).attr('data-form-type');
        var hasErrors = false;

        var name = '';
        var email = '';
        var phone = '';
        var message = '';
        var profession = '';
        var form = '';

        if (formType === 'main-form') {
            name = $("#name").val().trim();
            email = $("#email").val().trim();
            phone = $("#phone").val().trim();
            message = $("#message").val().trim();
            form = 'Main Form';

            if (name.length < 2) {
                $("#name").addClass('invalid');
                hasErrors = true;
            } else {
                $("#name").removeClass('invalid');
            }

            if (email.length < 2) {
                $("#email").addClass('invalid');
                hasErrors = true;
            } else {
                $("#email").removeClass('invalid');
            }
        } else if (formType === 'cv-form') {
            name = $("#cv-name").val().trim();
            email = $("#cv-email").val().trim();
            phone = $("#cv-phone").val().trim();
            message = $("#cv-message").val().trim();
            profession = $("#cv-profession").val().trim();
            form = 'CV Form';

            if (name.length < 2) {
                $("#cv-name").addClass('invalid');
                hasErrors = true;
            } else {
                $("#cv-name").removeClass('invalid');
            }

            if (email.length < 2) {
                $("#cv-email").addClass('invalid');
                hasErrors = true;
            } else {
                $("#cv-email").removeClass('invalid');
            }
        } else {

        }

        if (hasErrors) return;
        formsReset();

        $.notify(
            "Już wysłane",
            { position: "bottom", className: "success", }
        );

        $.ajax({
            url: "mail.php",
            method: "POST",
            data: {
                name: name,
                email: email,
                phone: phone,
                message: message,
                profession: profession,
                form: form,
            },
            success: function () {

            }
        });
    });
});



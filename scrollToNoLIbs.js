    // scrollTo clean jquery

    $(".to-top").click(function() {
        $('html, body').animate({
            scrollTop: $("#main-form").offset().top -100
        }, 800);
    });
    $( window ).scroll(function() {
        var distantToTop = $(".scroll-top").offset().top;

        if (distantToTop > 1300) {
            $(".scroll-top").removeClass('shifted');
        } else {
            $(".scroll-top").addClass('shifted');
        }
    });
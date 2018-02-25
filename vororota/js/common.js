(function ($) {

    // slider
    $('.examples__slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: true,
        centerMode: false,
        arrows:false,
        responsive: [
            {
                breakpoint: 1200,
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



    var arrItems = document.querySelectorAll(".nav__item");
    function getTop(id) {
        var elem = document.querySelector("#" + id);
        var elemDistTop = elem.getBoundingClientRect().top;
        var navItem = document.querySelector("[data-block="+ id +"]");
        var distant = 100;

        if ( id === 'contacts') {
            distant = 400
        }


        if ( elemDistTop < distant) {
            arrItems.forEach(function (item) {
                item.classList.remove('active');
            });
            navItem.classList.add('active');
        }
    }


    $( window ).scroll(function() {
        getTop('product');
        getTop('examples');
        getTop('moar');
        getTop('contacts');

        var navigationTop = document.querySelector(".nav").getBoundingClientRect().top;

        if ( navigationTop > 100 ) {
            arrItems.forEach(function (item) {
                item.classList.remove('active');
            });
        }
    });


    $(".nav__item").click(function() {

        var thisAtr = this.getAttribute('data-block');

        $('html,body').animate({
            scrollTop: $("#" + thisAtr).offset().top -50
        }, 800);

        $(".nav").removeClass('show');
    });

    $(".header__burger").click(function() {
        $(".nav").toggleClass('show');
    });


    $('.open-popup').magnificPopup({
        type:'inline'
    });

    // $.magnificPopup.open({
    //     items: {
    //         src: '#vorota-spring'
    //     },
    //     type: 'inline'
    // });


}(jQuery));




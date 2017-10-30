$(document).ready(function() {

    var header = $('header.header');
    var menu = $('.header__nav');

    $("body").click(function (event) {
        var target = $( event.target );

        if ( target.is('.burger') ) {

            menu.toggleClass('menu-open');

        } else if ( target.closest(header).hasClass('header')  ) {

            return;

        } else {
            menu.removeClass('menu-open');
        }
    });

});
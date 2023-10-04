'use strict';

$(document).ready(function (){
    $("#click").click(function (){
        const to = $(this).attr('data-scroll');
        $('html, body').animate({
            scrollTop: $("#" + to).offset().top
        }, 1000);
    });
});

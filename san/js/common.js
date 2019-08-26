(function () {
    $(window).scroll(function () {
      var catalogTitle = $(".catalog__title");
      var distantToTop = catalogTitle.offset().top - $(window).scrollTop();

      if (distantToTop > 650) {
        catalogTitle.removeClass('visible');
      } else {
        catalogTitle.addClass('visible');
      }
    });

    $("#go-to-form").click(function () {
      $('html, body').animate({
        scrollTop: $(".callback__form").offset().top - 100
      }, 800);
    });

    $(".header__nav-item").click(function () {
      var target = $(this).data('target');

      $('html, body').animate({
        scrollTop: $("." + target).offset().top
      }, 600);
    });


    // ajax mailer callback
    $(".callback__form").submit(function (e) {
      e.preventDefault();
      $.ajax({
        type: "GET",
        url: "mailer/mail.php",
        data: $(".callback__form").serialize()
      }).done(function () {
        $(".callback__form").find("input[type=text]").val("");
        $.magnificPopup.open({
          items: {
            src: '#form-popup',
            type: 'inline'
          }
        });
      });
      return false;
    });


    // temporal
  $(".catalog__item").click(function () {
    $.magnificPopup.open({
      items: {
        src: '#popup-mixer',
        type: 'inline'
      }
    });
    $('.slick-slider').slick('resize');
  });

    // $(".catalog__item").click(function () {
    //   var id = $(this).attr('id');
    //
    //   $.magnificPopup.open({
    //     items: {
    //       src: '#popup-' + id,
    //       type: 'inline'
    //     }
    //   });
    //   $('.slick-slider').slick('resize');
    // });


    $('.slick-slider').slick({
      infinite: true,
      arrows: false,
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1
    });

$(window).resize(function(){
    $('.slick-slider').slick('resize');
});

$(window).on('orientationchange', function() {
    $('.slick-slider').slick('reinit');
});


}());



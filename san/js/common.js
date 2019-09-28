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
      data:  $(this).serialize()
    }).done(function () {
      $.magnificPopup.open({
        items: {
          src: '#form-popup',
          type: 'inline'
        }
      });
    });
    return false;
  });

  // ajax mailer callback for pop-up
  $(".catalog-popup__form").submit(function (e) {
    e.preventDefault();
    var from = $(this).data('from');

    $.ajax({
      type: "GET",
      url: "mailer/mail.php",
      data:  $(this).serialize() + '&type=' + from
    }).done(function () {
      $.magnificPopup.open({
        items: {
          src: '#form-popup',
          type: 'inline'
        }
      });

      if ($( window ).width() < 670) {
        $('html, body').animate({
          scrollTop: $("#form-popup").offset().top - 150
        }, 800);
      }

    });
    return false;
  });


  $(".catalog__item").click(function () {
    var id = $(this).attr('id');

    $.magnificPopup.open({
      items: {
        src: '#popup-' + id,
        type: 'inline'
      }
    });

    $('#popup-' + id + ' .slick-slider').slick('resize');
  });


  $('.slick-slider').slick({
    infinite: true,
    arrows: false,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1
  });

  $(window).resize(function () {
    $('.slick-slider').slick('resize');
  });

  $(".hamburger--collapse").click(function () {
    $(this).toggleClass('is-active');
    $('.header__nav').toggleClass('show');
    $('body').toggleClass('overflow');
  });

  $(".header__nav-item").click(function () {
    $('.hamburger--collapse').removeClass('is-active');
    $('.header__nav').removeClass('show');
    $('body').removeClass('overflow');
  });

}());



(function () {

var body = document.querySelector('body');


// get previous siblings function
function getPreviousSiblings(el) {
    var siblings = [];
    while (el = el.previousElementSibling) {
        siblings.push(el);
    }
    return siblings;
}


// colored stars
var formStars = document.querySelectorAll('.form-star');
formStars.forEach(function(item) {
    item.onclick = function () {

        formStars.forEach(function(item) {
            item.classList.remove('active');
        });

        item.classList.add('active');

        var sibs = getPreviousSiblings(this);

        sibs.forEach(function (item) {
            item.classList.add('active');
        });
    }
});


// input add class active when he are not empty
var commentInput = document.querySelectorAll('.form__input');
commentInput.forEach(function(item) {
    item.onchange = function () {
        if ( item.value != '' ) {
            this.classList.add('active');
        } else {
            this.classList.remove('active');
        }
    }
});



// mobile menu
var burger     = document.querySelector('.burger');
var header     = document.querySelector('.header');
var mobileDrop = document.querySelector('.drop-mobile__block');
burger.onclick = function () {
    burger.classList.toggle('open');
    header.classList.toggle('open');
    body.classList.toggle('overflow');
    mobileDrop.classList.toggle('show');
};

// mobile menu tab
var mobileTab = document.querySelectorAll('.drop-mobile__tab');
mobileTab.forEach(function(item) {
    item.onclick = function () {
        if ( this.classList.contains('inactive') ) {
            document.querySelector('.drop-mobile__tab_1').classList.toggle('inactive');
            document.querySelector('.drop-mobile__tab_2').classList.toggle('inactive');
            document.querySelector('.drop-mobile__content_1').classList.toggle('hide');
            document.querySelector('.drop-mobile__content_2').classList.toggle('hide');
        } else {
            return;
        }
    }
});

// slider
$('.mobile-slider').slick({
    responsive: [
        {
            breakpoint: 4000,
            settings: "unslick"
        },
        {
            breakpoint: 768,
            settings: {
                infinite: true,
                arrows: false,
                dots: true,
                slidesToShow: 1,
                slidesToScroll: 1
            }
        }
    ]
});

$(window).resize(function(){
    $('.mobile-slider').slick('resize');
});

$(window).on('orientationchange', function() {
    $('.mobile-slider').slick('reinit');
});


// pop-up
var popWrapper  = document.querySelector('.pop-up-wrapper');
var popCloser   = document.querySelector('.pop-up__closer');
var popText     = document.querySelector('.pop-up__text');
var successText = 'Спасибо! Ваш отзыв будет <br> опубликован после модерации.';
var errorText   = 'Извините! Возникла ошибка. <br> Попробуйте позже.';

if (popCloser) {
    popCloser.addEventListener('click', function () {
            body.classList.remove('overflow');
            popWrapper.classList.remove('show');
        }
    );
}

function openPopup(messageType) {
    popWrapper.classList.add('show');
    body.classList.add('overflow');

    if ( messageType === 'success' ) {
        popText.innerHTML = successText;
    } else if ( messageType === 'error' ) {
        popText.innerHTML = errorText;
    }
}

    // openPopup('success'); инициализация поп-апа успешного отправления
    // openPopup('error');  инициализация поп-апа ошибки


// validation
var reviewForm  = document.querySelector('#review-form');
var commentForm = document.querySelector('#comment-form');
var emailRega   = /^\w+@\w+\.\w{2,4}$/i;
var textRega    = /^[\wа-я\sА-Я]{2,300}/;
var orderRega   = /^[0-9]{3,15}/;


    reviewForm.addEventListener('submit', function () {
        event.preventDefault();

        var isValid = true;


        function textValid(elem) {
            if ( textRega.test(elem.value) ) {
                elem.classList.add('ok');
                elem.classList.remove('error');
            } else {
                elem.classList.add('error');
                elem.classList.remove('ok');
                isValid = false;
            }
        }

        // name validation
        textValid(this.name);

        // manager validation
        textValid(this.manager);

        // worktype validation
        textValid(this.worktype);

        // worktype validation
        textValid(this.title);

        // worktype validation
        textValid(this.comment);


        // order number validation
        if ( orderRega.test(this.order.value) ) {
            this.order.classList.add('ok');
            this.order.classList.remove('error');
        } else {
            this.order.classList.add('error');
            this.order.classList.remove('ok');
            isValid = false;
        }


        // email validation
        if ( emailRega.test(this.email.value) ) {
            this.email.classList.add('ok');
            this.email.classList.remove('error');
        } else {
            this.email.classList.add('error');
            this.email.classList.remove('ok');
            isValid = false;
        }


        if ( isValid === false ) {
            openPopup('error');
        } else {
            openPopup('success');
        }
    });


}());














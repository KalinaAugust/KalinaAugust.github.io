$(document).ready(function() {

     var header = $('header.header'); //сам хедер
     var menu = $('.header__menu'); //выподающее меню скрытое по умолчанию

    $("body").click(function (event) {
        var target = $( event.target );

        if ( target.is('.header__burger') ) { // кнопка открытия меню

            menu.toggleClass('menu-open'); // клас добавляющий display block

        } else if ( target.closest(header).hasClass('header')  ) { // возвращает соответствующий родительский дом элемент и проверяет наличие нужного класса

            return

        } else {

            menu.removeClass('menu-open'); // если клик не в зоне меню, закрывает его

        }
    });
});
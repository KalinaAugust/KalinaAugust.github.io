    (function addActive() {
        var myURL = window.location.pathname;
        var splitedURL = myURL.split("/");
        var lastURLItem = splitedURL[splitedURL.length - 1];

        var starHref = 'a[href="';
        var endHref = '"]';
        var activePage = $('.nav ' + starHref + lastURLItem + endHref);

        activePage.addClass('active');

    })();
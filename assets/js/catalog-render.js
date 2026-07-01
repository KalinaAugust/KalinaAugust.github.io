// Flores — общий рендер карточек каталога + лайтбокс.
// Один источник правды: используется на index.html (сетка «Наши букеты»)
// и catalog.html (три сетки разделов).
(function (global) {
  'use strict';

  function escHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function bouquetCardHTML(b) {
    var hasPrice = typeof b.price === 'number';
    var price = hasPrice
      ? '<span class="bouquet-card__price">' + b.price + ' Br</span>' : '';
    var addBtn = hasPrice
      ? '<button type="button" class="btn btn--primary bouquet-card__add" data-name="' +
        escHtml(b.title) + '" data-price="' + b.price + '" data-image="' +
        encodeURI(b.image || '') + '">В корзину</button>'
      : '';
    return '' +
      '<article class="bouquet-card reveal">' +
        '<div class="bouquet-card__media" style="background-image: url(\'' +
          encodeURI(b.image || '') + '\');"></div>' +
        '<div class="bouquet-card__body">' +
          '<h3>' + escHtml(b.title) + '</h3>' +
          '<p>' + escHtml(b.description) + '</p>' +
          price + addBtn +
        '</div>' +
      '</article>';
  }

  // grid — целевая .card-grid; observeReveal — функция подписки на scroll-reveal.
  function renderCatalog(grid, data, observeReveal) {
    var all = Array.isArray(data) ? data : (data && data.items ? data.items : []);
    var visible = all.filter(function (b) { return b.available !== false; });
    grid.innerHTML = visible.map(bouquetCardHTML).join('');
    if (typeof observeReveal === 'function') {
      grid.querySelectorAll('.reveal').forEach(observeReveal);
    }
    if (global.FloresCart) global.FloresCart.updateUI();
  }

  // Лайтбокс через делегирование — работает и для динамических карточек.
  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    var lightboxImg = document.getElementById('lightbox-img');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var overlay = lightbox.querySelector('.lightbox__overlay');

    document.addEventListener('click', function (e) {
      var media = e.target.closest('.bouquet-card__media');
      if (!media) return;
      var m = media.style.backgroundImage.match(/url\(['"]?(.*?)['"]?\)/);
      if (m && m[1]) {
        lightboxImg.src = m[1];
        lightbox.classList.add('is-open');
      }
    });

    function close() { lightbox.classList.remove('is-open'); }
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (overlay) overlay.addEventListener('click', close);
  }

  global.FloresCatalog = {
    escHtml: escHtml,
    bouquetCardHTML: bouquetCardHTML,
    renderCatalog: renderCatalog,
    initLightbox: initLightbox
  };
})(window);

// assets/js/cart.js — shared shopping-cart core for Flores (no build step)
(function () {
  'use strict';
  var STORAGE_KEY = 'cart';

  function cartRead() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  function cartWrite(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function cartCount(cart) {
    return (cart || cartRead()).reduce(function (sum, item) {
      return sum + (Number(item.quantity) || 0);
    }, 0);
  }

  function cartAdd(name, price, image) {
    var p = Number(price);
    if (!name || isNaN(p)) return;
    var cart = cartRead();
    var existing = cart.find(function (item) { return item.name === name; });
    if (existing) {
      existing.quantity += 1;
      if (image) existing.image = image;
    } else {
      cart.push({ name: name, price: p, quantity: 1, image: image });
    }
    cartWrite(cart);
    updateCartUI();
  }

  function updateCartUI() {
    updateCartBadge();
    updateCartButtons();
  }

  function updateCartBadge() {
    var badge = document.querySelector('.cart-badge');
    if (!badge) return;
    var count = cartCount();
    if (count > 0) {
      badge.textContent = count;
      badge.removeAttribute('hidden');
    } else {
      badge.setAttribute('hidden', '');
    }
  }

  function updateCartButtons() {
    var buttons = document.querySelectorAll('.bouquet-card__add');
    var cart = cartRead();
    var namesInCart = {};
    cart.forEach(function(item) { namesInCart[item.name] = true; });

    buttons.forEach(function(btn) {
      if (namesInCart[btn.dataset.name]) {
        btn.textContent = 'В корзине';
        btn.classList.remove('btn--primary');
        btn.classList.add('btn--ghost', 'is-in-cart');
      } else {
        btn.textContent = 'В корзину';
        btn.classList.remove('btn--ghost', 'is-in-cart');
        btn.classList.add('btn--primary');
      }
    });
  }

  // Delegated "add to cart" for catalog cards (works for static & dynamic cards)
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.bouquet-card__add');
    if (!btn) return;

    // If it's already in the cart, redirect to checkout
    if (btn.classList.contains('is-in-cart')) {
      window.location.href = 'checkout.html';
      return;
    }

    cartAdd(btn.dataset.name, btn.dataset.price, btn.dataset.image);

    // Trigger pop animation on badge
    var badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.classList.remove('is-animating');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('is-animating');
    }
  });

  document.addEventListener('DOMContentLoaded', updateCartUI);

  window.FloresCart = {
    read: cartRead,
    write: cartWrite,
    count: cartCount,
    add: cartAdd,
    updateUI: updateCartUI,
    updateBadge: updateCartBadge
  };
})();

// Flores — единый форматтер/валидатор телефонов для лендинга и checkout.
// Один источник правды: подключается в index.html и checkout.html.
// Международные (+375…, +7…, +380…) и местные префиксы
// (8 0XX… → BY, 8 XXX… → RU, 0XX… → BY).
(function (global) {
  'use strict';

  // Шаблоны группировки национальной части по коду страны.
  // groups — длины групп цифр, seps — разделители перед каждой группой.
  // Пример BY: +375 (29) 304-62-27 ; RU: +7 (912) 345-67-89
  var PHONE_TEMPLATES = {
    '375': { groups: [2, 3, 2, 2], seps: [' (', ') ', '-', '-'] },
    '380': { groups: [2, 3, 2, 2], seps: [' (', ') ', '-', '-'] },
    '7':   { groups: [3, 3, 2, 2], seps: [' (', ') ', '-', '-'] }
  };
  var KNOWN_CODES = ['375', '380', '7']; // от длинного к короткому

  // Разбираем сырой ввод на код страны + национальную часть.
  function splitPhone(raw) {
    var s = String(raw == null ? '' : raw);
    var hasPlus = /^\s*\+/.test(s);
    var d = s.replace(/\D/g, '').slice(0, 15);
    if (!d) return { hasPlus: hasPlus, code: null, national: '' };
    if (!hasPlus) {
      if (d.indexOf('80') === 0) return { hasPlus: hasPlus, code: '375', national: d.slice(2) };
      if (d.charAt(0) === '8')   return { hasPlus: hasPlus, code: '7',   national: d.slice(1) };
      if (d.charAt(0) === '0')   return { hasPlus: hasPlus, code: '375', national: d.slice(1) };
    }
    for (var i = 0; i < KNOWN_CODES.length; i++) {
      if (d.indexOf(KNOWN_CODES[i]) === 0) {
        return { hasPlus: hasPlus, code: KNOWN_CODES[i], national: d.slice(KNOWN_CODES[i].length) };
      }
    }
    return { hasPlus: hasPlus, code: null, national: d };
  }

  // Форматируем по мере ввода: добавляем «+», пробелы и скобки.
  function formatPhone(raw) {
    var p = splitPhone(raw);
    if (!p.code && !p.national) return p.hasPlus ? '+' : '';
    if (!p.code) {
      // неизвестный код — просто группируем по 3 цифры
      var g = p.national.match(/.{1,3}/g);
      return '+' + (g ? g.join(' ') : '');
    }
    var tpl = PHONE_TEMPLATES[p.code];
    var out = '+' + p.code;
    var rest = p.national;
    if (!tpl) {
      var gg = rest.match(/.{1,3}/g);
      return out + (rest ? ' ' + gg.join(' ') : '');
    }
    var idx = 0;
    for (var j = 0; j < tpl.groups.length && idx < rest.length; j++) {
      out += tpl.seps[j] + rest.substr(idx, tpl.groups[j]);
      idx += tpl.groups[j];
    }
    if (idx < rest.length) out += rest.substr(idx); // лишние цифры
    return out;
  }

  // Валидность: BY — 9 цифр (код 1–4), RU/KZ — 10, UA — 9,
  // прочие страны — суммарно 8–15 цифр (E.164).
  function isValidPhone(raw) {
    var p = splitPhone(raw);
    var n = p.national;
    if (p.code === '375') return /^[1-4]\d{8}$/.test(n);
    if (p.code === '7')   return /^\d{10}$/.test(n);
    if (p.code === '380') return /^\d{9}$/.test(n);
    var total = (p.code ? p.code.length : 0) + n.length;
    return n.length >= 4 && total >= 8 && total <= 15;
  }

  global.FloresPhone = {
    split: splitPhone,
    format: formatPhone,
    isValid: isValidPhone
  };
})(window);

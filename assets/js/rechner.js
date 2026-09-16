/* Entlastungs-Rechner (Briefing A8): rechnet ausschließlich in Zeit.
   Keine Euro-Beträge, keine Datenübertragung, kein Tracking der Eingaben –
   die Werte gehen nur als URL-Parameter mit, wenn der Nutzer auf den Button klickt. */
(function () {
  'use strict';

  function fmt(n) {
    var r = Math.round(n * 10) / 10;
    return r.toLocaleString('de-DE', { maximumFractionDigits: 1 });
  }

  function clamp(input, value) {
    var min = parseFloat(input.min);
    var max = parseFloat(input.max);
    if (!isNaN(min) && value < min) value = min;
    if (!isNaN(max) && value > max) value = max;
    return value;
  }

  function parse(input, fallback) {
    var v = parseFloat(String(input.value).replace(',', '.'));
    return isNaN(v) ? fallback : clamp(input, v);
  }

  document.querySelectorAll('[data-rechner]').forEach(function (box) {
    var fields = {};
    box.querySelectorAll('[data-field]').forEach(function (f) {
      fields[f.getAttribute('data-field')] = {
        range: f.querySelector('input[type="range"]'),
        number: f.querySelector('input[type="number"]')
      };
    });

    function read(key) {
      var f = fields[key];
      return parse(f.number, parseFloat(f.range.value));
    }

    function out(name, text) {
      box.querySelectorAll('[data-out="' + name + '"]').forEach(function (el) { el.textContent = text; });
    }

    function update() {
      var anrufe = read('anrufe');
      var dauer = read('dauer');
      var tage = read('tage');
      var anteil = read('anteil');

      var telefonMinuten = anrufe * dauer * tage;
      var agentMinuten = telefonMinuten * anteil / 100;
      var stundenMonat = agentMinuten / 60;
      var stundenWoche = tage > 0 ? stundenMonat / (tage / 5) : 0;
      var unterbrechungen = Math.round(anrufe * anteil / 100);

      out('h-monat', fmt(stundenMonat));
      out('h-woche', fmt(stundenWoche));
      out('unterbrechungen', String(unterbrechungen));

      var link = box.querySelector('[data-out-link]');
      if (link) {
        var params = new URLSearchParams({
          branche: box.getAttribute('data-branche') || '',
          anrufe: String(anrufe),
          dauer: String(dauer),
          tage: String(tage),
          anteil: String(anteil),
          stunden_monat: fmt(stundenMonat)
        });
        link.setAttribute('href', 'termin.html?' + params.toString());
      }
    }

    Object.keys(fields).forEach(function (key) {
      var f = fields[key];
      f.range.addEventListener('input', function () {
        f.number.value = f.range.value;
        update();
      });
      f.number.addEventListener('input', function () {
        f.range.value = String(parse(f.number, parseFloat(f.range.value)));
        update();
      });
      f.number.addEventListener('change', function () {
        f.number.value = String(parse(f.number, parseFloat(f.range.value)));
        update();
      });
    });

    update();
  });
})();

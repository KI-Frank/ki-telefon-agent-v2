/* KI Telefon-Agent — Interaktionen & Animationen */
(function () {
  'use strict';

  /* ---------- Nav: Blur + Schatten beim Scrollen ---------- */
  var nav = document.querySelector('.nav');
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- Mobile-Menü ---------- */
  var burger = document.querySelector('.burger');
  var mobileMenu = document.querySelector('.mobile-menu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Rotierende Hero-Headline ---------- */
  var rotator = document.querySelector('.rotator');
  if (rotator) {
    var words = rotator.querySelectorAll('span');
    var idx = 0;
    /* Höhe auf die längste Variante fixieren, damit nichts überlappt/springt */
    function sizeRotator() {
      var max = 0;
      words.forEach(function (w) {
        var prev = w.style.cssText;
        w.style.cssText = 'position:static;visibility:hidden;display:block;transition:none';
        max = Math.max(max, w.offsetHeight);
        w.style.cssText = prev;
      });
      if (max) rotator.style.minHeight = max + 'px';
    }
    sizeRotator();
    window.addEventListener('resize', sizeRotator);
    if (words.length > 1) {
      setInterval(function () {
        words[idx].classList.remove('on');
        idx = (idx + 1) % words.length;
        words[idx].classList.add('on');
      }, 3400);
    }
  }

  /* ---------- Scroll-Reveal (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      /* Bereits sichtbare Elemente sofort zeigen (kein Blank-Flash bei Anker-Links/Reload mitten auf der Seite) */
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        el.style.transition = 'none';
        el.classList.add('in');
        void el.offsetWidth;
        el.style.transition = '';
      } else {
        io.observe(el);
      }
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Timeline-Beam (wächst mit Scroll) ---------- */
  var beam = document.querySelector('.tl-beam');
  var timeline = document.querySelector('.timeline');
  if (beam && timeline) {
    function updateBeam() {
      var rect = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh * 0.6 - rect.top) / rect.height;
      progress = Math.max(0, Math.min(1, progress));
      beam.style.height = (progress * 100) + '%';
    }
    window.addEventListener('scroll', updateBeam, { passive: true });
    updateBeam();
  }

  /* ---------- Zahlen-Counter ---------- */
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = (String(target).split('.')[1] || '').length;
        var start = null;
        var finalText = target.toFixed(decimals) + suffix;
        var done = false;
        function finish() { if (!done) { done = true; el.textContent = finalText; } }
        function tick(ts) {
          if (done) return;
          if (!start) start = ts;
          var p = Math.min(1, (ts - start) / 1400);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(tick); else finish();
        }
        requestAnimationFrame(tick);
        /* Sicherheits-Fallback: falls rAF gedrosselt wird (Tab im Hintergrund),
           steht am Ende garantiert der korrekte Zielwert – nie eine falsche Teilzahl. */
        setTimeout(finish, 1700);
        cio.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Tabs (Use-Cases etc.) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(function (wrap) {
    var btns = wrap.querySelectorAll('.tab-btn');
    var panes = wrap.querySelectorAll('.tab-pane');
    btns.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        btns.forEach(function (b) { b.classList.remove('on'); });
        panes.forEach(function (p) { p.classList.remove('on'); });
        btn.classList.add('on');
        if (panes[i]) panes[i].classList.add('on');
      });
    });
  });

  /* ---------- Marquee: Tracks für Endlos-Loop duplizieren ---------- */
  document.querySelectorAll('.logo-track, .lang-track').forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  /* ---------- FAQ: jeweils nur ein Item offen ---------- */
  document.querySelectorAll('.faq').forEach(function (faq) {
    faq.querySelectorAll('details').forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (d.open) {
          faq.querySelectorAll('details[open]').forEach(function (o) {
            if (o !== d) o.open = false;
          });
        }
      });
    });
  });

  /* ---------- Testanruf-Formular ---------- */
  window.submitForm = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    /* TODO: Endpoint anbinden (z. B. LeadConnector/Make-Webhook), sobald vom Kunden bereitgestellt. */
    form.style.display = 'none';
    var success = document.getElementById('formSuccess');
    if (success) success.classList.add('on');
    return false;
  };

  /* ---------- Cookie-Banner ---------- */
  var banner = document.getElementById('cookieBanner');
  if (banner) {
    var consent = null;
    try { consent = localStorage.getItem('kta-consent'); } catch (e) {}
    if (!consent) banner.classList.add('on');
    window.cookieChoice = function (accept) {
      try { localStorage.setItem('kta-consent', accept ? 'all' : 'essential'); } catch (e) {}
      banner.classList.remove('on');
      if (accept) loadTracking();
    };
    if (consent === 'all') loadTracking();
  }
  function loadTracking() {
    /* Tracking-IDs vom Kunden übernehmen (GA4, Meta-Pixel, MS Clarity) — bewusst erst nach Consent geladen. */
  }

  /* ---------- Aktiven Nav-Link markieren (Desktop + Mobile-Menü) ---------- */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[href], .mobile-menu a[href], .nav-drop-menu a[href]').forEach(function (a) {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---------- Blog: Lesefortschritt-Balken ---------- */
  var rp = document.querySelector('.reading-progress');
  if (rp) {
    var onRP = function () {
      var el = document.scrollingElement || document.documentElement;
      var max = el.scrollHeight - el.clientHeight;
      rp.style.width = (max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0) + '%';
    };
    window.addEventListener('scroll', onRP, { passive: true });
    onRP();
  }

  /* ---------- Blog: Inhaltsverzeichnis Scrollspy + Smooth-Scroll ---------- */
  var tocLinks = document.querySelectorAll('.toc a[href^="#"]');
  if (tocLinks.length) {
    tocLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(a.getAttribute('href').slice(1));
        if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + (document.scrollingElement || document.documentElement).scrollTop - 80, behavior: 'smooth' }); }
      });
    });
    var heads = [].map.call(tocLinks, function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
    if ('IntersectionObserver' in window && heads.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id); });
          }
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      heads.forEach(function (h) { spy.observe(h); });
    }
  }

  /* ---------- Blog: Kategorie-Filter ---------- */
  document.querySelectorAll('.blog-filter').forEach(function (bar) {
    var btns = bar.querySelectorAll('.filter-btn');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        btns.forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        var cat = b.getAttribute('data-cat');
        document.querySelectorAll('.blog-grid .blog-card').forEach(function (card) {
          card.classList.toggle('hide', cat !== 'alle' && card.getAttribute('data-cat') !== cat);
        });
      });
    });
  });

  /* ---------- Kundenstimmen-Slider ---------- */
  document.querySelectorAll('.testi-slider-wrap').forEach(function (wrap) {
    var track = wrap.querySelector('.testi-slider');
    var dotsBox = wrap.querySelector('.slider-dots');
    var prev = wrap.querySelector('[data-slide="prev"]');
    var next = wrap.querySelector('[data-slide="next"]');
    if (!track) return;
    var slides = [].slice.call(track.children);
    if (!slides.length) return;

    /* Wie viele Karten passen gleichzeitig? -> Anzahl der Seiten */
    function perView() {
      var w = slides[0].getBoundingClientRect().width + 22;
      return Math.max(1, Math.round(track.clientWidth / w));
    }
    function pages() { return Math.max(1, slides.length - perView() + 1); }

    /* Dots aufbauen (bei Resize neu) */
    var dots = [];
    function buildDots() {
      if (!dotsBox) return;
      /* Passen alle Stimmen nebeneinander, braucht es keine Navigation */
      var nav = wrap.querySelector('.slider-nav');
      if (nav) nav.style.display = pages() <= 1 ? 'none' : '';
      dotsBox.innerHTML = '';
      dots = [];
      for (var i = 0; i < pages(); i++) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Kundenstimme ' + (i + 1));
        (function (idx) { b.addEventListener('click', function () { go(idx); }); })(i);
        dotsBox.appendChild(b);
        dots.push(b);
      }
      syncDots();
    }
    function current() {
      var w = slides[0].getBoundingClientRect().width + 22;
      return Math.round(track.scrollLeft / w);
    }
    function syncDots() {
      var c = current();
      dots.forEach(function (d, i) { d.classList.toggle('on', i === c); });
    }
    /* Eigene Scroll-Animation: unabhängig von scroll-behavior/Snap-Eigenheiten des Browsers */
    var anim = null;
    function go(i) {
      var w = slides[0].getBoundingClientRect().width + 22;
      var to = Math.max(0, Math.min(i * w, track.scrollWidth - track.clientWidth));
      var from = track.scrollLeft;
      if (Math.abs(to - from) < 1) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { track.scrollLeft = to; syncDots(); return; }
      if (anim) cancelAnimationFrame(anim);
      var snap = track.style.scrollSnapType;
      track.style.scrollSnapType = 'none';   /* Snap würde die Animation zurückziehen */
      var start = null, dur = 420;
      function frame(ts) {
        if (start === null) start = ts;
        var p = Math.min(1, (ts - start) / dur);
        var eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        track.scrollLeft = from + (to - from) * eased;
        if (p < 1) { anim = requestAnimationFrame(frame); }
        else { anim = null; track.style.scrollSnapType = snap; syncDots(); }
      }
      anim = requestAnimationFrame(frame);
    }
    function step(dir) {
      var c = current() + dir;
      if (c < 0) c = pages() - 1;
      if (c > pages() - 1) c = 0;
      go(c);
    }

    if (prev) prev.addEventListener('click', function () { step(-1); paused = true; });
    if (next) next.addEventListener('click', function () { step(1); paused = true; });
    track.addEventListener('scroll', syncDots, { passive: true });
    window.addEventListener('resize', buildDots);
    /* Wird die Seite in einem Hintergrund-Tab geladen, steht die Breite noch nicht fest
       -> Dots später neu berechnen, sobald Layout/Sichtbarkeit stehen. */
    window.addEventListener('load', buildDots);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) buildDots(); });
    buildDots();

    /* Auto-Play – pausiert bei Hover, Touch und wenn die Sektion nicht sichtbar ist */
    var paused = false, visible = true;
    wrap.addEventListener('mouseenter', function () { paused = true; });
    wrap.addEventListener('mouseleave', function () { paused = false; });
    track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }, { threshold: 0.2 })
        .observe(wrap);
    }
    setInterval(function () {
      if (!paused && visible && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) step(1);
    }, 5000);
  });
})();

// mobile nav
const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (btn && nav) {
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
}

// header shadow after scroll
const head = document.querySelector('.site-head');
if (head) {
  const onScroll = () => head.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// scroll reveal ar staggered kavējumu (elementi slēpti caur CSS, kad .js uzlikts <head>)
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SEL = '.hero .wrap > div:first-child > *, .hero-figure, .section > .wrap > *:not(.cards):not(.office-gallery), .cards > .card, .office-gallery > .fig, .cta-strip .wrap > *';
  var els = Array.prototype.slice.call(document.querySelectorAll(SEL));
  if (reduce) { els.forEach(function (el) { el.classList.add('in'); }); return; }
  els.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) { return c.matches(SEL); });
    var i = sibs.indexOf(el);
    var d = Math.min(i, 6) * 70;
    if (el.classList.contains('hero-figure')) d = 150;
    el.style.transitionDelay = d + 'ms';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

// lightbox — klikšķini uz jebkuru .zoomable attēlu, lai palielinātu
(function () {
  var imgs = document.querySelectorAll('img.zoomable');
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lightbox__close" type="button" aria-label="Aizvērt">×</button><img alt="">';
  document.body.appendChild(box);
  var big = box.querySelector('img');
  var closeBtn = box.querySelector('.lightbox__close');
  var lastFocus = null;

  function open(src, alt) {
    lastFocus = document.activeElement;
    big.src = src; big.alt = alt || '';
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) { try { lastFocus.focus(); } catch (e) {} }
  }
  Array.prototype.forEach.call(imgs, function (im) {
    im.addEventListener('click', function () { open(im.currentSrc || im.src, im.alt); });
  });
  box.addEventListener('click', function (e) { if (e.target === box || e.target === big || e.target === closeBtn) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
})();

// contact form (Web3Forms — bez backend)
const cform = document.getElementById('contactForm');
if (cform) {
  const statusEl = cform.querySelector('.form-status');
  const submitBtn = cform.querySelector('[type="submit"]');
  const ru = document.documentElement.lang === 'ru';
  const T = ru ? {
    sending: 'Отправка…',
    ok: 'Спасибо! Заявка отправлена, скоро свяжусь с вами.',
    err: 'Не удалось отправить. Попробуйте ещё раз или напишите на juris@zuitins.lv'
  } : {
    sending: 'Sūta…',
    ok: 'Paldies! Pieteikums nosūtīts, atbildēšu drīz.',
    err: 'Neizdevās nosūtīt. Mēģiniet vēlreiz vai rakstiet uz juris@zuitins.lv'
  };
  cform.addEventListener('submit', (e) => {
    e.preventDefault();
    if (statusEl) { statusEl.textContent = T.sending; statusEl.className = 'form-status is-sending'; }
    if (submitBtn) submitBtn.disabled = true;
    fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(cform) })
      .then(r => r.json())
      .then(json => {
        if (json && json.success) {
          if (statusEl) { statusEl.textContent = T.ok; statusEl.className = 'form-status is-ok'; }
          cform.reset();
        } else {
          throw new Error((json && json.message) || 'error');
        }
      })
      .catch(() => {
        if (statusEl) { statusEl.textContent = T.err; statusEl.className = 'form-status is-err'; }
      })
      .finally(() => { if (submitBtn) submitBtn.disabled = false; });
  });
}

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

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

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

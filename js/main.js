/* APH DRONE — main.js  |  Chargé en fin de body sur toutes les pages */
document.addEventListener('DOMContentLoaded', () => {

  // ── Burger mobile ─────────────────────────────────────────────────────────
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mainNav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
      burger.classList.toggle('open');
    });
  }

  // ── Dropdowns mobile (niveau 1) ──────────────────────────────────────────
  document.querySelectorAll('.has-dropdown > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });

  // ── Sous-menus mobile (niveau 2) ─────────────────────────────────────────
  document.querySelectorAll('.has-submenu > a').forEach(a => {
    a.addEventListener('click', e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        a.parentElement.classList.toggle('open');
      }
    });
  });

  // ── Compteurs animés ─────────────────────────────────────────────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, target = +el.dataset.target, dur = 1400;
        let start = null;
        requestAnimationFrame(function tick(ts) {
          if (!start) start = ts;
          const p = Math.min((ts - start) / dur, 1);
          el.textContent = Math.floor(p * target);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = target;
        });
        obs.unobserve(el);
      }
    });
  }, { threshold: .5 });
  document.querySelectorAll('.count').forEach(el => obs.observe(el));

  // ── Scroll reveal ────────────────────────────────────────────────────────
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity  = '1';
        e.target.style.transform = 'translateY(0)';
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.why-card,.card,.actu-card,.reussite-item,.stat-item,.page-card').forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .45s ease ${i * .05}s, transform .45s ease ${i * .05}s`;
    revObs.observe(el);
  });

  // ── Cookie banner ────────────────────────────────────────────────────────
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    if (!localStorage.getItem('aph_cookie'))
      setTimeout(() => banner.classList.add('visible'), 1500);
    document.getElementById('cookieOk')?.addEventListener('click', () => {
      localStorage.setItem('aph_cookie', 'ok');
      banner.classList.remove('visible');
    });
    document.getElementById('cookieNo')?.addEventListener('click', () => {
      localStorage.setItem('aph_cookie', 'no');
      banner.classList.remove('visible');
    });
  }

  // ── Slider témoignages (si présent) ──────────────────────────────────────
  const track  = document.getElementById('temoTrack');
  const dotsEl = document.getElementById('temoDots');
  const cards  = track?.querySelectorAll('.temo-card');
  let cur = 0;
  if (cards?.length) {
    cards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'temo-dot' + (i === 0 ? ' active' : '');
      d.onclick = () => go(i);
      dotsEl.appendChild(d);
    });
    const go = i => {
      cur = (i + cards.length) % cards.length;
      track.style.transform = `translateX(-${cur * 100}%)`;
      dotsEl.querySelectorAll('.temo-dot').forEach((d, j) => d.classList.toggle('active', j === cur));
    };
    document.getElementById('temoPrev')?.addEventListener('click', () => go(cur - 1));
    document.getElementById('temoNext')?.addEventListener('click', () => go(cur + 1));
    setInterval(() => go(cur + 1), 5000);
  }

  // ── Barre de progression scroll horizontal (cartes) ───────────────────────
  function initScrollBar(wrapId, barId) {
    const wrap = document.getElementById(wrapId);
    const bar  = document.getElementById(barId);
    if (!wrap || !bar) return;
    wrap.addEventListener('scroll', () => {
      const max = wrap.scrollWidth - wrap.clientWidth;
      bar.style.width = (max > 0 ? Math.min((wrap.scrollLeft / max) * 75 + 25, 100) : 25) + '%';
    });
    let isDown = false, startX, scrollLeft;
    wrap.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - wrap.offsetLeft; scrollLeft = wrap.scrollLeft; wrap.style.cursor = 'grabbing'; });
    wrap.addEventListener('mouseleave', ()  => { isDown = false; wrap.style.cursor = 'grab'; });
    wrap.addEventListener('mouseup',    ()  => { isDown = false; wrap.style.cursor = 'grab'; });
    wrap.addEventListener('mousemove',  e  => { if (!isDown) return; e.preventDefault(); wrap.scrollLeft = scrollLeft - (e.pageX - wrap.offsetLeft - startX); });
  }
  initScrollBar('wrapPrest', 'barPrest');
  initScrollBar('wrapForm',  'barForm');

});

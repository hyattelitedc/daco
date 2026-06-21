// ===== DACO modern site interactions =====
(function () {
  // sticky header shadow
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // mobile menu
  const burger = document.getElementById('burger');
  const menu = document.getElementById('menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
  });
  menu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('open');
    })
  );

  // scroll reveal
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 60 + 'ms';
    io.observe(el);
  });

  // animated counters
  const animate = (el) => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const isYear = target > 1900;
    const dur = 1400;
    const start = performance.now();
    const from = isYear ? target - 60 : 0;
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(from + (target - from) * eased);
      el.textContent = val + (p === 1 ? suffix : '');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const co = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animate(e.target);
          co.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

  // contact form -> compose WhatsApp message
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('msg').value.trim();
    const text =
      `*رسالة جديدة من موقع داكو*%0A` +
      `الاسم: ${name}%0A` +
      `الهاتف: ${phone}%0A` +
      (email ? `البريد: ${email}%0A` : '') +
      `الرسالة: ${msg}`;
    note.classList.add('show');
    setTimeout(() => {
      window.open(`https://wa.me/201140804008?text=${text}`, '_blank');
    }, 600);
    form.reset();
  });

  // footer year
  document.getElementById('year').textContent = new Date().getFullYear();
})();

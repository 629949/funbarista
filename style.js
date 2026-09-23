(() => {
  'use strict';
  // The page stays visible if AOS cannot load or motion is disabled.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let aosReady = false;
  const refreshReveals = () => { if (aosReady) requestAnimationFrame(() => window.AOS.refresh()); };
  const initReveals = () => {
    if (aosReady || reducedMotion.matches || !window.AOS) return;
    const groups = [
      ['.hero-copy > *, .page-intro > *, .application-intro > *', 'fade-up', 50],
      ['.hero-visual', 'fade', 0],
      ['.section-heading, .section-intro, .story-photo, .story-copy, .finder-inner > *, .faq-section > div, .cta-section, .schedule-section > *, .form-wrapper', 'fade-up', 0],
      ['.course-grid > article, .experience-grid > article', 'fade-up', 100]
    ];
    groups.forEach(([selector, animation, stagger]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.dataset.aos = animation;
        element.dataset.aosDelay = String((index % 3) * stagger);
      });
    });
    try {
      document.documentElement.classList.add('aos-enabled');
      window.AOS.init({ duration: 650, easing: 'ease-out-cubic', offset: 45, once: true, mirror: false, disableMutationObserver: true });
      aosReady = true;
      refreshReveals();
    } catch (error) {
      document.documentElement.classList.remove('aos-enabled');
    }
  };
  initReveals();
  window.addEventListener('load', refreshReveals, { once: true });
  if (document.fonts) document.fonts.ready.then(refreshReveals);
  document.querySelectorAll('img[loading="lazy"]').forEach(img => img.addEventListener('load', refreshReveals, { once: true }));
  // Keyboard users should never have to wait for content to appear.
  document.addEventListener('focusin', event => {
    let element = event.target.closest('[data-aos]');
    while (element) {
      element.classList.add('aos-animate');
      element = element.parentElement.closest('[data-aos]');
    }
  });

  // Animate intrinsic heights, including closing and quick direction changes.
  const settleDisclosures = [];
  document.querySelectorAll('details').forEach(details => {
    const summary = details.querySelector('summary');
    const content = details.querySelector('.disclosure-content');
    if (!summary || !content || !details.animate) return;
    let animation;
    let expanded = details.open;
    const syncState = () => {
      details.dataset.expanded = String(expanded);
      summary.setAttribute('aria-expanded', String(expanded));
      content.inert = !expanded;
    };
    const settle = () => {
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      details.open = expanded;
      details.style.height = '';
      details.style.overflow = '';
      syncState();
      refreshReveals();
    };
    syncState();
    settleDisclosures.push(settle);
    summary.addEventListener('click', event => {
      event.preventDefault();
      const from = details.getBoundingClientRect().height;
      expanded = !expanded;
      syncState();
      if (reducedMotion.matches) { settle(); return; }
      if (animation) { animation.onfinish = null; animation.cancel(); }
      details.open = true;
      details.style.height = '';
      const to = expanded ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + 1;
      details.style.overflow = 'hidden';
      details.style.height = `${from}px`;
      animation = details.animate([{ height: `${from}px` }, { height: `${to}px` }], {
        duration: 320, easing: 'cubic-bezier(.22, 1, .36, 1)'
      });
      animation.onfinish = settle;
    });
  });
  window.addEventListener('resize', () => settleDisclosures.forEach(settle => settle()));
  reducedMotion.addEventListener('change', () => {
    settleDisclosures.forEach(settle => settle());
    if (!reducedMotion.matches) initReveals();
  });

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  const closeMenu = (focus = false) => {
    nav.classList.remove('is-open');
    nav.inert = matchMedia('(max-width: 1100px)').matches;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    if (focus) toggle.focus();
  };
  nav.inert = matchMedia('(max-width: 1100px)').matches;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    nav.inert = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) closeMenu(true); });
  document.addEventListener('focusin', e => { if (!e.target.closest('.site-header')) closeMenu(); });
  matchMedia('(min-width: 1101px)').addEventListener('change', () => closeMenu());
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    document.querySelectorAll('[data-category]').forEach(card => {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visible++;
    });
    refreshReveals();
    document.querySelector('#filter-status').textContent = `${visible} ${visible === 1 ? 'course' : 'courses'} shown`;
  }));
  const goal = document.querySelector('#course-goal');
  if (goal) goal.addEventListener('change', () => {
    const recommendations = { beginner: ['Barista Essentials', 'A practical, three-week introduction.'], career: ['Full Programme', 'Build your professional skills over six weeks.'], art: ['Latte Art Intensive', 'Two days to focus on your pour.'], business: ['Roasting & Wholesale Intro', 'Explore the business beyond the cup in one week.'] };
    const result = document.querySelector('#course-result');
    const recommendation = recommendations[goal.value];
    result.replaceChildren();
    if (!recommendation) { result.textContent = 'A little curiosity is all you need to begin.'; return; }
    const link = document.createElement('a');
    link.href = 'src/ApplicationForm/Application.html?course=' + encodeURIComponent(recommendation[0]);
    link.textContent = recommendation[0] + ' ↗';
    result.append(link, document.createElement('br'), recommendation[1]);
    refreshReveals();
  });
  const form = document.querySelector('#admissionForm');
  if (form) {
    const course = new URLSearchParams(location.search).get('course');
    if ([...form.elements.course.options].some(option => option.value === course)) form.elements.course.value = course;
    const status = document.querySelector('#formStatus');
    const options = document.querySelector('#send-options');
    form.addEventListener('input', () => { options.hidden = true; status.textContent = ''; });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      for (const name of ['firstName', 'lastName', 'phone']) {
        if (!data.get(name).trim()) { status.textContent = 'Please complete all required fields.'; form.elements[name].focus(); return; }
      }
      const message = `Hello FunBarista Academy! I'd like to enquire about joining.\n\nName: ${data.get('firstName').trim()} ${data.get('lastName').trim()}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')}\nCourse: ${data.get('course')}\nSession: ${data.get('session')}\nLearning goals: ${data.get('message') || 'Happy to discuss.'}\n\nPlease let me know about availability and the next steps.`;
      document.querySelector('#send-whatsapp').href = 'https://wa.me/256702942503?text=' + encodeURIComponent(message);
      document.querySelector('#send-email').href = 'mailto:funbaristaacademy@gmail.com?subject=' + encodeURIComponent('Course enquiry: ' + data.get('course')) + '&body=' + encodeURIComponent(message);
      status.textContent = 'Your enquiry is ready. Choose an app below, then press send there to contact the academy. Nothing has been sent yet.';
      options.hidden = false;
      refreshReveals();
    });
  }
})();

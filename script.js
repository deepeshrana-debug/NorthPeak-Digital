// NorthPeak Digital — site interactions
// 1) Mobile nav toggle  2) Contact form client-side validation

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    var focusableSelector = 'a[href], button:not([disabled])';
    var lastFocusedEl = null;

    function getFocusableEls() {
      return Array.prototype.slice.call(primaryNav.querySelectorAll(focusableSelector));
    }

    function openMenu() {
      lastFocusedEl = document.activeElement;
      navToggle.setAttribute('aria-expanded', 'true');
      navToggle.setAttribute('aria-label', 'Close menu');
      primaryNav.classList.add('is-open');
      document.body.classList.add('nav-open'); // scroll lock, see CSS
      var focusables = getFocusableEls();
      if (focusables.length) focusables[0].focus();
      document.addEventListener('keydown', handleKeydown);
    }

    function closeMenu(returnFocus) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      primaryNav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      document.removeEventListener('keydown', handleKeydown);
      if (returnFocus && lastFocusedEl) {
        lastFocusedEl.focus();
      } else if (returnFocus) {
        navToggle.focus();
      }
    }

    function handleKeydown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        closeMenu(true);
        return;
      }
      if (e.key !== 'Tab') return;

      // Trap focus inside the open mobile menu
      var focusables = getFocusableEls();
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu(false);
      } else {
        openMenu();
      }
    });

    // Close menu after choosing a link (mobile)
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (primaryNav.classList.contains('is-open')) {
          closeMenu(false);
        }
      });
    });
  }

  /* ---------- Footer year (never goes stale) ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Scroll-reveal micro-interactions ---------- */
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('[data-reveal]');

  if (revealEls.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    document.body.classList.add('reveal-ready');

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var fields = {
    name: {
      el: document.getElementById('name'),
      errorEl: document.getElementById('name-error'),
      validate: function (value) {
        return value.trim().length > 0 ? '' : 'Please enter your name.';
      }
    },
    email: {
      el: document.getElementById('email'),
      errorEl: document.getElementById('email-error'),
      validate: function (value) {
        if (!value.trim()) return 'Please enter your email.';
        if (!emailPattern.test(value.trim())) return 'Enter a valid email address.';
        return '';
      }
    },
    message: {
      el: document.getElementById('message'),
      errorEl: document.getElementById('message-error'),
      validate: function (value) {
        return value.trim().length > 0 ? '' : 'Tell us a little about your project.';
      }
    }
  };

  function showError(field, message) {
    field.errorEl.textContent = message;
    field.el.closest('.form-row').classList.toggle('has-error', Boolean(message));
    field.el.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  Object.keys(fields).forEach(function (key) {
    var field = fields[key];
    field.el.addEventListener('blur', function () {
      showError(field, field.validate(field.el.value));
    });
    field.el.addEventListener('input', function () {
      if (field.el.closest('.form-row').classList.contains('has-error')) {
        showError(field, field.validate(field.el.value));
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = true;
    Object.keys(fields).forEach(function (key) {
      var field = fields[key];
      var message = field.validate(field.el.value);
      showError(field, message);
      if (message) isValid = false;
    });

    if (!isValid) {
      status.textContent = 'Please fix the errors above and try again.';
      status.className = 'form-status error';
      var firstInvalid = form.querySelector('.has-error input, .has-error textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // No backend wired up yet — simulate a successful send.
    status.textContent = 'Thanks! Your message is on its way — we\'ll reply within one business day.';
    status.className = 'form-status success';
    form.reset();
    Object.keys(fields).forEach(function (key) {
      showError(fields[key], '');
    });
  });
})();

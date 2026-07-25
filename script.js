// NorthPeak Digital — site interactions
// 1) Mobile nav toggle  2) Contact form client-side validation

(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var primaryNav = document.getElementById('primaryNav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
      primaryNav.classList.toggle('is-open', !isOpen);
    });

    // Close menu after choosing a link (mobile)
    primaryNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (primaryNav.classList.contains('is-open')) {
          primaryNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Open menu');
        }
      });
    });
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

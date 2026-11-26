/* Void Bloom Art Studio. Vanilla JS, no libraries. */
(function () {
  'use strict';

  var CONTACT_EMAIL = 'lindseybmcconnell@gmail.com';

  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage can be blocked */ } }

  /* ---------- Cookie consent ---------- */
  function consentUpdate(v) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {
        ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var banner = document.getElementById('cookie-banner');
    var accept = document.getElementById('btn-accept-cookies');
    var decline = document.getElementById('btn-decline-cookies');
    if (banner && !lsGet('consent_status')) banner.classList.remove('hidden');
    if (accept) accept.addEventListener('click', function () {
      lsSet('consent_status', 'granted'); consentUpdate('granted'); banner.classList.add('hidden');
    });
    if (decline) decline.addEventListener('click', function () {
      lsSet('consent_status', 'denied'); consentUpdate('denied'); banner.classList.add('hidden');
    });

    initReading();
    initForms();
    initJoinedReturn();
  });

  /* ---------- Reading comfort ---------- */
  function initReading() {
    var btn = document.getElementById('reading-toggle');
    if (!btn) return;
    var root = document.documentElement;
    btn.setAttribute('aria-pressed', root.classList.contains('reading') ? 'true' : 'false');
    btn.addEventListener('click', function () {
      var on = !root.classList.contains('reading');
      root.classList.toggle('reading', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      lsSet('reading_comfort', on ? 'on' : 'off');
      if (on && window.vbLexend) window.vbLexend();
    });
  }

  /* ---------- Forms ---------- */
  var MSG = {
    required: 'This field is required.',
    email: 'Enter a valid email address, like name@example.com.',
    select: 'Choose one option.',
    check: 'Check this box to continue.',
    sending: 'Sending...',
    failed: 'That did not send. Please try again, or email ' + CONTACT_EMAIL + '.',
    saved: 'Saved.'
  };

  function fieldLabelId(el) { return el.id + '-error'; }

  function clearError(el) {
    el.removeAttribute('aria-invalid');
    var err = document.getElementById(fieldLabelId(el));
    if (err) err.remove();
    var d = (el.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== fieldLabelId(el); });
    if (d.length) el.setAttribute('aria-describedby', d.join(' ')); else el.removeAttribute('aria-describedby');
  }

  function showError(el, text) {
    clearError(el);
    el.setAttribute('aria-invalid', 'true');
    var p = document.createElement('p');
    p.className = 'field-error';
    p.id = fieldLabelId(el);
    p.textContent = text;
    var host = el.closest('.check-row') || el;
    host.insertAdjacentElement('afterend', p);
    var d = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    d.push(p.id);
    el.setAttribute('aria-describedby', d.join(' '));
  }

  function validate(form) {
    var first = null;
    var fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    Array.prototype.forEach.call(fields, function (el) {
      clearError(el);
      var bad = null;
      if (el.type === 'checkbox') { if (!el.checked) bad = MSG.check; }
      else if (!el.value.trim()) bad = el.tagName === 'SELECT' ? MSG.select : MSG.required;
      else if (el.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim())) bad = MSG.email;
      if (bad) { showError(el, bad); if (!first) first = el; }
    });
    if (first) first.focus();
    return !first;
  }

  function setStatus(form, text, isError) {
    var s = form.querySelector('.form-status');
    if (!s) return;
    s.textContent = text || '';
    s.classList.toggle('is-error', !!isError);
  }

  function fillTracking(form) {
    var q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'ref'].forEach(function (k) {
      var el = form.querySelector('input[name="' + k + '"]');
      if (el && q.get(k)) el.value = q.get(k).slice(0, 80);
    });
    var r = form.querySelector('input[name="referrer"]');
    if (r && document.referrer) r.value = document.referrer.slice(0, 200);
  }

  function track(name, params) {
    if (typeof gtag === 'function') { try { gtag('event', name, params); } catch (e) { /* ignore */ } }
  }

  function showSuccess(form, platform) {
    var wrap = form.closest('[data-signup]') || form.parentElement;
    var box = wrap.querySelector('[data-success]');
    if (!box) return;
    form.hidden = true;
    box.hidden = false;
    var key = (platform || '').toLowerCase();
    Array.prototype.forEach.call(box.querySelectorAll('[data-platform]'), function (n) {
      n.hidden = n.getAttribute('data-platform') !== key;
    });
    var heading = box.querySelector('[data-focus]');
    if (heading) heading.focus();
    var email = form.querySelector('input[name="email"]');
    var step2 = box.querySelector('form[data-step2]');
    if (step2 && email) {
      var e2 = step2.querySelector('input[name="email"]');
      var p2 = step2.querySelector('input[name="platform_choice"]');
      if (e2) e2.value = email.value.trim();
      if (p2) p2.value = platform || '';
    }
  }

  function send(form, onOk) {
    setStatus(form, MSG.sending, false);
    var btn = form.querySelector('button[type="submit"]');
    if (btn) btn.disabled = true;
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (btn) btn.disabled = false;
        if (j && j.success) { setStatus(form, '', false); onOk(); }
        else setStatus(form, MSG.failed, true);
      })
      .catch(function () {
        if (btn) btn.disabled = false;
        setStatus(form, MSG.failed, true);
      });
  }

  function initForms() {
    Array.prototype.forEach.call(document.querySelectorAll('form[data-form]'), function (form) {
      fillTracking(form);
      form.addEventListener('submit', function (ev) {
        if (!validate(form)) { ev.preventDefault(); return; }
        if (!form.hasAttribute('data-ajax')) return; /* plain POST with Web3Forms redirect */
        ev.preventDefault();
        var platformEl = form.querySelector('select[name="platform"]');
        var platform = platformEl ? platformEl.value : '';
        send(form, function () {
          if (form.hasAttribute('data-step2')) { setStatus(form, MSG.saved, false); return; }
          track('aiq_waitlist_signup', { platform: platform, source: (form.querySelector('input[name="source"]') || {}).value || '' });
          showSuccess(form, platform);
        });
      });
      Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (el) {
        el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) clearError(el); });
        el.addEventListener('change', function () { if (el.getAttribute('aria-invalid')) clearError(el); });
      });
    });
  }

  /* After a no-JavaScript submit, Web3Forms sends the visitor back with ?joined=1#section */
  function initJoinedReturn() {
    var q = new URLSearchParams(location.search);
    if (q.get('joined') !== '1') return;
    var target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
    var form = target ? target.querySelector('form[data-form][data-ajax]') || target.querySelector('form[data-signup-form]') : null;
    if (form) showSuccess(form, '');
  }

  /* ---------- Inquiry prefill (gallery buttons) ---------- */
  window.prefillInquiry = function (pieceTitle, inquiryType) {
    inquiryType = inquiryType || 'Available Original Piece';
    var typeSelect = document.getElementById('inquiryType');
    var messageBox = document.getElementById('message');
    if (!typeSelect || !messageBox) return;
    typeSelect.value = inquiryType;
    if (inquiryType === 'Available Original Piece') {
      messageBox.value = 'Hi Lindsey, I am interested in acquiring "' + pieceTitle + '". Please let me know current availability and shipping details.';
    } else {
      messageBox.value = 'Hi Lindsey, I saw your archived work "' + pieceTitle + '" and would love to discuss commissioning a similar custom piece.';
    }
    messageBox.focus({ preventScroll: false });
  };
})();

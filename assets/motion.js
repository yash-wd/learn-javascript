/* =============================================================================
 * motion.js — drives the shared motion layer (see motion.css).
 * =============================================================================
 * Responsibilities:
 *   1. Take over from the inline <head> failsafe (cancel its timer).
 *   2. Scroll-reveal elements as they enter the viewport, with a per-group
 *      stagger. Re-scans dynamically-rendered content (e.g. the lesson viewer).
 *   3. A top scroll-progress bar, a back-to-top button, a nav that reacts to
 *      scroll, and lightweight scrollspy for in-page nav links.
 *
 * Everything is optional and non-blocking: if a feature's API is missing, that
 * feature is skipped and the page still works. Honours prefers-reduced-motion.
 * The REVEAL_SEL list below MUST stay in sync with the selector in motion.css.
 * ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  // 1. We're alive — cancel the head failsafe so it doesn't strip html.motion.
  if (window.__motionFailsafe) { clearTimeout(window.__motionFailsafe); window.__motionFailsafe = null; }

  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  var REVEAL_SEL = [
    '.eyebrow', 'h1.title', '.lede', '.cta', '.stat',
    '.kicker', 'h2.h', '.sub',
    '.stepbox', '.stage', 'a.lesson', 'a.project', '.panel', 'details',
    '.intro', '.code-card', '.practice', '.pager', '.card'
  ].join(',');

  // -------------------------------------------------------------------------
  // 2. Scroll-reveal
  // -------------------------------------------------------------------------
  var canObserve = !reduce && ('IntersectionObserver' in window);
  var io = null;
  if (canObserve) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('reveal-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  }

  // Collect reveal targets in `node` AND `node` itself (querySelectorAll only
  // returns descendants — but injected nodes are often the target themselves).
  function collect(node) {
    var list = [];
    try {
      if (node.nodeType === 1 && node.matches && node.matches(REVEAL_SEL)) list.push(node);
      if (node.querySelectorAll) Array.prototype.push.apply(list, node.querySelectorAll(REVEAL_SEL));
    } catch (e) { /* bad selector / detached node — ignore */ }
    return list;
  }

  // Tag new reveal targets, stagger same-parent siblings, observe them.
  function scan(node) {
    collect(node || document).forEach(function (el) {
      if (el.hasAttribute('data-rv')) return;
      // skip nested targets — let the outer container animate as one unit
      if (el.parentElement && el.parentElement.closest('[data-rv]')) return;
      el.setAttribute('data-rv', '');

      if (!canObserve) { el.classList.add('reveal-in'); return; }

      // stagger: nth revealed child of the same parent gets a longer delay,
      // tracked with a counter attribute on the parent (no Map dependency).
      var p = el.parentElement, i = 0;
      if (p) { i = +(p.getAttribute('data-rv-i') || 0); p.setAttribute('data-rv-i', i + 1); }
      el.style.transitionDelay = Math.min(i * 70, 350) + 'ms';
      io.observe(el);
    });
  }

  function startReveal() {
    scan(document);
    // Re-scan content injected after load (lesson viewer re-renders #app, etc.)
    if ('MutationObserver' in window) {
      var pending = false;
      var queued = [];
      var mo = new MutationObserver(function (muts) {
        muts.forEach(function (m) {
          Array.prototype.forEach.call(m.addedNodes, function (n) {
            if (n.nodeType === 1) queued.push(n);
          });
        });
        if (pending || !queued.length) return;
        pending = true;
        var flush = function () {
          pending = false;
          var batch = queued; queued = [];
          batch.forEach(function (n) { if (n.isConnected) scan(n); });
        };
        (window.requestAnimationFrame || window.setTimeout)(flush);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    }
  }

  // -------------------------------------------------------------------------
  // 3. Scroll-progress bar + back-to-top + nav-on-scroll + scrollspy
  // -------------------------------------------------------------------------
  function buildChrome() {
    var bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    var top = document.createElement('button');
    top.id = 'back-to-top';
    top.type = 'button';
    top.setAttribute('aria-label', 'Back to top');
    top.innerHTML = '↑';
    top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
    document.body.appendChild(top);

    var nav = document.querySelector('header.nav');

    // scrollspy: in-page nav links -> the section each points at
    var spies = [];
    Array.prototype.forEach.call(document.querySelectorAll('header.nav nav a[href^="#"]'), function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = id && document.getElementById(id);
      if (sec) spies.push({ link: a, sec: sec });
    });

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      (window.requestAnimationFrame || window.setTimeout)(function () {
        ticking = false;
        var y = window.pageYOffset || root.scrollTop || 0;
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';

        if (nav) nav.classList.toggle('scrolled', y > 16);
        top.classList.toggle('show', y > 600);

        if (spies.length) {
          var mark = y + 120, current = null;
          spies.forEach(function (s) { if (s.sec.offsetTop <= mark) current = s; });
          spies.forEach(function (s) { s.link.classList.toggle('active', s === current); });
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  // -------------------------------------------------------------------------
  // boot
  // -------------------------------------------------------------------------
  function init() { startReveal(); buildChrome(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// Footnote apparatus: hover/focus popups on superscript refs + native title
// fallback. External file (not inline) because CSP is script-src 'self'.
// Click behavior untouched: refs jump to the endnote, GFM backrefs scroll back.
(function () {
  function init() {
    var pop = null;
    function kill() {
      if (pop) {
        pop.remove();
        pop = null;
      }
    }
    var refs = document.querySelectorAll('a[data-footnote-ref]');
    // Marker proves execution in the page realm; titles give native tooltips.
    document.documentElement.dataset.fnpops = String(refs.length);
    refs.forEach(function (ref) {
      var id = decodeURIComponent((ref.getAttribute('href') || '').slice(1));
      var note = document.getElementById(id);
      if (note) {
        ref.title = (note.textContent || '').replace(/\s+/g, ' ').replace(/↩.*$/, '').trim().slice(0, 280);
      }
      function show() {
        kill();
        if (!note) return;
        pop = document.createElement('div');
        pop.className = 'fn-pop';
        var clone = note.cloneNode(true);
        clone.querySelectorAll('a[data-footnote-backref]').forEach(function (b) {
          b.remove();
        });
        pop.innerHTML = clone.innerHTML;
        var body = ref.closest('.post-body');
        if (!body) return;
        if (getComputedStyle(body).position === 'static') body.style.position = 'relative';
        body.appendChild(pop);
        var r = ref.getBoundingClientRect();
        var b = body.getBoundingClientRect();
        var left = Math.max(0, Math.min(r.left - b.left, b.width - pop.offsetWidth - 8));
        pop.style.left = left + 'px';
        pop.style.top = r.bottom - b.top + 8 + 'px';
      }
      ref.addEventListener('mouseenter', show);
      ref.addEventListener('focus', show);
      ref.addEventListener('mouseleave', kill);
      ref.addEventListener('blur', kill);
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

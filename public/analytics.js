// GoatCounter: cookieless page-view counting (SPEC §12). Loaded with `defer`
// from index.html, so it never blocks render; the site works identically if
// this file or GoatCounter's script is blocked.
//
// Counts only on the production host — never localhost or Netlify deploy
// previews — and never when the visitor has asked not to be tracked.
(function () {
  if (location.hostname !== 'astreys.com') return;
  if (navigator.doNotTrack === '1' || window.doNotTrack === '1') return;

  // count.js prefers <link rel="canonical"> over the real URL, which would
  // drop `?from=okta`. The query string is how a visit is attributed to an
  // application, so count the path exactly as it arrived.
  window.goatcounter = {
    path: function () {
      return location.pathname + location.search;
    },
  };

  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://gc.zgo.at/count.js';
  script.dataset.goatcounter = 'https://astreys.goatcounter.com/count';
  document.head.appendChild(script);
})();

(function () {
  var params = new URLSearchParams(window.location.search);
  var embedded = window.self !== window.top || params.get('embed') === '1';

  if (!embedded) return;

  document.documentElement.classList.add('component-embed');

  function sendHeight() {
    window.requestAnimationFrame(function () {
      var body = document.body;
      var doc = document.documentElement;
      if (!body || !doc) return;
      var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        doc.scrollHeight,
        doc.offsetHeight
      );
      window.parent.postMessage({
        type: 'component-kit:resize',
        file: window.location.pathname.split('/').pop(),
        height: Math.ceil(height)
      }, '*');
    });
  }

  function applyTheme(theme) {
    var root = document.documentElement;
    if (!theme || theme === 'light') root.removeAttribute('data-theme');
    else if (theme === 'dark') root.dataset.theme = 'night';
    else root.dataset.theme = theme;
    sendHeight();
  }

  window.addEventListener('message', function (event) {
    var data = event.data || {};
    if (data.type === 'component-kit:theme') applyTheme(data.theme);
  });

  window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);

  if ('ResizeObserver' in window) {
    var resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.documentElement);
    if (document.body) resizeObserver.observe(document.body);
  }

  if ('MutationObserver' in window && document.body) {
    var mutationObserver = new MutationObserver(sendHeight);
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true
    });
  }

  sendHeight();
})();

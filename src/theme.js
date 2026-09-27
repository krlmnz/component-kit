/* Writer themes. Studio ids: light, night, note, signal, news, draft.
   Light / Minimal is :root, so the attribute is omitted. There is no
   data-theme="light" block and no data-theme="dark" theme. A saved
   "dark" value is rewritten to night. Specimens mark <select data-theme-select>. */
(function () {
  var THEMES = [
    { id: 'light', label: 'Light / Minimal' },
    { id: 'night', label: 'Night Sky' },
    { id: 'note', label: 'Warm Note' },
    { id: 'signal', label: 'Signal Hacker' },
    { id: 'news', label: 'Grey Newspaper' },
    { id: 'draft', label: 'Drafting Grid' }
  ];
  var IDS = THEMES.map(function (theme) { return theme.id; });
  var STORAGE = 'component-kit-theme';
  var started = false;

  function normalize(id) {
    if (id === 'dark') return 'night';
    if (IDS.indexOf(id) === -1) return 'light';
    return id;
  }

  function current() {
    return normalize(document.documentElement.dataset.theme || 'light');
  }

  function syncSelects(id) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-select]'), function (select) {
      if (select.value !== id) select.value = id;
    });
  }

  function apply(id) {
    id = normalize(id);
    var root = document.documentElement;
    if (id === 'light') root.removeAttribute('data-theme');
    else root.dataset.theme = id;
    syncSelects(id);
    try { localStorage.setItem(STORAGE, id); } catch (e) {}
    document.dispatchEvent(new CustomEvent('component-kit:theme-change', { detail: { theme: id } }));
  }

  function fillSelect(select) {
    if (select.options.length) return;
    THEMES.forEach(function (theme) {
      var option = document.createElement('option');
      option.value = theme.id;
      option.textContent = theme.label;
      select.appendChild(option);
    });
    select.addEventListener('change', function () { apply(select.value); });
  }

  function init() {
    var selects = document.querySelectorAll('[data-theme-select]');
    if (!selects.length || started) return;
    started = true;
    Array.prototype.forEach.call(selects, fillSelect);

    if (document.documentElement.dataset.theme === 'dark') {
      document.documentElement.dataset.theme = 'night';
    }

    var embedded = window.self !== window.top ||
      new URLSearchParams(window.location.search).get('embed') === '1';
    if (!embedded) {
      var params = new URLSearchParams(window.location.search);
      var stored = 'light';
      try { stored = localStorage.getItem(STORAGE) || 'light'; } catch (e) {}
      apply(params.get('theme') || stored);
    } else {
      syncSelects(current());
    }
  }

  window.ComponentKitTheme = {
    themes: THEMES,
    apply: apply,
    current: current,
    normalize: normalize
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  }
  init();
})();

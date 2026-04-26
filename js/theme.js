/* ============================================
   THEME.JS — Dark/Light Mode Toggle
   ============================================ */

(function () {
  const STORAGE_KEY = 'chatbot-polimdo-theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleButtons(theme);
  }

  function updateToggleButtons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang');
    });
  }

  function toggleTheme() {
    var current = localStorage.getItem(STORAGE_KEY) || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Apply theme on load (before DOM ready to prevent flash)
  applyTheme(getPreferredTheme());

  // Bind toggle buttons after DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    var theme = getPreferredTheme();
    updateToggleButtons(theme);

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();

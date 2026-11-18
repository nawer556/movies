/**
 * 不依賴 ES Modules 的啟動診斷。
 * 瀏覽器若從 file:// 開啟，模組腳本可能根本不會執行，
 * 因此這段使用一般 script 載入，避免畫面永遠停在「正在載入作品」。
 */
(() => {
  const isDetailPage = () => Boolean(document.querySelector('#detail-root'));

  function showHomeError(message) {
    const grid = document.querySelector('#movie-grid');
    const error = document.querySelector('#error-state');
    const count = document.querySelector('#result-count');
    if (!grid || !error || !count || grid.getAttribute('aria-busy') !== 'true') return;

    grid.setAttribute('aria-busy', 'false');
    count.textContent = '無法載入作品';
    const info = error.querySelector('p');
    if (info) info.textContent = message;
    const retry = document.querySelector('#retry-load');
    if (retry && location.protocol === 'file:') retry.hidden = true;
    error.hidden = false;
  }

  function showDetailError(message) {
    const root = document.querySelector('#detail-root');
    if (!root || root.getAttribute('aria-busy') !== 'true') return;
    root.setAttribute('aria-busy', 'false');
    const panel = document.createElement('div');
    panel.className = 'detail-error';
    const title = document.createElement('h1');
    title.textContent = '無法載入作品介紹';
    const description = document.createElement('p');
    description.textContent = message;
    panel.append(title, description);
    root.replaceChildren(panel);
  }

  function showError(message) {
    if (isDetailPage()) showDetailError(message);
    else showHomeError(message);
  }

  function checkStartup() {
    if (location.protocol === 'file:') {
      showError('目前是直接開啟 HTML 檔案（file://），瀏覽器會限制作品資料讀取。Windows 請雙擊專案中的 start-site.bat，或在 CineLog 資料夾執行 python -m http.server 8000，再開啟 http://localhost:8000/。');
      return;
    }
    // 若 ES Module 或依賴的檔案讀取失敗，主程式可能完全沒執行。
    // 8 秒後才顯示指引，避免一般網路延遲造成誤判。
    window.setTimeout(() => {
      showError('網頁程式未能完成載入。請確認 js/、data/movies.json 以及 css/ 等檔案完整且位置正確，使用本機伺服器或 GitHub Pages 開啟，再重新整理。');
    }, 8000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkStartup, { once: true });
  } else {
    checkStartup();
  }
})();

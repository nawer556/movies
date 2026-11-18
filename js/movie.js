import { loadMovies } from './data.js';
import { createPoster, createGenrePills, createFavoriteButton, createMovieCard, syncFavoriteButtons, updateFavoriteCount } from './ui.js';

const root = document.querySelector('#detail-root');
const relatedSection = document.querySelector('#related-section');
const relatedGrid = document.querySelector('#related-grid');
const notice = document.querySelector('#storage-notice');

function textNode(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = content;
  return el;
}

function showError(title, description) {
  const wrap = document.createElement('div');
  wrap.className = 'detail-error';
  wrap.append(textNode('div', 'empty-illustration', '✦'));
  wrap.append(textNode('h1', '', title));
  wrap.append(textNode('p', '', description));
  const back = document.createElement('a');
  back.className = 'button button-primary';
  back.href = './index.html';
  back.textContent = '返回作品清單';
  wrap.append(back);
  root.replaceChildren(wrap);
  root.setAttribute('aria-busy', 'false');
  relatedSection.hidden = true;
}

function renderMovie(movie, allMovies) {
  document.title = `${movie.title}｜CineLog`;
  const layout = document.createElement('article');
  layout.className = 'detail-layout';

  const posterColumn = document.createElement('div');
  posterColumn.className = 'detail-poster-column';
  posterColumn.append(createPoster(movie, { large: true }));
  posterColumn.append(textNode('p', 'poster-credit', 'CINELOG ORIGINAL CONCEPT ART · 非官方海報'));

  const content = document.createElement('div');
  content.className = 'detail-content';
  content.append(textNode('p', 'eyebrow detail-eyebrow', `${movie.type === 'movie' ? 'FEATURE FILM' : 'TV SERIES'}  /  CINELOG SELECTS`));
  content.append(textNode('h1', 'detail-title', movie.title));
  content.append(textNode('p', 'detail-original', movie.originalTitle));

  const metadata = document.createElement('div');
  metadata.className = 'detail-meta';
  metadata.append(textNode('span', '', String(movie.year)));
  metadata.append(textNode('span', 'meta-separator', '·'));
  metadata.append(textNode('span', '', movie.type === 'movie' ? '電影' : '影集'));
  content.append(metadata);
  content.append(createGenrePills(movie.genres));

  const scorePanel = document.createElement('div');
  scorePanel.className = 'detail-score-panel';
  const scoreCopy = document.createElement('div');
  scoreCopy.append(textNode('span', 'detail-score-label', '本站推薦分數'));
  const scoreNumber = document.createElement('div');
  scoreNumber.className = 'detail-score-number';
  scoreNumber.append(textNode('strong', '', movie.score.toFixed(1)));
  scoreNumber.append(textNode('span', '', '/ 5.0'));
  scoreCopy.append(scoreNumber);
  scorePanel.append(scoreCopy, textNode('span', 'score-stars', '★★★★★'));
  content.append(scorePanel);

  const about = document.createElement('section');
  about.className = 'detail-section';
  about.append(textNode('h2', '', '故事簡介'));
  about.append(textNode('p', '', movie.synopsis));
  const why = document.createElement('section');
  why.className = 'detail-section detail-recommendation';
  why.append(textNode('p', 'eyebrow', 'WHY WE LOVE IT'));
  why.append(textNode('h2', '', '為什麼推薦？'));
  why.append(textNode('p', '', movie.recommendation));
  content.append(about, why);

  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  actions.append(createFavoriteButton(movie, { large: true }));
  const back = document.createElement('a');
  back.className = 'button button-outline';
  back.href = './index.html';
  back.textContent = '繼續探索 ↗';
  actions.append(back);
  content.append(actions);

  layout.append(posterColumn, content);
  root.replaceChildren(layout);
  root.setAttribute('aria-busy', 'false');

  const similar = allMovies.filter((item) => item.id !== movie.id)
    .map((item) => ({ movie: item, shared: item.genres.filter((genre) => movie.genres.includes(genre)).length }))
    .filter((item) => item.shared > 0)
    .sort((a, b) => b.shared - a.shared || b.movie.score - a.movie.score)
    .slice(0, 4)
    .map((item) => item.movie);
  if (similar.length > 0) {
    relatedGrid.replaceChildren(...similar.map(createMovieCard));
    relatedSection.hidden = false;
  }
  updateFavoriteCount();
}

async function init() {
  updateFavoriteCount();
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    showError('找不到這部作品', '網址中的作品編號不正確，請返回首頁重新選擇。');
    return;
  }

  try {
    const movies = await loadMovies();
    const movie = movies.find((item) => item.id === id);
    if (!movie) {
      showError('找不到這部作品', '作品可能尚未收錄，或連結中的編號已失效。');
      return;
    }
    renderMovie(movie, movies);
  } catch (error) {
    console.error('CineLog：載入作品詳情時發生錯誤', error);
    showError('作品資料載入失敗', '目前無法取得作品介紹，請稍後重新整理或返回首頁。');
  }
}

document.addEventListener('cinelog:favorites-updated', (event) => {
  if (!event.detail.persisted) {
    notice.hidden = false;
    notice.textContent = '目前瀏覽器無法儲存收藏；本頁操作暫時有效，離開後可能會遺失。';
  }
  updateFavoriteCount();
});
window.addEventListener('storage', (event) => {
  if (event.key === 'cinelog:favorites:v1') { syncFavoriteButtons(); updateFavoriteCount(); }
});

init();

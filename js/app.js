import { loadMovies, getAllGenres } from './data.js';
import { getFavoriteIds } from './favorites.js';
import { createMovieCard, syncFavoriteButtons, updateFavoriteCount } from './ui.js';

const elements = {
  grid: document.querySelector('#movie-grid'),
  search: document.querySelector('#search-input'),
  genre: document.querySelector('#genre-select'),
  typeFilters: document.querySelector('#type-filters'),
  count: document.querySelector('#result-count'),
  empty: document.querySelector('#empty-state'),
  emptyTitle: document.querySelector('#empty-title'),
  emptyDescription: document.querySelector('#empty-description'),
  error: document.querySelector('#error-state'),
  notice: document.querySelector('#storage-notice'),
  exploreLink: document.querySelector('#nav-explore'),
  favoritesLink: document.querySelector('#nav-favorites'),
};

const state = { movies: [], search: '', genre: '', type: 'all', favoritesOnly: false };

function applyHash() {
  state.favoritesOnly = window.location.hash === '#favorites';
  elements.exploreLink.classList.toggle('is-current', !state.favoritesOnly);
  elements.favoritesLink.classList.toggle('is-current', state.favoritesOnly);
  if (state.favoritesOnly) {
    elements.exploreLink.removeAttribute('aria-current');
    elements.favoritesLink.setAttribute('aria-current', 'page');
  } else {
    elements.exploreLink.setAttribute('aria-current', 'page');
    elements.favoritesLink.removeAttribute('aria-current');
  }
}

function getVisibleMovies() {
  const query = state.search.trim().toLocaleLowerCase();
  const favoriteIds = state.favoritesOnly ? new Set(getFavoriteIds()) : null;
  return state.movies.filter((movie) => {
    const nameMatch = !query || [movie.title, movie.originalTitle].some((title) => title.toLocaleLowerCase().includes(query));
    const genreMatch = !state.genre || movie.genres.includes(state.genre);
    const typeMatch = state.type === 'all' || movie.type === state.type;
    const favoriteMatch = !favoriteIds || favoriteIds.has(movie.id);
    return nameMatch && genreMatch && typeMatch && favoriteMatch;
  });
}

function render() {
  if (!state.movies) return;
  const visibleMovies = getVisibleMovies();
  elements.grid.replaceChildren(...visibleMovies.map(createMovieCard));
  elements.grid.setAttribute('aria-busy', 'false');
  elements.empty.hidden = visibleMovies.length !== 0;
  elements.error.hidden = true;
  elements.count.textContent = state.favoritesOnly
    ? `收藏清單 · 顯示 ${visibleMovies.length} 部作品`
    : `顯示 ${visibleMovies.length} / ${state.movies.length} 部作品`;

  if (visibleMovies.length === 0) {
    const allFavoritesEmpty = state.favoritesOnly && getFavoriteIds().length === 0;
    elements.emptyTitle.textContent = allFavoritesEmpty ? '收藏清單還是空的' : '找不到符合條件的作品';
    elements.emptyDescription.textContent = allFavoritesEmpty
      ? '在作品卡片上點選愛心，就能把想看的故事放進這裡。'
      : '試試其他片名，或調整作品類型與篩選條件。';
  }
  updateFavoriteCount();
}

function showStorageNotice() {
  elements.notice.hidden = false;
  elements.notice.textContent = '目前瀏覽器無法儲存收藏；本頁操作暫時有效，關閉或離開頁面後可能會遺失。';
}

function clearFilters() {
  state.search = '';
  state.genre = '';
  state.type = 'all';
  elements.search.value = '';
  elements.genre.value = '';
  elements.typeFilters.querySelectorAll('button').forEach((button) => {
    const active = button.dataset.type === 'all';
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (state.favoritesOnly) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    applyHash();
  }
  render();
}

function installEvents() {
  elements.search.addEventListener('input', () => {
    state.search = elements.search.value;
    render();
  });
  elements.genre.addEventListener('change', () => {
    state.genre = elements.genre.value;
    render();
  });
  elements.typeFilters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-type]');
    if (!button) return;
    state.type = button.dataset.type;
    elements.typeFilters.querySelectorAll('button').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
  document.querySelector('#reset-filters').addEventListener('click', clearFilters);
  document.querySelector('#retry-load').addEventListener('click', () => window.location.reload());
  window.addEventListener('hashchange', () => { applyHash(); render(); });
  document.addEventListener('cinelog:favorites-updated', (event) => {
    if (!event.detail.persisted) showStorageNotice();
    render();
  });
  window.addEventListener('storage', (event) => {
    if (event.key === 'cinelog:favorites:v1') { syncFavoriteButtons(); render(); }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !event.altKey && !event.ctrlKey && !event.metaKey &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
      event.preventDefault();
      elements.search.focus();
    }
  });
}

async function init() {
  applyHash();
  installEvents();
  updateFavoriteCount();
  try {
    state.movies = await loadMovies();
    const genres = getAllGenres(state.movies);
    genres.forEach((genre) => {
      const option = document.createElement('option');
      option.value = genre;
      option.textContent = genre;
      elements.genre.append(option);
    });
    document.querySelector('#total-works').textContent = String(state.movies.length).padStart(2, '0');
    document.querySelector('#total-genres').textContent = String(genres.length).padStart(2, '0');
    render();
  } catch (error) {
    console.error('CineLog：讀取電影資料時發生錯誤', error);
    elements.grid.replaceChildren();
    elements.grid.setAttribute('aria-busy', 'false');
    elements.count.textContent = '無法載入作品';
    elements.empty.hidden = true;
    elements.error.hidden = false;
  }
}

init();

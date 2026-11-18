/** 共用海報、卡片與收藏按鈕，新增作品時不需要重做 HTML 模板。 */
import { getFavoriteIds, isFavorite, toggleFavorite } from './favorites.js';

function textNode(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = content;
  return el;
}

export function createPoster(movie, { large = false } = {}) {
  const container = document.createElement('div');
  container.className = `poster ${large ? 'poster-large' : ''}`.trim();
  const fallback = () => {
    const placeholder = textNode('div', 'poster-placeholder', '');
    const symbol = textNode('span', 'poster-placeholder-symbol', '✳');
    symbol.setAttribute('aria-hidden', 'true');
    const title = textNode('strong', 'poster-placeholder-title', movie.title);
    const original = textNode('span', 'poster-placeholder-original', movie.originalTitle);
    placeholder.append(symbol, title, original);
    container.replaceChildren(placeholder);
  };

  if (movie.poster) {
    const img = document.createElement('img');
    img.className = 'poster-image';
    img.src = `./${movie.poster}`;
    img.alt = `《${movie.title}》概念海報`;
    img.loading = large ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', fallback, { once: true });
    container.append(img);
  } else {
    fallback();
  }
  return container;
}

function syncFavoriteButton(button) {
  const saved = isFavorite(button.dataset.favoriteId);
  button.classList.toggle('is-saved', saved);
  button.setAttribute('aria-pressed', String(saved));
  button.setAttribute('aria-label', `${saved ? '取消收藏' : '加入收藏'}：${button.dataset.movieTitle}`);
  button.title = saved ? '取消收藏' : '加入收藏';
  const label = button.querySelector('.favorite-button-text');
  if (label) label.textContent = saved ? '已加入收藏' : '加入收藏';
}

export function syncFavoriteButtons() {
  document.querySelectorAll('button[data-favorite-id]').forEach(syncFavoriteButton);
}

export function createFavoriteButton(movie, { large = false } = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `favorite-button ${large ? 'favorite-button-large' : ''}`.trim();
  button.dataset.favoriteId = movie.id;
  button.dataset.movieTitle = movie.title;
  const heart = textNode('span', 'heart-icon', '♥');
  heart.setAttribute('aria-hidden', 'true');
  button.append(heart);
  if (large) button.append(textNode('span', 'favorite-button-text', '加入收藏'));
  button.addEventListener('click', () => {
    const result = toggleFavorite(movie.id);
    syncFavoriteButtons();
    document.dispatchEvent(new CustomEvent('cinelog:favorites-updated', { detail: result }));
  });
  syncFavoriteButton(button);
  return button;
}

export function createGenrePills(genres, limit = genres.length) {
  const list = document.createElement('div');
  list.className = 'genre-pills';
  genres.slice(0, limit).forEach((genre) => list.append(textNode('span', 'genre-pill', genre)));
  if (genres.length > limit) list.append(textNode('span', 'genre-pill genre-pill-more', `+${genres.length - limit}`));
  return list;
}

export function createMovieCard(movie) {
  const card = document.createElement('article');
  card.className = 'movie-card';

  const imageLink = document.createElement('a');
  imageLink.className = 'movie-card-poster-link';
  imageLink.href = `./movie.html?id=${encodeURIComponent(movie.id)}`;
  imageLink.setAttribute('aria-label', `查看《${movie.title}》詳情`);
  imageLink.append(createPoster(movie));
  imageLink.append(textNode('span', 'poster-tag', movie.type === 'movie' ? 'MOVIE' : 'SERIES'));

  const favorite = createFavoriteButton(movie);
  favorite.classList.add('favorite-button-card');

  const body = document.createElement('div');
  body.className = 'movie-card-content';
  const top = document.createElement('div');
  top.className = 'movie-card-meta';
  top.append(textNode('span', '', `${movie.year} · ${movie.type === 'movie' ? '電影' : '影集'}`));
  const score = textNode('span', 'score-mini', `★ ${movie.score.toFixed(1)}`);
  score.title = '本站推薦分數（滿分 5 分）';
  top.append(score);

  const titleLink = document.createElement('a');
  titleLink.className = 'movie-card-title-link';
  titleLink.href = imageLink.href;
  titleLink.append(textNode('h3', 'movie-card-title', movie.title));
  body.append(top, titleLink, textNode('p', 'movie-card-original', movie.originalTitle));
  body.append(createGenrePills(movie.genres, 2));
  card.append(imageLink, favorite, body);
  return card;
}

export function updateFavoriteCount() {
  const count = document.querySelector('#favorite-count');
  if (count) count.textContent = String(getFavoriteIds().length);
}

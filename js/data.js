/** CineLog 唯一資料來源：data/movies.json。 */
const DATA_URL = './data/movies.json';
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const POSTER_PATTERN = /^assets\/posters\/[a-z0-9-]+\.(?:svg|png|jpe?g|webp)$/;

function isNonemptyText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateMovie(movie, index, seenIds) {
  const context = `第 ${index + 1} 筆作品`;
  if (!movie || typeof movie !== 'object' || Array.isArray(movie)) {
    throw new Error(`${context} 必須是物件`);
  }
  if (typeof movie.id !== 'string' || !ID_PATTERN.test(movie.id) || seenIds.has(movie.id)) {
    throw new Error(`${context} 的 id 無效或重複`);
  }
  for (const field of ['title', 'originalTitle', 'synopsis', 'recommendation']) {
    if (!isNonemptyText(movie[field])) throw new Error(`${context} 缺少 ${field}`);
  }
  if (!['movie', 'series'].includes(movie.type)) throw new Error(`${context} type 無效`);
  if (!Number.isInteger(movie.year) || movie.year < 1888 || movie.year > 2100) {
    throw new Error(`${context} year 無效`);
  }
  if (!Array.isArray(movie.genres) || movie.genres.length === 0 || !movie.genres.every(isNonemptyText)) {
    throw new Error(`${context} genres 無效`);
  }
  if (typeof movie.score !== 'number' || !Number.isFinite(movie.score) || movie.score < 1 || movie.score > 5) {
    throw new Error(`${context} score 必須介於 1.0 和 5.0`);
  }
  if (typeof movie.poster !== 'string' || (movie.poster && !POSTER_PATTERN.test(movie.poster))) {
    throw new Error(`${context} poster 應為 assets/posters 內的相對路徑或空字串`);
  }
  seenIds.add(movie.id);
}

export async function loadMovies() {
  const response = await fetch(DATA_URL, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('作品資料不是 JSON 陣列');
  const seenIds = new Set();
  data.forEach((movie, index) => validateMovie(movie, index, seenIds));
  return data;
}

export function getAllGenres(movies) {
  return [...new Set(movies.flatMap((movie) => movie.genres))]
    .sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}

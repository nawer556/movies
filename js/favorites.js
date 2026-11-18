/** 僅儲存電影 id；無法存取 localStorage 時採用本頁暫存。 */
export const FAVORITES_KEY = 'cinelog:favorites:v1';
let sessionIds = new Set();
let sessionFallbackActive = false;

function cleanIds(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item) => typeof item === 'string' && item.length > 0))];
}

export function getFavoriteIds() {
  if (sessionFallbackActive) return [...sessionIds];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (raw === null) {
      sessionIds = new Set();
      return [];
    }
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = [];
    }
    const ids = cleanIds(parsed);
    sessionIds = new Set(ids);
    return ids;
  } catch {
    // 隱私模式或瀏覽器政策可能拒絕讀取，仍提供頁內互動。
    sessionFallbackActive = true;
    return [...sessionIds];
  }
}

export function isFavorite(id) {
  return getFavoriteIds().includes(id);
}

export function toggleFavorite(id) {
  const ids = new Set(getFavoriteIds());
  const saved = !ids.has(id);
  if (saved) ids.add(id);
  else ids.delete(id);
  sessionIds = ids;

  let persisted = false;
  try {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...ids]));
    persisted = true;
    sessionFallbackActive = false;
  } catch {
    sessionFallbackActive = true;
    // 無法寫入時使用 sessionIds，並交由介面告知使用者無法永久保存。
  }
  return { saved, persisted, ids: [...ids] };
}

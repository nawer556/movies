# CineLog — 電影與影集推薦網站

> 一個遵照 [`AGENTS.md`](./AGENTS.md) 建立、可以持續擴充內容的純靜態電影推薦網站。目前收錄 **100 部作品（98 部電影、2 部影集）**，可搜尋繁體中文與原文片名。

## 功能

- **作品探索**：原創概念海報、繁體中文片名、原文片名、年份、類型與本站推薦分數。
- **即時搜尋**：同時搜尋中文片名與原文片名，英文大小寫不影響結果。
- **交集篩選**：支援類型（由 JSON 自動產生）及電影／影集篩選，並可與搜尋一起使用。
- **通用詳細頁**：點選卡片前往 `movie.html?id=作品ID`，瀏覽無暴雷簡介、推薦理由與相似作品。
- **收藏**：使用 `localStorage` 保存作品 `id`，可透過右上角「收藏清單」檢視。儲存功能遭瀏覽器拒絕時會顯示提示。
- **響應式介面**：支援手機、平板與電腦；提供鍵盤操作、焦點樣式、空結果及圖片載入失敗的替代顯示。

## 技術

HTML5、CSS3、原生 JavaScript（ES Modules）、JSON、GitHub Pages；**不需註冊帳號、API 金鑰、後端服務或建置工具**。

## 目錄

```text
CineLog/
├── AGENTS.md              # AI 開發規則
├── README.md              # 本說明
├── index.html             # 探索首頁
├── movie.html             # 通用作品詳細頁
├── css/
│   └── style.css          # 全站設計系統與響應式版型
├── js/
│   ├── startup.js         # file:// 與模組未載入時的錯誤提示
│   ├── app.js             # 搜尋、篩選、首頁互動
│   ├── movie.js           # 詳情頁與相似作品
│   ├── favorites.js       # 收藏讀寫
│   ├── data.js            # JSON 載入與格式驗證
│   └── ui.js              # 共用卡片、海報、收藏按鈕
├── data/
│   └── movies.json        # 唯一主要作品資料來源
├── tests/
│   └── test_project.py    # 使用標準函式庫執行結構與資料驗證
├── assets/
│   ├── favicon.svg
│   └── posters/            # 原創抽象概念海報（非官方劇照）
├── generate_posters.py    # 可選：重新產生概念海報
├── serve.py               # 以本機 HTTP 啟動網站並開啟瀏覽器
├── start-site.bat         # Windows 雙擊一鍵啟動
└── .gitignore            # 排除暫存檔及本機機密
```

## 本機啟動（重要）

### VS Code + Live Server（Windows 推薦，不用安裝 Python）

1. 先將 ZIP 完整解壓縮，使用 VS Code 的 **File → Open Folder** 開啟 `CineLog` 資料夾。
2. 安裝作者 **Ritwick Dey** 的 **Live Server** 擴充套件。如果 VS Code 提示工作區未受信任，確認資料夾來源後選擇信任，才能啟用擴充套件。
3. 開啟 `index.html`，按編輯區右鍵選 **Open with Live Server**，或按右下角 **Go Live**。
4. 瀏覽器通常會開啟 `http://127.0.0.1:5500/index.html`。使用時保持 VS Code 的 Live Server 運作。
5. 載入後首頁應顯示 **100** 部作品，試著搜尋「阿甘正傳」或 `Forrest Gump`。

### Windows Python 啟動方式（選用）

1. 將整個 ZIP **解壓縮**，進入 `CineLog` 資料夾（不要在 ZIP 壓縮檔裡執行）。
2. **雙擊 `start-site.bat`**（電腦需安裝 Python 3）。它會啟動本機伺服器並嘗試開啟瀏覽器。
3. 如果瀏覽器沒有自動開啟，請複製命令視窗顯示的 `http://localhost:8000/` 等網址。
4. 使用網站時保持命令視窗開啟；結束後按 `Ctrl+C`，或關閉視窗即可停止伺服器。

### 用終端機啟動（各系統通用）

請在 `CineLog` 資料夾開啟終端機，執行：

```bash
python -m http.server 8000
```

在瀏覽器打開 `http://localhost:8000/`。

> **不要直接雙擊 `index.html`**：網址若以 `file:///` 開頭，瀏覽器通常會阻止 ES Modules 和 JSON 讀取，出現「正在載入作品」卻沒有電影卡片。現在網頁會顯示清楚的啟動提示。Windows 如 `python` 不可用，可改試 `py -m http.server 8000`。

> 若看到「無法載入作品」，先確認你使用的網址是 `http://localhost:8000/`（或啟動器顯示的實際埠號），而不是 `file:///.../index.html`。

## 自動驗證

在專案根目錄執行：

```bash
python -m unittest discover -s tests -v
```

這份測試檢查資料欄位、作品 `id`、原創海報檔案、通用詳情頁及共用設計規則。**它不取代瀏覽器互動測試**，上線前仍需依 `AGENTS.md` 第 10 節逐項操作確認。

## 本次擴充紀錄：10 → 100 部作品

- **保留原本 10 部作品**：原有 `id`、海報路徑和收藏資料格式完全不變。
- **新增 90 部電影**：只須把資料加入 `data/movies.json`，不需要為每部電影額外製作 HTML。
- **共計 100 部作品**：98 部電影及 2 部影集；類型會依 JSON 自動建立，搜尋及詳情頁沿用現有功能。
- **新增作品沒有使用未授權電影海報**：`poster` 設為空字串 `""`，網站自動顯示帶片名的 CSS 文字替代海報。
- **搜尋範圍是本機作品清單**：並非連線到全球電影庫；若要搜尋更多作品，需要繼續在 JSON 新增資料。
- **本站分數完全是編輯主觀示範分數**，不是 IMDb、Rotten Tomatoes、豆瓣或其他網站的評分。

這次修改示範了 `AGENTS.md` **第 8 節「重複使用流程 A」**：新增資料可直接套用既有的搜尋、卡片、收藏及通用詳情頁，並保留原有功能。

## 新增一部電影／影集

1. 開始前先閱讀 [`AGENTS.md`](./AGENTS.md) 第 5、7、8、10 節。
2. 在 `data/movies.json` **新增一個物件**，勿刪改既有作品的 `id`。
3. 物件必須有以下欄位：`id`、`title`、`originalTitle`、`type`、`year`、`genres`、`synopsis`、`recommendation`、`score`、`poster`。
4. `poster` 可以設為 `""`，此時網站會自動顯示 CSS 文字替代海報；如果有自行製作或取得合法授權的圖片，可放到 `assets/posters/` 並填入相對路徑。
5. 不必增加一個新的 HTML：首頁、篩選、詳情頁與收藏會使用同一筆 JSON 資料。完成後依 `AGENTS.md` 第 10 節測試。

示範資料（虛構作品，**請勿當作真實電影推薦**）：

```json
{
  "id": "example-movie",
  "title": "範例電影",
  "originalTitle": "Example Movie",
  "type": "movie",
  "year": 2024,
  "genres": ["科幻", "冒險"],
  "synopsis": "這是一部用於展示資料格式的虛構電影。",
  "recommendation": "用於驗證新增作品是否能套用既有卡片與詳情頁。",
  "score": 4.2,
  "poster": ""
}
```

## GitHub Pages 部署

1. 在 GitHub 建立一個新公開儲存庫（例如 `CineLog`）。
2. 將 **CineLog 資料夾內的檔案** 放進儲存庫最上層，使 `index.html` 位於根目錄，然後提交到 `main` 分支。
3. 進入儲存庫的 **Settings → Pages**，選擇 **Deploy from a branch**，分支為 `main`，資料夾為 `/ (root)`，儲存設定。
4. 部署完成後，網站通常位於 `https://你的帳號.github.io/CineLog/`（以 GitHub Pages 顯示的實際網址為準）。
5. 實際開啟線上網站，測試首頁、詳情頁、搜尋、篩選、收藏及圖片。

**GitHub Pages 網址：** 尚未部署，部署後請在此填入實際網址。

## 作品資訊與圖片聲明

資料為非暴雷原創短介及編輯主觀推薦分數（滿分 5 分），**不是 IMDb 或其他影評網站評分**。製作時參考下列官方或可信機構的作品資訊，未複製其文案或海報。擴充片單也參考影視作品目錄，以核對作品英文名稱及發行年份（評分不採用第三方分數）：

- [IMDb Top 250 Movies](https://www.imdb.com/chart/top/)
- [Rotten Tomatoes — The Biggest and Best Movies of the Last 25 Years](https://editorial.rottentomatoes.com/article/the-biggest-and-best-movies-of-the-last-25-years/)
- [Rotten Tomatoes — Critics Pick the Best TV Shows of the Last 25 Years](https://editorial.rottentomatoes.com/guide/rt25-critics-top-tv-shows-of-the-last-25-years-2/)


- 美國電影學會 AFI： [Christopher Nolan 作品年表](https://catalog.afi.com/Catalog/PersonDetails/175893)（星際效應、全面啟動、黑暗騎士）
- Studio Ghibli： [神隱少女](https://www.ghibli.jp/works/chihiro/)
- NEON： [寄生上流](https://www.neonrated.com/film/parasite)
- Pixar： [可可夜總會](https://www.pixar.com/coco) 與 [作品年表](https://www.pixar.com/feature-films/)
- Legendary： [沙丘](https://www.legendary.com/film/dune/)
- Universal Pictures： [真愛每一天](https://www.universalpicturesathome.com/movies/about-time)
- Sony Pictures / AMC： [絕命毒師簡介](https://www.sonypictures.com/tv/breakingbad)、[2008 首播資訊](https://www.amc.com/blogs/celebrate-breaking-bads-10th-anniversary-with-amcs-complete-series-marathon--1004379)
- Netflix Tudum： [怪奇物語 2016 首播資訊](https://www.netflix.com/tudum/features/stranger-things-10th-anniversary-vhs-special-edition-on-netflix)

`assets/posters/` 下的 SVG 是 **CineLog 自製抽象概念示意圖**，並非電影官方海報、角色或劇照。作品名稱及其相關權利仍歸個別權利人所有。

## 作業展示：規則可重用性

建議展示兩次狀態：先完成現有網站，再請 AI 執行「先閱讀 `AGENTS.md`，按照規範新增一部科幻電影，不新增專用 HTML」，比較新增前後的 `data/movies.json` 與網頁呈現，證明新增資料可重用同一套搜尋、卡片、詳細頁與收藏功能。

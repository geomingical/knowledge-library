# 知識書庫 Knowledge Library

收藏值得反覆閱讀的演講與課程，整理成繁體中文的閱讀頁。

網站：https://geomingical.github.io/knowledge-library/

## 目前收錄

| 資料夾 | 內容 |
|---|---|
| `2025_karpathy/` | Andrej Karpathy〈Deep Dive into LLMs〉完整中文伴讀 |
| `2026_grok-galaxy/` | Grok Bot Galaxy 三天活動的演講筆記與工作室紀錄 |
| `2026_poteto-agent-trust/` | lauren（@poteto）談如何讓 AI 程式設計代理值得信任 |

## 結構

- `index.html`：書庫首頁，列出所有內容，可搜尋與分類。
- `<年份>_<主題>/`：每個來源一個資料夾，頁面都是單一 HTML 檔，直接用瀏覽器開啟即可。
- `assets/`：首頁共用的樣式與腳本。
- `licenses/`：使用工具的授權聲明。

沒有建置步驟。網站由 GitHub Pages 直接發布 `main` 分支。

## 新增一篇

1. 建立 `<年份>_<主題>/index.html`。
2. 在首頁 `index.html` 加一張卡片，並更新篇數與分類數字。
3. 開 PR，合併後網站自動更新。

## 內容與權利

各頁是中文學習筆記與整理者自製圖解。原始演講、影片與畫面的權利屬於各自作者；本站不提供錄影下載。頁面以 [html-visualizer](https://github.com/chenjackle45/html-visualizer)（MIT）製作。

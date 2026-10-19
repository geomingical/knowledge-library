# 知識書庫：影片筆記製作與發布流程

本文件適用於本 repository。目標是把演講／訪談／課程做成可回到原始來源的繁體中文閱讀頁，不是把下載素材全部搬上網。以下流程以 2026-10-19 的 Felix Rieseberg 訪談製作為實際案例。

## 1. 先分清楚工具、私人來源與公開網站

| 位置 | 用途 | 是否加入本 repo |
|---|---|---|
| `$HOME/Desktop/Learning/video_script` | 取得字幕、下載與必要時的語音辨識 | 否 |
| `$HOME/Desktop/Learning/Text_to_visual` | 逐字稿轉視覺化的工作規範 | 否 |
| `$HOME/.agents/skills/html-visualizer` | HTML 範本、互動與驗證工具 | 否 |
| 本 repo 的上一層，例如 `../2026_Felix Rieseberg/` | 原始字幕、來源中繼資料、來源覆蓋紀錄與本機閱讀頁 | 否 |
| 本 repo 的 `<年份>_<主題>/index.html` | 可公開的中文編輯筆記 | 是 |
| 本 repo 的 `index.html`、`README.md` | 書庫入口與收錄清單 | 是 |

- 開始前讀取上述兩個工具工作區的 `AGENTS.md`、`video_script/README.md`，以及 `TRANSCRIPTION_EXPERIENCE.md` 對應來源與作業階段的章節。工具位置可能改變，先核對，不憑歷史記憶下指令。
- 做 HTML 前讀取 `html-visualizer/SKILL.md`、`references/teaching-companion.md`、配色排版與中英用詞檢查指引；使用已安裝範本，不另外建前端框架。
- 每次先確認真正的 Git 根目錄、remote、分支與未提交變動。本 repo 為 `geomingical/knowledge-library`；旁邊的素材資料夾不是發布根目錄。
- 使用者已有的素材唯讀，不改名、不覆寫、不搬動、不刪除。取得新素材也先檢查同名檔，重做時另開版本位置。
- `.nojekyll` 與 GitHub Pages 使檔案可直接公開；不要以為沒有首頁連結就等於私密。原始字幕、JSON、錄影、原始截圖、秘密金鑰、本機 QA 圖片一律不要加入新文章的發布清單。
- 既有文章有各自的歷史公開範圍；不藉新增文章改掉舊文章。新案預設僅公開中文編輯筆記與自製圖解，全文或原畫面須另有明確授權。

## 2. 先核對影片身分與字幕，不直接下載長影片

設定本次路徑；以下是本次實際使用的來源，後續案件必須換成新案，不要覆寫此資料夾：

```bash
TOOLS="$HOME/Desktop/Learning/video_script"
SOURCE="$HOME/Desktop/git_project/Knowledge/2026_Felix Rieseberg"
URL='https://www.youtube.com/watch?v=-tdNsYi8AXs'
```

在 `video_script` 工作目錄執行：

```bash
uv run yt-dlp --simulate --no-warnings \
  --print '%(id)s | %(title)s | %(duration_string)s' "$URL"
uv run yt-dlp --list-subs --no-warnings "$URL"
```

核對片名、頻道、發布日期、時長、字幕語言與章節表。標題相似或同一位講者，不代表是同一支影片。若已能從字幕資訊與實際字幕下載確認可用性，不必重複探測。

### 優先用原始字幕

本次以專案 CLI 取得原始文字：

```bash
uv run vt transcribe "$URL" --language en \
  --output "$SOURCE/transcript.vt.raw.txt"
```

成功時本次工具實際回報 `Method: youtube_subtitle | Language: en | Format: txt`。不要把字幕抽取描述成重新做了語音辨識。

另外保留可對時的英文自動字幕與影片說明：

```bash
uv run yt-dlp --skip-download --no-simulate \
  --write-info-json --write-auto-subs \
  --sub-langs en-orig --sub-format json3 \
  -o "$SOURCE/source.%(ext)s" "$URL"
```

- `en-orig` 是本次可用的字幕軌，其他影片要依實際結果選擇。人工字幕與自動字幕要明確區分。
- `--skip-download` 只是不下載影音，仍可保存字幕與中繼資料。
- 注意：單獨加 `--print` 會使 yt-dlp 進入模擬行為；若同時要寫檔，保留 `--no-simulate`。只看見標題輸出不代表檔案已存下。
- 本次從 JSON3 的每個 `events` 項目讀 `tStartMs / 1000`，按原順序串接 `segs[].utf8`，另存含 `[分:秒]` 的 `transcript.en.txt`。保留全部文字事件，不以去重為名丟掉有意義的教學回扣。原始 JSON3 不動。
- 若沒有字幕，才進入音訊下載與辨識。先讀 backend、long-media、performance/resumability 經驗章節；超過 30 分鐘通常採 faster-whisper 與語音活動偵測，並確認分塊檢查點。開始長作業前說明能否中斷續跑。
- 不為做中文概念筆記而自動啟動整份逐字翻譯。使用者要逐字稿／閱讀版／全文翻譯時才增加對應輸出；原文與整理稿始終分開。

## 3. 完整讀來源，建立可追溯的內容結構

1. 檢查原始文字字元數、空白分隔詞數、字幕最後時間，以及反覆出現的長詞組。開場預告與後文重複可能正常，不能機械刪除。
2. 按時間分段讀完全部來源；工具預覽若截斷，重新分段，不把「取得全文」當成「已讀全文」。抽查開頭、中間、結尾並辨認幻覺式循環。
3. 在私人來源資料夾建立 `source-map.md`：影片身分、取得方法、品質觀察、發布者章節 → 筆記章節的對照、保留與省略範圍、待確認處，以及原始檔 SHA-256。
4. 按來源的教學／訪談順序寫概念筆記。保留動機、前提、操作例子、思考轉折、失敗修正、限制與回扣；不要只保留三五個結論。
5. 預設繁體中文。首次出現的技術詞用半句白話解釋；正式產品名稱可保留英文。自動字幕的近音字須依可靠來源核對，不能憑感覺補出人名、型號或指令。
6. 區分「講者展示／自述」「主持人當場提議」「整理者補充」「本次實際驗證」。例如本次衣櫃只是延伸想法；儀表板明確使用假資料；硬體約 20 美元是受訪時說法，不是本次查到的售價。
7. 時間連結用真正的章節或字幕時間：YouTube 可用 `https://www.youtube.com/watch?v=VIDEO_ID&t=秒數s`。章節入口不等於逐句同步，不按文章長度平均分配時間。
8. 略去廣告、寒暄與重複預告時，公開頁要標示整理範圍。沒有逐字聽校、沒有重做示範，也要明講。

新增任何內容過濾／排除規則前，先列出既有資料前後數量與新被排除的樣本。不要默默丟掉有效內容。

## 4. 製作閱讀頁，保留既有書庫習慣

- 以 `assets/base-template.html` 的完整樣式區塊與評論／識別元件為基底；正文依本次來源編排。不要用任意行號切到 CSS 規則中間。
- 在 `<head>` 放入 `<meta name="html-visualizer-mode" content="teaching-companion">`。此標記只選擇檢查模式，不證明內容完整。
- 寫之前執行 `scripts/profile.py show --rules` 與 `scripts/session-label.sh`；填入本次識別資訊，不保留空白或範本標題。
- 開頭交代來源、時長、整理日期、範圍與限制；提供章節目錄、時間連結、返回書庫、來源與工具授權。
- 自製圖解清楚標成示意。沒有數字就不用統計圖；直線步驟可用列表式圖解，有分支或依賴才讀對應結構圖規範。
- 保留重點預覽／複製，以及選取文字評論。沿用既有頁的匯出模式：`vtCollectComments` 拼入重點，`vtBuildDecisionExport` 指向同一個內容組合函式。
- 預覽先顯示完整內容，確認後才複製；打開時把文字選取位置與捲動位置設為開頭。複製失敗應提供手動複製，不假報成功。
- 評論只存於瀏覽器，不是多人同步留言或伺服器備份。要讓讀者知道。
- 本機成品與原始素材放同層，預設 `<主題>-視覺化.html`。公開成品放 `<年份>_<主題>/index.html`，兩份正文一致，只調整必要的相對連結。
- 公開文章回首頁通常為 `../index.html#collection`；本次私人同層成品則為 `../knowledge-library/index.html#collection`。更深層文章須依實際層級調整。
- 公開頁可參照 `../licenses/html-visualizer-MIT.txt`，並保留工具致謝。工具授權不代表取得影片著作權。
- 使用 Tailwind CDN 就說明需要網路；不要宣稱完全離線。
- 首頁加入 `.reading-card`、正確的 `data-type` 與 `data-search`，更新來源入口、總數、類別數、預設結果文字、關於區與 README 收錄表。數字從當前頁面重新計算，不沿用舊紀錄。

## 5. 分開驗證內容、檔案與實際閱讀行為

### 靜態檢查

```bash
python3 "$HOME/.agents/skills/html-visualizer/scripts/verify.py" \
  '<公開成品的絕對路徑>'
```

這個工具會改寫受檢檔：套用設定、把字級／間距改成可調倍率、注入風格設定面板。驗完後才同步本機副本，避免兩份功能不同。

- 修正 HTML、CSS、JavaScript 的真實錯誤；不能為讓檢查變綠而補無關內容。
- 本次環境未找到 Playwright，工具的執行期、版面與字級覆蓋率三項沒有跑到。使用現有 Chromium 瀏覽器工具補驗，不把「未驗證」寫成通過，也不為此改全域環境。
- `vt-manual-copy-box` 是複製失敗時動態產生的元素；需檢查相關實作與實際互動，而不是盲目把靜態警告抹掉。
- 檢查全站本機 `href`／`src` 目標存在、錨點存在、id 無重複；核對來源時間沒有超過影片，且與來源章節對得上。
- 公開檔不能含私人絕對路徑、原始字幕控制區、原稿或未授權圖片；檢查實際待提交檔案，不只看忽略清單。
- 逐章核對 `source-map.md` 與正文；語法檢查不會發現曲解原意或遺漏概念。
- 比較原始素材雜湊，確認沒有意外改動。

### 真正開啟瀏覽器

在 repo 工作目錄啟動自己的暫時伺服器：

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

先確認埠未被其他服務占用；本次預覽入口為 `http://127.0.0.1:8765/2026_felix-claude-workflows/`。只停止自己啟動的伺服器，不殺其他人的工作。

至少檢查：

- 1440、768、390px 的首屏、正文中段、圖解、展開內容與頁尾；親自看畫面，量整頁是否橫向溢出。
- 章節目錄能到正確段落，時間連結帶正確來源影片與秒數。
- 開啟預覽、確認複製、讀回剪貼簿、Escape 關閉；不只看按鈕存在。
- 選文字新增評論，重新載入後仍在，匯出含評論，刪除後消失。使用自己的瀏覽器測試資料，不動讀者資料。
- 風格面板可開關；字級從 100% 改至 200% 確實影響正文，手機不橫向溢出，再還原。
- 首頁以講者與關鍵字搜尋，類別篩選數字正確，能進入文章並返回首頁。
- 載入及操作過程沒有 JavaScript 執行錯誤。
- 本機 `file://` 成品也能開啟與複製，回首頁與授權連結成立。

靜態工具的檢查、自己的瀏覽器補驗與未做的檢查要分開回報；不要把一次可用的畫面當成全站、所有版本或所有功能都已驗證。

## 6. Git 發布：依當次授權，沿用 PR 流程

本 repo 無建置步驟，GitHub Pages 從 `main` 根目錄發布。網站為：

https://geomingical.github.io/knowledge-library/

- 「製作筆記」不自動代表「可公開素材」；「推分支」與「合併到 main 上線」也要依當次使用者授權。歷史上曾直接推 main，不是永久許可。
- 本次使用者要求推 Git，採內容分支與 PR 發布；未使用 force push、reset 或覆蓋其他分支。
- 從最新 `origin/main` 開新分支，避免把先前留下的修正分支內容帶入新案。

```bash
git status --short --branch
git remote -v
git fetch origin
git switch -c content/<本次主題> origin/main
# 完成製作與驗證後，明確列檔，不用 git add .
git add index.html README.md <年份>_<主題>/index.html
git commit -m 'feat: add <topic> notes'
git push -u origin content/<本次主題>
gh pr create --base main --head content/<本次主題> \
  --title '<主題>' --body '<範圍、驗證與限制>'
```

上例尖括號須換成真實值。只在已獲上線授權時合併：

```bash
gh pr merge <PR編號> --merge
gh pr view <PR編號> --json state,mergeCommit,url
gh run list --branch main --limit 3 \
  --json databaseId,status,conclusion,headSha,workflowName
```

不能把舊部署成功當成本次成功：比對 Pages run 的 `headSha` 與本次合併 commit。取得本次 run 後，可用 `gh run watch <run編號> --exit-status` 等待結果。

部署成功後還要：

1. 在正式網站以搜尋 → 新文章 → 章節 → 預覽／複製 → 返回書庫走一次。
2. 比對正式首頁與新文章的完整檔案 SHA-256，確認和本機待發布檔案一致；HTTP 200 只代表取得檔案，不代表取得新版本。
3. 最後交付網站網址、本機成品、Git PR／提交，以及明確限制。

## 7. 完成後留下流程，清掉本次暫時物

- 流程寫在本文件；來源覆蓋與原始檔雜湊留在私人案件的 `source-map.md`。不要在公開文件放入完整逐字稿或帶憑證的來源網址。
- 本次是先完成並驗證內容發布，再另開文件分支補上這份 `AGENTS.md`，讓流程記錄對應實際跑通的步驟。
- 只保留原始素材、正式本機成品與必要來源紀錄；臨時產頁片段、檢查腳本與截圖不要混進公開 repo。停止自己的伺服器、關閉自己的瀏覽器分頁。
- 不把頁面 UI 測試說成已重現影片內的產品示範。

## 本次完成紀錄：Felix Rieseberg

- 來源：`https://www.youtube.com/watch?v=-tdNsYi8AXs`，How I AI，2026-05-25，59:25。
- 公開頁：`2026_felix-claude-workflows/index.html`。
- 私人來源位置：`../2026_Felix Rieseberg/`；本機成品為 `felix-claude-workflows-視覺化.html`。
- 原始 vt 文字：62,694 字元、12,259 個空白分隔詞。JSON3 共 3,400 事件、3,399 個含文字事件，最後文字起點 59:22.400。沒有新增去重規則。
- 筆記：14 章、21 個章節時間連結；首頁 14 篇（1 課程、13 訪談／演講）。
- 發布前全站檢查：19 個 HTML、669 個本機參照，沒有缺檔或缺錨點；新文章無重複 id。這是當時數量，不是日後固定驗收值。
- 實際瀏覽器檢查：1440／768／390px，評論新增／保存／匯出／刪除、複製剪貼簿、目錄與來源展開、200% 字級、搜尋分類與來回導覽；正式站另測搜尋、進文、章節、複製與手機畫面。
- 內容 PR：#5；內容 commit `48c3b6b`；合併 commit `87e5a121bce31b400f7473d468015b9cf0cd54db`。
- Pages run `39187657527` 完成且為 success，對應上述合併 commit。
- 正式站首頁 SHA-256：`cfd580d2c94efb2a9f160d4d06de33ac7a986a8e9b5d7523846f580b7eba1068`。
- 正式站文章 SHA-256：`276ad3801f9a5e227c598359d9335117b9cd6e6e1c8b70074c22e0d408539a9b`。
- 兩份正式檔案雜湊均與本機一致；原始來源檔雜湊未變。
- 限制：依自動字幕而非逐字人工聽校；未重建房屋規劃器、live artifact 或硬體；HTML verifier 的三項 Playwright 檢查未執行，另用 Chromium 實際操作補驗，不宣稱兩者涵蓋完全相同。

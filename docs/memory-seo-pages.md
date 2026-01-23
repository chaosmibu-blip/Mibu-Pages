# 記憶庫：SEO 公開頁面

## TL;DR

- **功能**：城市/景點/行程的 SEO 頁面，讓 Google 索引後引導下載 App
- **關鍵檔案**：`src/features/seo/`（API、Metadata、JSON-LD）
- **渲染方式**：SSG + ISR（1hr 重新驗證）
- **相關 API**：`/api/seo/cities`、`/api/seo/places`、`/api/seo/trips`
- **頁面路由**：`/explore`、`/city/[slug]`、`/place/[id]`、`/trip/[id]`

---

> **跨端對應**
> - 後端記憶庫：`docs/memory-web-official.md`
> - API 契約：`docs/contracts/WEB.md`

---

## 職責範圍

SEO 公開頁面負責讓搜尋引擎索引 Mibu 的內容，引導旅客下載 App。

### 頁面清單

| 路由 | 用途 | 資料來源 |
|------|------|----------|
| `/explore` | 城市列表 | `GET /api/seo/cities` |
| `/city/[slug]` | 城市詳情 | `GET /api/seo/cities/:slug` |
| `/place/[id]` | 景點詳情 | `GET /api/seo/places/by-id/:id` |
| `/trips` | 行程列表 | `GET /api/seo/trips` |
| `/trips/[city]` | 城市行程 | `GET /api/seo/trips?city=xxx` |
| `/trips/[city]/[district]` | 區域行程 | `GET /api/seo/trips?city=xxx&district=xxx` |
| `/trip/[id]` | 行程詳情 | `GET /api/seo/trips/:id` |

---

## 技術規格

### 渲染方式

所有 SEO 頁面使用 **SSG + ISR**（增量靜態重新生成）：
- 重新驗證時間：1 小時（3600 秒）
- 建置時預先生成熱門頁面
- 首次請求時生成新頁面

### 程式碼位置

```
src/features/seo/
├── api/           # API 資料獲取（依照 WEB 契約）
├── metadata/      # Metadata 產生器
├── jsonLd/        # JSON-LD 結構化資料
├── components/    # SEO 專用組件
└── types/         # 型別定義
```

---

## SEO 優化

### Metadata

每個頁面需生成：
- `title`：包含地點名稱和關鍵字
- `description`：150 字以內的描述
- `canonical`：標準化 URL
- `openGraph`：社群分享資訊

### JSON-LD

支援的結構化資料類型：
- `TouristAttraction`：景點
- `TouristTrip`：行程
- `BreadcrumbList`：麵包屑導航
- `ItemList`：列表頁

---

## 注意事項

1. **Fallback 資料**：API 失敗時顯示預設內容，避免頁面錯誤
2. **圖片優化**：使用 Next.js Image 組件，支援 lazy loading
3. **多語系**：支援 `nameI18n` 等欄位（未來擴展）

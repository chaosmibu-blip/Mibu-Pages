# CLAUDE.md

> **角色定位**：本專案是**契約執行者**，依照後端契約實作官網功能。後端是唯一真相來源，官網不可自行定義 API 或型別。

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## 快速路由表 🚀

遇到關鍵字時，直接查閱對應文件：

| 關鍵字 | 查閱文件 |
|--------|----------|
| 登入、OAuth、認證、E1006、E1007 | `docs/memory-merchant-portal.md` |
| 訂閱、金流、Stripe、Recur、退款 | `docs/memory-merchant-portal.md` |
| SEO、城市、景點、行程、Metadata | `docs/memory-seo-pages.md` |
| 元件、UI、Button、Card、AuthGuard | `docs/memory-components.md` |
| API 型別、端點格式 | 後端 `docs/contracts/WEB.md` |
| 錯誤碼、E1xxx~E9xxx | 後端 `docs/contracts/COMMON.md` |
| 同步指令、待辦任務 | 後端 `docs/sync-web.md` |
| 已完成任務、回報狀態 | `docs/sync-backend.md` |

---

## 溝通風格

- 用口語化的繁體中文
- 像朋友聊天一樣解釋
- 專有名詞要順便說明白話意思
- 修改前先說「我想做什麼」和「為什麼」

---

## 底線規則 🚫

### 安全底線

| 禁止事項 | 原因 |
|----------|------|
| 在程式碼中硬編碼 API keys、tokens | 會被 git 追蹤，造成洩漏 |
| 繞過 AuthGuard 存取商家頁面 | 破壞認證機制 |
| 在前端儲存敏感資料（密碼、信用卡） | 前端不安全 |
| 自行實作 OAuth 流程 | 應使用現有的 Google/Apple SDK |

### 業務底線

| 禁止事項 | 原因 |
|----------|------|
| 自行定義 API 型別 | 必須依照後端契約 |
| 修改金流邏輯（Stripe/Recur） | 影響付款正確性 |
| 更改退款規則（7 天內） | 涉及消保法規定 |
| 刪除或修改 SEO metadata 格式 | 影響搜尋排名 |

### 禁止修改的檔案

| 檔案 | 原因 |
|------|------|
| `shared/schema.ts` | Drizzle ORM schema，改動影響資料庫 |
| `.npmrc` | npm 認證設定 |
| `next.config.ts` | 除非明確需要調整 Next.js 設定 |

---

## API 契約規則 ⚡

**後端是唯一真相來源**，官網必須依照後端契約實作。

### 契約位置

```
後端 (MIBU_REPLIT)
└── docs/contracts/
    ├── COMMON.md    ← 認證、錯誤碼、共用型別
    └── WEB.md       ← 官網專用 API
```

### 同步規則

1. **官網不可自行定義 API 型別** - 必須依照契約
2. **發現不一致時** - 回報後端修正契約，而非自行修改官網
3. **後端改契約後** - 官網需同步更新

### 快速指令

| 指令 | 說明 |
|------|------|
| 「同步官網與 WEB 契約」 | 讀取後端契約，更新官網型別定義 |
| 「審計架構一致性」 | 比對官網與後端的 API 差異 |
| 「同步專案記憶」 | 更新 CLAUDE.md 確保與現況一致 |
| 「檢查後端同步清單」 | 讀取 `docs/sync-web.md` 執行同步指令 |

---

## 三端協作 🔗

Mibu 產品由三個獨立專案組成，後端是唯一真相來源。

### 專案倉庫

| 專案 | 倉庫 | 職責 |
|------|------|------|
| **後端** | [MIBU_REPLIT](https://github.com/chaosmibu-blip/MIBU_REPLIT) | API、資料庫、契約制定 |
| **APP** | [mibu-app](https://github.com/chaosmibu-blip/mibu-app) | 扭蛋、行程規劃、收藏 |
| **官網** | [Mibu-Pages](https://github.com/chaosmibu-blip/Mibu-Pages) | SEO、商家訂閱 |

### 同步機制

```
後端完成 API 變更
    ↓
更新 docs/contracts/*.md（契約）
    ↓
更新 docs/sync-web.md 或 docs/sync-app.md（同步指令）
    ↓
官網/APP 讀取同步指令並執行
    ↓
回報完成狀態到 docs/sync-backend.md
```

### 協作規範

- **契約位置**: 後端 `docs/contracts/`
- **同步指令**: 後端 `docs/sync-web.md`（官網用）
- **完成回報**: 官網 `docs/sync-backend.md`

---

## Project Overview

**Mibu-Pages 是 Mibu 旅遊扭蛋 App 的官方網站**，不是 App 本身。

服務兩類用戶：
- **一般旅客**：透過 SEO 頁面讓 Google 搜尋「景點」「行程」時能找到 Mibu，引導下載 App
- **商家**：購買訂閱方案（iOS 規定跨平台訂閱必須在官網完成）

### 本專案負責：
- 品牌宣傳首頁（引導下載 App）
- SEO 公開頁面（城市、景點、行程，供搜尋引擎索引）
- 商家後台（登錄、訂閱購買、查看訂閱、取消訂閱、申請退款）
- 法律頁面（隱私政策、服務條款、退款政策）
- 客服支援表單

### 本專案不負責：
- 扭蛋核心功能（在 App 內）
- 用戶註冊/登錄（App 處理）
- 旅程規劃操作（App 處理）
- 商家註冊、店家認領、數據報表（僅在 App 中提供）

## 技術棧

- **框架**: Next.js 15 (App Router)
- **樣式**: Tailwind CSS 3.x + shadcn/ui
- **資料**: TanStack Query 5.x
- **表單**: React Hook Form + Zod
- **狀態管理**: Zustand + persist（localStorage）
- **認證**: Google/Apple OAuth
- **金流**: Stripe/Recur 雙軌

## Commands

```bash
npm run dev          # 開發模式（tsx server/index.ts 啟動 Next.js）
npm run build        # 建置生產版本
npm run start        # 啟動生產伺服器
npm run check        # TypeScript 型別檢查
npm run db:push      # 推送 schema 到資料庫
```

## 專案結構

```
app/                    # Next.js App Router 頁面
├── page.tsx            # 首頁 + 下載按鈕
├── explore/            # 城市列表頁
├── city/[slug]/        # 城市詳情頁 (SSG + ISR)
├── place/[id]/         # 景點詳情頁 (SSG + ISR)
├── trips/              # 行程列表頁 (SSG + ISR)
├── trips/[city]/       # 城市行程頁 (SSG + ISR)
├── trips/[city]/[district]/ # 區域行程頁 (SSG + ISR)
├── trip/[id]/          # 行程詳情頁 (SSG + ISR)
├── crowdfund/          # 募資系統（WEB v1.2.0 新增）
│   ├── page.tsx        # 募資活動列表
│   ├── [id]/           # 募資詳情 + 贊助
│   └── my-contributions/ # 我的贊助紀錄
├── for-business/       # 商家合作頁面
├── merchant/           # 商家登入/後台
│   ├── login/          # 商家登入（Google/Apple OAuth）
│   ├── dashboard/      # 儀表板
│   ├── places/         # 景點管理（Phase 6 更新）
│   │   └── new/        # 新增景點頁面（#005）
│   ├── subscribe/      # 結帳頁面
│   └── subscription/   # 我的訂閱（唯讀）
├── privacy/            # 隱私權政策
├── terms/              # 服務條款
├── refund/             # 退款與取消政策
├── support/            # 技術支援
├── sitemap.ts          # 動態 sitemap
└── robots.ts           # robots.txt

src/
├── constants/
│   └── errorCodes.ts   # 錯誤碼常數（依照 COMMON 契約）
├── features/
│   ├── seo/            # SEO 模組化架構（程式化 SEO 用）
│   │   ├── api/        # API 資料獲取層（依照 WEB 契約）
│   │   ├── metadata/   # Metadata 產生器
│   │   ├── jsonLd/     # JSON-LD 結構化資料產生器
│   │   ├── components/ # SEO 專用組件（Breadcrumb, JsonLdScript）
│   │   └── types/      # 型別定義（依照 WEB 契約）
│   ├── crowdfund/      # 募資系統模組（WEB v1.2.0 新增）
│   │   ├── api/        # API 層
│   │   └── types/      # 型別定義
│   └── events/         # 活動系統模組（#006）
│       ├── api/        # API 層（getEvents, getActiveEvents）
│       ├── types/      # 型別定義（Event, EventType）
│       └── components/ # 組件（EventsSection）
├── services/
│   └── api/
│       ├── index.ts    # 通用 API 請求處理
│       └── merchant.ts # 商家 API（依照 WEB 契約 v1.2.0）
├── components/
│   ├── ui/             # shadcn/ui 元件
│   ├── layout/         # Header, Footer
│   ├── common/         # 通用業務元件
│   └── auth/           # AuthGuard
├── hooks/              # useAuth, useRefundEligibility, useRefundRequest 等
└── lib/                # 工具函數

server/
├── index.ts            # 啟動 Next.js 進程
└── routes.ts           # API 端點（mock 資料）

shared/
└── schema.ts           # Drizzle ORM schema + Zod validation
```

> **注意**: `client/` 目錄是舊的 Vite + React SPA 代碼，已遷移至 Next.js，不再使用。

## 頁面規格

### SEO 頁面（面向旅客）
| 路由 | 渲染方式 |
|------|----------|
| `/` | SSG + ISR (5min) |
| `/explore` | SSG + ISR (1hr) |
| `/city/[slug]` | SSG + ISR (1hr) |
| `/place/[id]` | SSG + ISR (1hr) |
| `/trips` | SSG + ISR (1hr) |
| `/trips/[city]` | SSG + ISR (1hr) |
| `/trips/[city]/[district]` | SSG + ISR (1hr) |
| `/trip/[id]` | SSG + ISR (1hr) |

### 商家頁面
| 路由 | 渲染方式 |
|------|----------|
| `/for-business` | 靜態 |
| `/for-business/pricing` | CSR |
| `/merchant/login` | CSR |
| `/merchant/places` | CSR (需認證) |
| `/merchant/places/new` | CSR (需認證) |
| `/merchant/subscription` | CSR (需認證) |
| `/merchant/subscribe` | CSR (需認證) |

## 認證系統

- **狀態管理**: Zustand + persist（localStorage）
- **Store**: `src/hooks/useAuth.ts`
- **保護元件**: `src/components/auth/AuthGuard.tsx`
- **登入元件**: `src/components/common/SocialLoginButtons.tsx`
- **錯誤代碼**（依照 COMMON 契約）:
  - `E1006` (PENDING_APPROVAL): 帳號審核中
  - `E1007` (ROLE_MISMATCH): 帳號非商家類型

## 商家功能範圍（官網限定）

| 功能 | 說明 |
|------|------|
| 登入 | Google/Apple OAuth，非商家帳號顯示錯誤引導下載 App |
| 景點管理 | 認領已有景點或新增自有景點（需審核） |
| 新增景點 | 填寫基本資訊、聯絡方式、營業時間，提交審核 |
| 訂閱購買 | 選擇方案 → 登入 → 結帳（Stripe/Recur 雙軌金流） |
| 查看訂閱 | 顯示方案、狀態、到期日、配額 |
| 取消訂閱 | 在訂閱管理頁面點擊取消，服務持續至當期結束 |
| 申請退款 | 首次付款 7 天內可申請，符合消保法規定 |

### 商家等級（依照 WEB 契約）

```typescript
type MerchantLevel = 'free' | 'pro' | 'premium' | 'partner';
```

## 金流串接

| 金流商 | 串接方式 | 回應格式 |
|--------|----------|----------|
| **Stripe** | Checkout Session | `{ checkoutUrl }` |
| **Recur** | SDK `redirectToCheckout` | `{ productId, publishableKey }` |

## 下載按鈕規格

- **iOS**：跳轉 App Store
- **Android**：Toast 顯示「敬請期待」

## Environment Variables

```env
NEXT_PUBLIC_API_URL=後端 API URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=Google OAuth Client ID
NEXT_PUBLIC_APPLE_CLIENT_ID=Apple Sign In Client ID
NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY=Recur 公開金鑰
DATABASE_URL=PostgreSQL 連線字串
BASE_URL=網站基礎 URL（預設 https://mibu-travel.com）
```

## 後端 API

| 環境 | URL |
|------|-----|
| 開發 | `https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev` |
| 生產 | `https://gacha-travel--s8869420.replit.app` |

## 路徑別名

```
@/*            → ./src/*
@/features/*   → ./src/features/*
@/components/* → ./src/components/*
@/lib/*        → ./src/lib/*
@/hooks/*      → ./src/hooks/*
```

## 開發原則

- 全程使用中文溝通
- **遵循後端提供的 API 契約**（見上方「API 契約規則」）
- 所有頁面需響應式（手機優先）
- SEO 頁面使用 SSG + ISR
- 商家頁面需認證保護

---

## 強制查閱規則 ⚡

執行任何修改前，**必須先讀取對應記憶庫檔案**：

| 修改範圍 | 必讀記憶庫 |
|----------|------------|
| SEO 頁面（城市、景點、行程） | `docs/memory-seo-pages.md` |
| 商家後台（登入、訂閱、退款） | `docs/memory-merchant-portal.md` |
| 共用元件（UI、Layout） | `docs/memory-components.md` |
| API 型別定義 | 後端 `docs/contracts/WEB.md` |
| 錯誤處理 | 後端 `docs/contracts/COMMON.md` |

### 同步指令執行

收到「檢查後端同步清單」指令時：

1. 讀取後端 `docs/sync-web.md`
2. 執行所有待完成任務
3. 更新 `docs/sync-backend.md` 回報狀態
4. Commit + Push

## 網域

- **正式網域**: `https://mibu-travel.com`
- **Sitemap**: `https://mibu-travel.com/sitemap.xml`

## 專案特性

| 項目 | 說明 |
|------|------|
| **複雜度** | 中（UI、SEO、金流串接） |
| **獨立性** | 依賴後端 API |
| **部署** | Replit Publish |

官網相對單純，主要是 UI 實作和 API 串接，熟悉 Next.js 即可快速上手。

---

## 募資系統

位於 `src/features/crowdfund/`，用於群眾募資功能。依照 WEB 契約 v1.2.0。

### 頁面

| 路由 | 用途 | 渲染方式 |
|------|------|----------|
| `/crowdfund` | 募資活動列表 | SSG + ISR |
| `/crowdfund/[id]` | 募資活動詳情 + 贊助 | CSR |
| `/crowdfund/my-contributions` | 我的贊助紀錄 | CSR (需認證) |

### API 端點

| 端點 | 用途 | 認證 |
|------|------|------|
| `GET /api/crowdfund/campaigns` | 活動列表 | 公開 |
| `GET /api/crowdfund/campaigns/:id` | 活動詳情 | 公開 |
| `POST /api/crowdfund/checkout` | 建立 Stripe 結帳 | 選填 |
| `GET /api/crowdfund/my-contributions` | 我的贊助 | 必填 |

---

## 活動系統

位於 `src/features/events/`，用於首頁活動區塊顯示。依照 WEB 契約 v1.2.0。

### 活動類型

| 類型 | 說明 | 顏色 |
|------|------|------|
| `announcement` | 公告 | 藍色 |
| `festival` | 節慶 | 橘色 |
| `limited` | 限時 | 紅色 |

### API 端點

| 端點 | 用途 | 認證 |
|------|------|------|
| `GET /api/events` | 活動列表 | 公開 |

支援篩選參數：`type`、`status`、`limit`

### 使用方式

```tsx
import { EventsSection, getActiveEvents } from '@/features/events';

// 獲取進行中的活動
const events = await getActiveEvents(3);

// 在頁面中使用
<EventsSection events={events} />
```

---

## SEO 模組架構

位於 `src/features/seo/`，用於程式化 SEO。依照 WEB 契約 v1.2.0。

### 使用方式

```tsx
import {
  // API 獲取
  getCities, getCityDetail, getRelatedCities, getCityDistricts,
  getPlaces, getPlaceById, getPlaceBySlug,
  getTrips, getTripsByCity, getTripsByCityAndDistrict, getTripDetail, getRelatedTrips,
  getDistrictDetail,

  // Metadata 產生器
  generateCityMetadata, generatePlaceMetadata, generateTripMetadata,
  generateCityTripsMetadata, generateDistrictTripsMetadata,

  // JSON-LD 產生器
  generateCityJsonLd, generatePlaceJsonLd, generateTripJsonLd,
  generatePlacesListJsonLd, generateCityTripsJsonLd,
  cityBreadcrumb, placeBreadcrumb, tripDetailBreadcrumb,

  // 組件
  Breadcrumb, JsonLdScript, SeoPageHeader,

  // 型別
  type City, type Place, type Trip,
  type CityDetailResponse, type PlaceDetailResponse, type TripDetailResponse,
  type PlacesResponse, type DistrictDetailResponse,
} from '@/features/seo';
```

### SEO API 端點（依照 WEB 契約 v1.2.0）

| 端點 | 用途 | 函數 |
|------|------|------|
| `GET /api/seo/cities` | 城市列表 | `getCities()` |
| `GET /api/seo/cities/:slug` | 城市詳情（含景點） | `getCityDetail(slug)` |
| `GET /api/seo/cities/:slug/related` | 相關城市 | `getRelatedCities(slug)` |
| `GET /api/seo/cities/:slug/districts` | 城市行政區列表 | `getCityDistricts(slug)` |
| `GET /api/seo/places` | 景點列表（支援搜尋/篩選） | `getPlaces(params)` |
| `GET /api/seo/places/:slug?city=xxx` | 景點詳情（依 slug） | `getPlaceBySlug(slug, city)` |
| `GET /api/seo/places/by-id/:id` | 景點詳情（依 ID） | `getPlaceById(id)` |
| `GET /api/seo/districts/:citySlug/:districtSlug` | 行政區詳情 | `getDistrictDetail(city, district)` |
| `GET /api/seo/trips` | 行程列表 | `getTrips()` |
| `GET /api/seo/trips?city=xxx` | 城市行程 | `getTripsByCity(city)` |
| `GET /api/seo/trips?city=xxx&district=xxx` | 區域行程 | `getTripsByCityAndDistrict(city, district)` |
| `GET /api/seo/trips/:id` | 行程詳情（含景點） | `getTripDetail(id)` |
| `GET /api/seo/trips/:id/related` | 相關行程 | `getRelatedTrips(id)` |

---

## 錯誤處理

使用 `src/constants/errorCodes.ts`（依照 COMMON 契約 v1.0.0）：

```typescript
import { getErrorMessage, isAuthError, isMerchantError } from '@/constants/errorCodes';

// 取得中文錯誤訊息
const message = getErrorMessage('E1007'); // "帳號類型不符"

// 判斷錯誤類型
if (isAuthError(code)) { /* 認證錯誤 */ }
if (isMerchantError(code)) { /* 商家錯誤 */ }
```

### 常用錯誤碼

| 錯誤碼 | 常數 | 說明 |
|--------|------|------|
| E1001 | AUTH_REQUIRED | 請先登入 |
| E1002 | AUTH_TOKEN_EXPIRED | 登入已過期 |
| E1006 | PENDING_APPROVAL | 帳號審核中 |
| E1007 | ROLE_MISMATCH | 帳號類型不符 |
| E4009 | PLACE_LIMIT_REACHED | 已達景點數量上限 |
| E7001 | PAYMENT_FAILED | 付款失敗 |
| E7002 | SUBSCRIPTION_EXPIRED | 訂閱已過期 |

---

## 常見任務與流程

### 任務類型

| 任務 | 頻率 | 說明 |
|------|------|------|
| 串接後端 API | 高 | 依照契約新增/更新 API 呼叫 |
| 新增頁面 | 中 | 在 `app/` 建立新路由 |
| 同步後端契約 | 中 | 執行「檢查後端同步清單」 |
| 修復 bug | 中 | 處理錯誤、UI 問題 |
| 更新 UI 元件 | 低 | 修改 `src/components/` |

### 標準流程

**串接 API**：
1. 讀取後端契約確認端點格式
2. 在 `src/features/*/api/` 新增函數
3. 在 `src/features/*/types/` 新增型別
4. 在頁面中使用

**新增頁面**：
1. 讀取對應記憶庫（SEO/商家）
2. 在 `app/` 建立資料夾和 `page.tsx`
3. 決定渲染方式（SSG/CSR）
4. 如需認證，包裹 `AuthGuard`

**同步後端契約**：
1. 讀取後端 `docs/sync-web.md`
2. 執行所有待完成任務
3. 更新 `docs/sync-backend.md`
4. Commit + Push

---

## 品質標準

### 驗收標準（什麼叫「做完了」）

- [ ] `npm run check` 通過（無 TypeScript 錯誤）
- [ ] 頁面響應式（手機、平板、桌面）
- [ ] API 呼叫依照後端契約
- [ ] 商家頁面有 AuthGuard 保護
- [ ] SEO 頁面有正確的 metadata

### 程式碼風格

| 項目 | 規範 |
|------|------|
| 語言 | TypeScript（嚴格模式） |
| 元件 | 函數式元件 + hooks |
| 樣式 | Tailwind CSS，不用 inline style |
| 狀態 | 伺服器狀態用 TanStack Query，客戶端狀態用 Zustand |
| 表單 | React Hook Form + Zod 驗證 |

### 測試標準

目前專案**沒有測試框架**，驗收依賴：
- TypeScript 型別檢查
- 手動測試關鍵流程

### Commit 規範

```
<type>: <簡短描述>

<詳細說明（選填）>
```

**type 類型**：
- `feat`: 新功能
- `fix`: 修復 bug
- `docs`: 文件更新
- `refactor`: 重構（不改功能）
- `style`: 樣式調整
- `chore`: 雜項（依賴更新等）

**範例**：
```
feat: 新增商家優惠券管理頁面

- 新增 /merchant/coupons 路由
- 串接 GET/POST/DELETE coupon API
```

---

## 結束前檢查清單

每次任務完成前，確認以下項目：

### 必檢項目

- [ ] `npm run check` 通過
- [ ] 沒有 console.log 殘留
- [ ] 沒有硬編碼的測試資料
- [ ] 敏感資訊沒有進入 git

### 依任務類型

**如果修改了 API 呼叫**：
- [ ] 型別與後端契約一致
- [ ] 錯誤處理完整

**如果新增了頁面**：
- [ ] 更新 CLAUDE.md 專案結構（如有需要）
- [ ] SEO 頁面有 metadata
- [ ] 商家頁面有 AuthGuard

**如果是同步任務**：
- [ ] 更新 `docs/sync-backend.md` 回報狀態
- [ ] Commit 訊息包含任務編號

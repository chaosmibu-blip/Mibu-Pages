# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 溝通風格

- 用口語化的繁體中文
- 像朋友聊天一樣解釋
- 專有名詞要順便說明白話意思
- 修改前先說「我想做什麼」和「為什麼」

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
├── for-business/       # 商家合作頁面
├── merchant/           # 商家登入/後台
│   ├── login/          # 商家登入（Google/Apple OAuth）
│   ├── dashboard/      # 儀表板
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
│   └── seo/            # SEO 模組化架構（程式化 SEO 用）
│       ├── api/        # API 資料獲取層（依照 WEB 契約）
│       ├── metadata/   # Metadata 產生器
│       ├── jsonLd/     # JSON-LD 結構化資料產生器
│       ├── components/ # SEO 專用組件（Breadcrumb, JsonLdScript）
│       └── types/      # 型別定義（依照 WEB 契約）
├── services/
│   └── api/
│       ├── index.ts    # 通用 API 請求處理
│       └── merchant.ts # 商家 API（依照 WEB 契約）
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
| `/` | 靜態 |
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

## SEO 模組架構

位於 `src/features/seo/`，用於程式化 SEO。依照 WEB 契約 v1.0.0。

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

### SEO API 端點（依照 WEB 契約 v1.0.0）

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

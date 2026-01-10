# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
- **錯誤代碼**:
  - `OAUTH_NEW_USER_TRAVELER_ONLY`: 帳號未註冊為商家
  - `ROLE_MISMATCH`: 帳號非商家類型

## 商家功能範圍（官網限定）

| 功能 | 說明 |
|------|------|
| 登入 | Google/Apple OAuth，非商家帳號顯示錯誤引導下載 App |
| 訂閱購買 | 選擇方案 → 登入 → 結帳（Stripe/Recur 雙軌金流） |
| 查看訂閱 | 顯示方案、狀態、到期日、配額 |
| 取消訂閱 | 在訂閱管理頁面點擊取消，服務持續至當期結束 |
| 申請退款 | 首次付款 7 天內可申請，符合消保法規定 |

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
@/*           → ./src/*
@/components/* → ./src/components/*
@/lib/*       → ./src/lib/*
@/hooks/*     → ./src/hooks/*
```

## 開發原則

- 全程使用中文溝通
- 遵循後端提供的 API 契約
- 所有頁面需響應式（手機優先）
- SEO 頁面使用 SSG + ISR
- 商家頁面需認證保護

## 網域

- **正式網域**: `https://mibu-travel.com`
- **Sitemap**: `https://mibu-travel.com/sitemap.xml`

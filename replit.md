# Mibu 官方網站

## 專案簡介
Mibu 官方網站同時服務兩類用戶：
- **一般旅客**：透過程式化 SEO 頁面，讓 Google 搜尋「景點」「行程」時能找到 Mibu，引導下載 App
- **商家**：購買訂閱方案（iOS 規定跨平台訂閱必須在官網完成）

## 技術棧
- **框架**: Next.js 15 (App Router)
- **樣式**: Tailwind CSS 3.x + shadcn/ui
- **資料**: TanStack Query 5.x
- **表單**: React Hook Form + Zod

## 專案結構
```
├── app/                    # Next.js App Router 頁面
│   ├── layout.tsx          # 根佈局
│   ├── page.tsx            # 首頁
│   ├── explore/            # 城市列表頁
│   ├── city/[slug]/        # 城市詳情頁 (SSG + ISR)
│   ├── place/[id]/         # 景點詳情頁 (SSG + ISR)
│   ├── trips/              # 行程列表頁 (SSG + ISR)
│   ├── trips/[city]/       # 城市行程頁 (SSG + ISR)
│   ├── trips/[city]/[district]/ # 區域行程頁 (SSG + ISR)
│   ├── trip/[id]/          # 行程詳情頁 (SSG + ISR)
│   ├── for-business/       # 商家合作頁面
│   ├── merchant/           # 商家登入/後台
│   ├── privacy/            # 隱私權政策
│   ├── terms/              # 服務條款
│   ├── support/            # 技術支援
│   ├── sitemap.ts          # 動態 sitemap
│   └── robots.ts           # robots.txt
├── src/
│   ├── components/         # 共用元件
│   │   ├── ui/             # shadcn/ui 元件
│   │   ├── layout/         # Header, Footer
│   │   └── common/         # 通用業務元件
│   ├── lib/                # 工具函數
│   └── hooks/              # 自訂 Hooks
├── next.config.mjs         # Next.js 設定
├── tailwind.config.ts      # Tailwind 設定
└── tsconfig.json           # TypeScript 設定
```

## 開發指令
```bash
# 開發伺服器
npx next dev -p 5000

# 建置
npx next build

# 生產環境
npx next start -p 5000
```

## 後端 API
| 環境 | URL |
|------|-----|
| 開發 | `https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev` |
| 生產 | `https://gacha-travel--s8869420.replit.app` |

## 頁面結構

### 面向一般旅客（SEO）
| 路由 | 說明 | 渲染方式 |
|------|------|----------|
| `/` | 首頁 + 下載按鈕 | 靜態 |
| `/explore` | 城市列表 | SSG + ISR (1hr) |
| `/city/[slug]` | 城市詳情 | SSG + ISR (1hr) |
| `/place/[id]` | 景點詳情 | SSG + ISR (1hr) |
| `/trips` | 行程列表（依城市） | SSG + ISR (1hr) |
| `/trips/[city]` | 城市行程（依區域） | SSG + ISR (1hr) |
| `/trips/[city]/[district]` | 區域行程列表 | SSG + ISR (1hr) |
| `/trip/[id]` | 行程詳情 | SSG + ISR (1hr) |

### 面向商家
| 路由 | 說明 | 渲染方式 |
|------|------|----------|
| `/for-business` | 商家合作介紹 | 靜態 |
| `/for-business/pricing` | 訂閱方案（商家/行程卡等級） | CSR |
| `/merchant/login` | 商家登入（Google/Apple OAuth） | CSR |
| `/merchant/subscription` | 我的訂閱（唯讀） | CSR (需認證) |
| `/merchant/subscribe` | 結帳頁面 | CSR (需認證) |

### 法律與支援
| 路由 | 說明 |
|------|------|
| `/privacy` | 隱私權政策 |
| `/terms` | 服務條款 |
| `/refund` | 退款與取消政策 |
| `/support` | 技術支援 |

## 商家功能範圍（官網限定）
| 功能 | 說明 |
|------|------|
| 登入 | Google/Apple OAuth，非商家帳號顯示錯誤引導下載 App |
| 訂閱購買 | 選擇方案 → 登入 → 結帳（Stripe/Recur 雙軌金流） |
| 查看訂閱 | 顯示方案、狀態、到期日、配額 |
| 取消訂閱 | 在訂閱管理頁面點擊取消，服務持續至當期結束 |
| 申請退款 | 首次付款 7 天內可申請，符合消保法規定 |

> 商家註冊、店家認領、數據報表等功能僅在 App 中提供

## 認證系統
- **狀態管理**: Zustand + persist（localStorage）
- **Store**: `src/hooks/useAuth.ts`
- **保護元件**: `src/components/auth/AuthGuard.tsx`
- **登入元件**: `src/components/common/SocialLoginButtons.tsx`
- **錯誤代碼**:
  - `OAUTH_NEW_USER_TRAVELER_ONLY`: 帳號未註冊為商家
  - `ROLE_MISMATCH`: 帳號非商家類型

## 下載按鈕規格
- **iOS**：跳轉 App Store
- **Android**：Toast 顯示「敬請期待」

## 環境變數
```env
NEXT_PUBLIC_API_URL=後端 API URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=Google OAuth Client ID
NEXT_PUBLIC_APPLE_CLIENT_ID=Apple Sign In Client ID
NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY=Recur 公開金鑰
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

## 最近更新
- 2026-01-09: Favicon 及 SEO 清理
  - 新增 App icon 作為網站 Favicon
  - 清理舊的 client/public/sitemap.xml 和 robots.txt
  - 更新 server/routes.ts 中的 baseUrl 為 mibu-travel.com
  - 更新 client/index.html 中的 canonical URL
- 2026-01-09: UI 優化與功能更新
  - 修復 Google 登入按鈕，改用品牌色按鈕樣式
  - 登出時清除 Google 自動登入快取
  - 新增退款與取消政策頁面 `/refund`
  - 訂閱管理頁面新增取消訂閱和申請退款功能
  - 新增退款相關 hooks：`useRefundEligibility`、`useRefundRequest`
  - 首頁、商家合作頁、訂閱方案頁移除冗餘文字標籤
  - 訂閱方案 Tab 移除 icon，卡片 hover 顯示品牌色邊框
  - 優惠券等級說明改用文字表格並置中
- 2026-01-09: 自訂網域設定完成
  - 網域 `mibu-travel.com` 已驗證並連結
  - sitemap.ts 和 robots.ts 已更新為新網域
  - Header 導航移除「隱私權政策」和「使用條款」
  - Footer 隱藏「探索」區塊（城市列表）
- 2026-01-06: 新增行程 SEO 頁面
  - `/trips`, `/trips/[city]`, `/trips/[city]/[district]`, `/trip/[id]`
  - 麵包屑導航、景點卡片（電腦橫排/手機直排）
  - 相關行程推薦、下載 App 引導
  - sitemap.xml 已包含行程頁面
- 2026-01-06: 訂閱方案頁面重構
  - 分為商家等級和行程卡等級兩種類型
  - 各有三個等級，支援月/年計費切換
  - 無 API 時顯示 ???
- 2026-01-06: Header 導航更新
  - 移除「探索城市」按鈕和導航
  - 新增隱私權政策、使用條款、技術支援連結
- 2026-01-06: Next.js 15 遷移完成
  - server/index.ts 更新為啟動 Next.js 而非 Express/Vite
  - Toast 元件添加 "use client" 指令
  - API 回應處理增加 fallback 機制
  - 所有頁面已測試通過（首頁、探索、商家、法律頁面）
  - sitemap.xml 和 robots.txt 動態生成正常
- 從 Vite + React SPA 遷移至 Next.js 15 App Router
- 建立 SEO 優化的城市/景點頁面
- 實作 sitemap.xml 和 robots.txt
- 整合 Google/Apple OAuth 登入

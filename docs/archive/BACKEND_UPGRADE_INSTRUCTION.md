# 後端架構升級指令

> **用途**：給後端的 Claude 執行，重組 API 契約文件結構
> **產生日期**：2026-01-16
> **來源**：官網架構審計

---

## 任務：重組 API 契約文件結構

### 目標

將現有的 API 文件重組為「通用 / 官網 / APP」三份契約，建立前後端分離的單一真相來源。

**原則**：後端是契約的唯一制定者，官網和 APP 只能依照契約實作，不可自行修改。

---

## 執行步驟

### Step 1：建立新目錄結構

```bash
mkdir -p docs/contracts
```

目標結構：
```
docs/
├── API_CONTRACT.md              ← 保留，改為總覽 + 變更日誌
└── contracts/
    ├── COMMON.md                ← 新建（通用：認證、錯誤碼、共用型別）
    ├── WEB.md                   ← 新建（官網專用 API）
    └── APP.md                   ← 新建（APP 專用 API）
```

---

### Step 2：建立 COMMON.md（通用契約）

**來源檔案**：
- `shared/errors.ts` → 錯誤碼定義
- `shared/schema.ts` → 共用型別（User, Merchant, Subscription）
- `server/routes/auth.ts` → 認證流程
- 現有 `docs/API_CONTRACT.md` → 環境 URL、開發原則

**內容範本**：

```markdown
# MIBU API 通用契約 (COMMON)

## 版本: 1.0.0
## 最後更新: YYYY-MM-DD

---

## 環境

| 環境 | URL |
|------|-----|
| 開發 | https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev |
| 生產 | https://gacha-travel--s8869420.replit.app |

---

## 認證

### JWT Token
- 有效期：7 天
- Header：`Authorization: Bearer {token}`
- Payload：`{ userId, email, role, iat, exp }`

### OAuth 登入

#### POST /api/auth/google
**Request**:
\`\`\`typescript
interface GoogleAuthRequest {
  idToken: string;
  targetPortal: 'traveler' | 'merchant' | 'specialist';
}
\`\`\`

**Response**:
\`\`\`typescript
interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  code?: string; // 錯誤碼（當 success: false）
}
\`\`\`

#### POST /api/auth/apple
（同上格式）

---

## 錯誤碼

### 認證相關 (E1xxx)
| 錯誤碼 | 常數名稱 | 說明 |
|--------|----------|------|
| E1001 | AUTH_REQUIRED | 請先登入 |
| E1002 | AUTH_TOKEN_EXPIRED | 登入已過期 |
| E1003 | AUTH_TOKEN_INVALID | 無效的登入憑證 |
| E1006 | PENDING_APPROVAL | 帳號審核中 |
| E1007 | ROLE_MISMATCH | 帳號類型不符 |

### 商家相關 (E4xxx)
| 錯誤碼 | 常數名稱 | 說明 |
|--------|----------|------|
| E4001 | MERCHANT_REQUIRED | 需要商家身份 |
| E4002 | MERCHANT_NOT_FOUND | 找不到商家資料 |
| E4009 | PLACE_LIMIT_REACHED | 已達景點數量上限 |
| E4010 | COUPON_LIMIT_REACHED | 已達優惠券數量上限 |

### 支付相關 (E7xxx)
| 錯誤碼 | 常數名稱 | 說明 |
|--------|----------|------|
| E7001 | PAYMENT_FAILED | 付款失敗 |
| E7002 | SUBSCRIPTION_EXPIRED | 訂閱已過期 |

### 伺服器相關 (E9xxx)
| 錯誤碼 | 常數名稱 | 說明 |
|--------|----------|------|
| E9001 | SERVER_ERROR | 伺服器錯誤 |
| E9004 | RATE_LIMITED | 請求過於頻繁 |

---

## 共用型別

\`\`\`typescript
// 使用者
interface User {
  id: string;
  email: string;
  name: string;
  role: 'traveler' | 'merchant' | 'specialist' | 'admin';
  createdAt: string;
}

// 商家
interface Merchant {
  id: number;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  merchantLevel: 'free' | 'pro' | 'premium';
  merchantLevelExpiresAt?: string;
  maxPlaces: number;
  maxCoupons: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

// 訂閱
interface Subscription {
  id: number;
  merchantId: number;
  provider: 'stripe' | 'recur';
  tier: 'pro' | 'premium' | 'partner';
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
}
\`\`\`
```

---

### Step 3：建立 WEB.md（官網契約）

**來源檔案**：
- `server/routes/seo.ts` → SEO API
- `server/routes/merchant/` → 商家訂閱 API
- `docs/sync-web.md` → 官網專用說明

**內容範本**：

```markdown
# MIBU API 官網契約 (WEB)

## 版本: 1.0.0
## 最後更新: YYYY-MM-DD
## 適用專案: Mibu-Pages (官網)

---

## SEO API（公開，無需認證）

### GET /api/seo/cities
取得所有城市列表

**Response**:
\`\`\`typescript
interface CitiesResponse {
  cities: City[];
  total: number;
}

interface City {
  name: string;
  slug: string;
  country: string;
  placeCount: number;
  tripCount: number;
  imageUrl: string | null;
}
\`\`\`

### GET /api/seo/cities/:slug
取得城市詳情（含景點列表）

### GET /api/seo/cities/:slug/related
取得相關城市

### GET /api/seo/cities/:slug/districts
取得城市內的行政區列表

### GET /api/seo/places/by-id/:id
取得景點詳情

### GET /api/seo/trips
取得行程列表（支援 ?city=xxx&district=xxx 篩選）

### GET /api/seo/trips/:id
取得行程詳情

### GET /api/seo/trips/:id/related
取得相關行程

---

## 商家 API（需認證）

### GET /api/merchant
取得當前商家資料（含訂閱資訊）

### GET /api/merchant/me
取得當前商家基本資料

### GET /api/merchant/permissions
取得商家權限與限制

**Response**:
\`\`\`typescript
interface MerchantPermissions {
  merchantId: number;
  currentTier: 'free' | 'pro' | 'premium';
  limits: {
    maxPlaces: number;
    maxCoupons: number;
    analyticsEnabled: boolean;
    prioritySupport: boolean;
  };
}
\`\`\`

---

## 訂閱管理 API（需認證）

### GET /api/merchant/subscription
取得當前訂閱狀態

### GET /api/merchant/subscription/history
取得訂閱歷史

### POST /api/merchant/subscription/checkout
建立結帳工作階段

**Request**:
\`\`\`typescript
interface CheckoutRequest {
  type: 'merchant' | 'place';
  tier: 'pro' | 'premium' | 'partner';
  provider: 'stripe' | 'recur';
  successUrl: string;
  cancelUrl: string;
}
\`\`\`

**Response**:
\`\`\`typescript
// Stripe 格式
interface StripeCheckoutResponse {
  checkoutUrl: string;
}

// Recur 格式
interface RecurCheckoutResponse {
  productId: string;
  publishableKey: string;
}
\`\`\`

### POST /api/merchant/subscription/cancel
取消訂閱

### POST /api/merchant/subscription/upgrade
升級訂閱

### GET /api/merchant/subscription/refund-eligibility
檢查退款資格

### POST /api/merchant/subscription/refund-request
申請退款
```

---

### Step 4：建立 APP.md（APP 契約）

**來源檔案**：
- `docs/memory-api-dictionary.md` → 主要來源
- `server/routes/gacha/` → Gacha API
- `server/routes/inventory.ts` → 庫存 API
- `server/routes/collections.ts` → 收藏 API

**內容範本**：

```markdown
# MIBU API APP 契約 (APP)

## 版本: 1.0.0
## 最後更新: YYYY-MM-DD
## 適用專案: MIBU App (React Native + Expo)

---

## 扭蛋系統

### POST /api/gacha/itinerary/v3
生成行程（核心端點）

**Request**:
\`\`\`typescript
interface GachaRequest {
  city: string;
  district?: string;
  count: number;        // 請求數量
  categories?: string[];
}
\`\`\`

**Response**:
\`\`\`typescript
interface GachaResponse {
  places: Place[];
  meta: {
    requestedCount: number;
    totalPlaces: number;
    isShortfall: boolean;
    dailyPullCount: number;
    remainingQuota: number;
  };
}
\`\`\`

### GET /api/gacha/quota
取得今日剩餘額度

---

## 收藏系統

### GET /api/collections
取得收藏列表

### POST /api/collections/add
新增收藏

### DELETE /api/collections/:id
移除收藏

---

## 庫存系統

### GET /api/inventory
取得庫存列表

### POST /api/inventory/add
新增道具

### DELETE /api/inventory/:id
移除道具

---

## 優惠券系統

### GET /api/coupons/my
取得我的優惠券

### POST /api/coupons/redeem
兌換優惠券

---

## SOS 安全中心

### POST /api/sos/alert
發送緊急求助

### GET /api/sos/contacts
取得緊急聯絡人

---

## 推播通知

### GET /api/notifications
取得通知列表

### PATCH /api/notifications/:id/read
標記已讀
```

---

### Step 5：更新 API_CONTRACT.md 為索引

```markdown
# MIBU API 契約總覽

## 版本: 2.0.0
## 最後更新: YYYY-MM-DD

---

## 契約文件

| 文件 | 用途 | 適用對象 |
|------|------|----------|
| [COMMON.md](./contracts/COMMON.md) | 認證、錯誤碼、共用型別 | 所有前端 |
| [WEB.md](./contracts/WEB.md) | SEO、商家訂閱 | 官網 (Mibu-Pages) |
| [APP.md](./contracts/APP.md) | 扭蛋、收藏、庫存 | APP (React Native) |

---

## 變更規則

1. **改 API 前，先更新契約** - 不可先改程式碼再補文件
2. **Breaking Change 必須標註** - 在變更日誌註明影響範圍
3. **前端只讀契約** - 官網/APP 不可自行修改契約，發現問題要回報後端

---

## 變更日誌

| 日期 | 版本 | 變更內容 | 影響範圍 |
|------|------|----------|----------|
| 2026-01-16 | 2.0.0 | 重組契約結構，拆分為 COMMON/WEB/APP | ALL |
| ... | ... | ... | WEB / APP / BOTH |
```

---

### Step 6：更新 CLAUDE.md

在 `CLAUDE.md` 的「強制查閱規則」區塊新增：

```markdown
## API 契約規則 ⚡

| 動作 | 必讀文件 |
|------|----------|
| 改任何 API | `docs/contracts/` 對應的契約文件 |
| 新增 API | 先更新契約，再寫程式碼 |
| Breaking Change | 必須在 `API_CONTRACT.md` 變更日誌註明 |

### 契約維護原則

1. **後端是唯一真相來源** - 官網/APP 發現不一致，回報後端修正
2. **先契約後程式碼** - 不可先改程式碼再補文件
3. **版本號規則**：
   - 大版本（X.0.0）：Breaking Change
   - 小版本（0.X.0）：新增 API
   - 修訂版（0.0.X）：修正錯誤
```

---

## 完成檢查清單

- [ ] `docs/contracts/` 目錄已建立
- [ ] `docs/contracts/COMMON.md` 包含認證流程和所有錯誤碼
- [ ] `docs/contracts/WEB.md` 包含所有官網用 API（SEO + 商家訂閱）
- [ ] `docs/contracts/APP.md` 包含所有 APP 用 API（扭蛋 + 收藏 + 庫存）
- [ ] `docs/API_CONTRACT.md` 更新為索引 + 變更日誌
- [ ] `CLAUDE.md` 新增契約強制規則
- [ ] 舊的 `memory-api-dictionary.md` 保留作為內部參考

---

## 給前端的同步指令

完成後，通知官網和 APP 執行：

**官網**：
> 「依照 `docs/contracts/COMMON.md` 和 `docs/contracts/WEB.md` 同步官網型別定義」

**APP**：
> 「依照 `docs/contracts/COMMON.md` 和 `docs/contracts/APP.md` 同步 APP 型別定義」

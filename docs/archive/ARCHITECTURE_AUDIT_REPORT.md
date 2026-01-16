# Mibu-Pages 架構審計報告

**審計日期**: 2026-01-16
**審計目標**: 優化官網並確保與後端保持一致性

---

## 一、執行摘要

經過對官網 (Mibu-Pages) 與後端 (MIBU_REPLIT) 的完整架構對比分析，發現以下主要議題：

| 類別 | 問題數量 | 嚴重程度 |
|------|----------|----------|
| 型別定義不一致 | 5 | 中等 |
| API 端點差異 | 3 | 低 |
| 錯誤處理機制 | 2 | 中等 |
| 架構優化空間 | 4 | 建議 |

---

## 二、API 端點對比分析

### 2.1 SEO API (✅ 一致性良好)

| 後端端點 | 官網呼叫 | 狀態 |
|----------|----------|------|
| `GET /api/seo/cities` | ✅ `getCities()` | 一致 |
| `GET /api/seo/cities/:slug` | ✅ `getCityDetail(slug)` | 一致 |
| `GET /api/seo/cities/:slug/related` | ✅ `getRelatedCities(slug)` | 一致 |
| `GET /api/seo/cities/:slug/districts` | ❌ 未實現 | **缺失** |
| `GET /api/seo/places/by-id/:id` | ✅ `getPlaceById(id)` | 一致 |
| `GET /api/seo/trips` | ✅ `getTrips()` | 一致 |
| `GET /api/seo/trips/:id` | ✅ `getTripDetail(id)` | 一致 |
| `GET /api/seo/trips/:id/related` | ✅ `getRelatedTrips(id)` | 一致 |

**建議**: 新增 `getCityDistricts(slug)` 函數來獲取城市內的行政區列表。

---

### 2.2 商家 API

#### 2.2.1 個人資料 (Profile)

| 後端端點 | 官網呼叫 | 狀態 |
|----------|----------|------|
| `GET /api/merchant` | ✅ `merchantApi.getMerchant()` | 一致 |
| `GET /api/merchant/me` | ✅ `merchantApi.getMe()` | 一致 |
| `POST /api/merchant/register` | ✅ `merchantApi.register()` | 一致 |
| `PATCH /api/merchant/:id/plan` | ❌ 未實現 | **缺失** |

#### 2.2.2 景點認領 (Places)

| 後端端點 | 官網呼叫 | 狀態 |
|----------|----------|------|
| `GET /api/merchant/places` | ✅ `merchantApi.getPlaces()` | 一致 |
| `GET /api/merchant/places/search` | ✅ `merchantApi.searchPlaces()` | 一致 |
| `POST /api/merchant/places/claim` | ✅ `merchantApi.claimPlace()` | **部分差異** |
| `POST /api/merchant/places/new` | ✅ `merchantApi.createPlace()` | 一致 |
| `PUT /api/merchant/places/:linkId` | ✅ `merchantApi.updatePlace()` | 一致 |

**注意**: `claimPlace` 後端接受更多參數 (`placeName`, `district`, `city`, `country`, `placeCacheId`, `googlePlaceId`)，但官網只傳 `placeCacheId`。

#### 2.2.3 訂閱管理 (Subscription)

| 後端端點 | 官網呼叫 | 狀態 |
|----------|----------|------|
| `GET /api/merchant/subscription` | ✅ `merchantApi.getSubscription()` | 一致 |
| `GET /api/merchant/subscription/history` | ✅ `merchantApi.getSubscriptionHistory()` | 一致 |
| `POST /api/merchant/subscription/checkout` | ✅ `merchantApi.checkout()` | **型別差異** |
| `POST /api/merchant/subscription/cancel` | ✅ `merchantApi.cancel()` | 一致 |
| `POST /api/merchant/subscription/upgrade` | ❌ 未實現 | **缺失** |
| `GET /api/merchant/subscription/refund-eligibility` | ✅ `merchantApi.checkRefundEligibility()` | 一致 |
| `POST /api/merchant/subscription/refund-request` | ✅ `merchantApi.requestRefund()` | 一致 |
| `GET /api/merchant/permissions` | ❌ 未實現 | **缺失** |

---

## 三、型別定義差異

### 3.1 商家等級 (Merchant Level)

**後端定義** (`shared/schema.ts`):
```typescript
merchantLevel: 'free' | 'pro' | 'premium'  // 資料庫 schema
```

**官網定義** (`src/services/api/merchant.ts`):
```typescript
merchantLevel: 'free' | 'basic' | 'pro' | 'premium' | 'partner'
```

**問題**: 官網多了 `basic` 和 `partner` 等級，需確認後端是否支援。

---

### 3.2 結帳請求 (CheckoutRequest)

**後端接受**:
```typescript
{
  type: 'merchant' | 'place',
  tier: 'pro' | 'premium' | 'partner',
  provider: 'stripe' | 'recur',
  successUrl: string,
  cancelUrl: string
}
```

**官網傳送**:
```typescript
{
  tier: 'basic' | 'pro' | 'premium',
  provider: 'stripe' | 'recur',
  billingCycle?: 'monthly' | 'yearly',
  successUrl?: string,
  cancelUrl?: string
}
```

**差異**:
1. 官網缺少 `type` 欄位
2. 後端不支援 `basic` tier
3. 後端不支援 `billingCycle` 參數

---

### 3.3 結帳回應 (CheckoutResponse)

**後端回傳**:
```typescript
// Recur
{ productId: string, publishableKey: string }
// Stripe
{ checkoutUrl: string }
```

**官網期望**:
```typescript
{
  checkoutUrl: string,
  sessionId: string
}
```

**問題**: Recur 回應格式不同，官網需處理兩種格式。

---

## 四、錯誤處理差異

### 4.1 後端錯誤碼系統

後端有完整的錯誤碼定義 (`shared/errors.ts`)：

| 類別 | 範圍 | 範例 |
|------|------|------|
| 認證 | E1xxx | `AUTH_REQUIRED`, `PENDING_APPROVAL`, `ROLE_MISMATCH` |
| 扭蛋 | E2xxx | `GACHA_NO_CREDITS`, `GACHA_RATE_LIMITED` |
| 地點 | E3xxx | `REGION_NOT_FOUND`, `CITY_REQUIRED` |
| 商家 | E4xxx | `MERCHANT_NOT_FOUND`, `PLACE_LIMIT_REACHED` |
| 驗證 | E5xxx | `VALIDATION_ERROR`, `ALREADY_CLAIMED` |
| 資源 | E6xxx | 各種 `NOT_FOUND` 錯誤 |
| 支付 | E7xxx | `PAYMENT_FAILED`, `SUBSCRIPTION_EXPIRED` |
| 伺服器 | E9xxx | `SERVER_ERROR`, `RATE_LIMITED` |

### 4.2 官網錯誤處理現況

官網的 `ApiError` 類別:
```typescript
class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,  // ← 可選的錯誤碼
    public details?: unknown
  ) { ... }
}
```

**建議**: 官網應建立對應的錯誤碼常數，以便進行精確的錯誤處理。

---

## 五、架構優化建議

### 5.1 高優先級 (建議立即處理)

#### A. 同步 CheckoutRequest 型別

```typescript
// 建議修改為:
export interface CheckoutRequest {
  type: 'merchant' | 'place';  // 新增
  tier: 'pro' | 'premium' | 'partner';  // 移除 basic
  provider: 'stripe' | 'recur';
  successUrl: string;
  cancelUrl: string;
}
```

#### B. 處理雙重 Checkout 回應格式

```typescript
// 建議修改為:
export interface CheckoutResponse {
  // Stripe 格式
  checkoutUrl?: string;
  // Recur 格式
  productId?: string;
  publishableKey?: string;
}
```

#### C. 新增缺失的 API 方法

```typescript
// merchantApi 應新增:
getPermissions: () =>
  get<MerchantPermissions>('/api/merchant/permissions'),

upgradeSubscription: (subscriptionId: number, newTier: string) =>
  post<{ billingPortalUrl: string }>('/api/merchant/subscription/upgrade', {
    subscriptionId,
    newTier
  }),
```

---

### 5.2 中優先級 (建議近期處理)

#### D. 建立共用錯誤碼

建立 `src/constants/errorCodes.ts`:
```typescript
export const ErrorCodes = {
  // 認證相關
  AUTH_REQUIRED: 'E1001',
  PENDING_APPROVAL: 'E1006',
  ROLE_MISMATCH: 'E1007',

  // 商家相關
  MERCHANT_NOT_FOUND: 'E4002',
  PLACE_LIMIT_REACHED: 'E4009',

  // 支付相關
  PAYMENT_FAILED: 'E7001',
  SUBSCRIPTION_EXPIRED: 'E7002',
} as const;
```

#### E. 新增 SEO API - 城市區域

```typescript
// src/features/seo/api/cities.ts
export async function getCityDistricts(slug: string): Promise<District[]> {
  const res = await fetch(
    `${API_URL}/api/seo/cities/${encodeURIComponent(slug)}/districts`,
    { next: { revalidate: REVALIDATE_TIME } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.districts || [];
}
```

---

### 5.3 低優先級 (建議未來考慮)

#### F. 統一 Schema 定義

官網的 `shared/schema.ts` 只有基本的 `users` 和 `supportRequests` 表，而後端有完整的資料庫 schema。

**建議**: 考慮是否需要共享更多 schema 定義，或建立獨立的型別檔案與後端同步。

#### G. 新增 API 版本管理

```typescript
// 建議未來加入 API 版本前綴
const API_VERSION = 'v1';
const API_BASE = `${API_URL}/api/${API_VERSION}`;
```

---

## 六、文件結構對比

### 後端模組化結構 (參考)
```
server/
├── routes/
│   ├── merchant/
│   │   ├── index.ts      # 路由入口
│   │   ├── profile.ts    # 個人資料
│   │   ├── places.ts     # 景點認領
│   │   ├── subscription.ts
│   │   ├── coupons.ts
│   │   ├── analytics.ts
│   │   └── ...
│   ├── seo.ts
│   ├── auth.ts
│   └── ...
├── services/            # 業務邏輯
├── middleware/          # 中介軟體
└── storage/             # 資料存取層
```

### 官網現有結構
```
src/
├── services/api/
│   ├── index.ts         # 統一請求處理
│   └── merchant.ts      # 商家 API (平面結構)
├── features/seo/api/
│   ├── cities.ts
│   ├── trips.ts
│   └── places.ts
└── ...
```

**觀察**: 官網結構較為精簡，適合目前的需求規模。若功能持續擴充，可考慮參考後端的模組化方式重組。

---

## 七、待確認事項

1. **`basic` 訂閱等級**: 後端是否支援？或應從官網移除？
2. **`billingCycle` 參數**: 後端是否計畫支援月/年付選項？
3. **`type` 結帳參數**: 官網是否需要支援 `place` 類型的訂閱？
4. **權限端點用途**: `/api/merchant/permissions` 的預期使用場景？

---

## 八、行動項目清單

| 優先級 | 項目 | 預估影響 |
|--------|------|----------|
| 🔴 高 | 同步 CheckoutRequest 型別 | 結帳功能可能失敗 |
| 🔴 高 | 處理雙重 Checkout 回應 | Recur 結帳可能異常 |
| 🟡 中 | 新增 upgradeSubscription API | 功能完整性 |
| 🟡 中 | 新增 getPermissions API | 功能完整性 |
| 🟡 中 | 建立錯誤碼常數 | 錯誤處理品質 |
| 🟢 低 | 新增 getCityDistricts API | SEO 功能增強 |
| 🟢 低 | 更新 claimPlace 參數 | 功能增強 |

---

## 九、結論

整體而言，官網與後端的架構一致性良好，主要的 API 端點都有正確對應。需要關注的重點是：

1. **結帳流程的型別差異** - 可能導致付款失敗
2. **缺少的訂閱管理功能** - `upgrade` 和 `permissions`
3. **錯誤碼對應** - 建立更完善的錯誤處理機制

建議優先處理結帳相關的型別問題，其餘項目可依業務需求逐步完善。

---

*報告由架構審計工具自動產生*

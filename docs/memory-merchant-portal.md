# 記憶庫：商家後台

## TL;DR

- **功能**：商家登入、訂閱購買/管理/退款（iOS 規定跨平台訂閱在官網）
- **關鍵檔案**：`src/services/api/merchant.ts`、`src/hooks/useAuth.ts`
- **金流**：Stripe（國際）+ Recur（台灣）雙軌
- **認證錯誤**：E1006（審核中）、E1007（非商家帳號）
- **頁面路由**：`/merchant/login`、`/merchant/subscription`、`/merchant/subscribe`

---

> **跨端對應**
> - 後端記憶庫：`docs/memory-merchant.md`
> - API 契約：`docs/contracts/WEB.md`（商家 API 區段）
> - 通用契約：`docs/contracts/COMMON.md`（認證、錯誤碼）

---

## 職責範圍

商家後台提供訂閱購買和管理功能。iOS 規定跨平台訂閱必須在官網完成。

### 功能清單

| 功能 | 路由 | API |
|------|------|-----|
| 登入 | `/merchant/login` | `POST /api/auth/google`, `POST /api/auth/apple` |
| 訂閱購買 | `/merchant/subscribe` | `POST /api/merchant/subscription/checkout` |
| 查看訂閱 | `/merchant/subscription` | `GET /api/merchant/subscription` |
| 取消訂閱 | `/merchant/subscription` | `POST /api/merchant/subscription/cancel` |
| 申請退款 | `/merchant/subscription` | `POST /api/merchant/subscription/refund-request` |

---

## 商家等級

```typescript
type MerchantLevel = 'free' | 'pro' | 'premium' | 'partner';
```

| 等級 | 景點上限 | 優惠券上限 | 數據分析 |
|------|----------|------------|----------|
| free | 1 | 3 | ❌ |
| pro | 5 | 10 | ✅ |
| premium | 20 | 50 | ✅ |
| partner | 無限 | 無限 | ✅ |

---

## 認證流程

### OAuth 登入

1. 用戶點擊 Google/Apple 登入按鈕
2. 取得 `idToken`
3. 發送到 `POST /api/auth/google` 或 `/api/auth/apple`
4. 後端驗證並回傳 JWT token
5. 存入 `localStorage['merchant-auth']`

### 錯誤處理

| 錯誤碼 | 說明 | 處理方式 |
|--------|------|----------|
| E1006 | 帳號審核中 | 顯示等待訊息 |
| E1007 | 非商家帳號 | 引導下載 App 註冊 |

---

## 金流串接

### Stripe

```typescript
// 後端回傳
{ checkoutUrl: string }

// 前端處理
window.location.href = checkoutUrl;
```

### Recur（台灣本地）

```typescript
// 後端回傳
{ productId: string, publishableKey: string }

// 前端處理
import { redirectToCheckout } from 'recur-tw';
redirectToCheckout({ productId, publishableKey });
```

---

## 退款政策

- **鑑賞期**：首次付款 7 天內可申請全額退款
- **檢查 API**：`GET /api/merchant/subscription/refund-eligibility`
- **申請 API**：`POST /api/merchant/subscription/refund-request`

---

## 程式碼位置

```
src/
├── services/api/merchant.ts   # 商家 API 服務
├── hooks/
│   ├── useAuth.ts             # 認證狀態管理
│   ├── useRefundEligibility.ts
│   └── useRefundRequest.ts
└── components/
    ├── auth/AuthGuard.tsx     # 路由保護
    └── common/SocialLoginButtons.tsx
```

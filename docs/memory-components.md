# 記憶庫：共用元件

## TL;DR

- **功能**：UI 基礎元件、版面、認證保護、SEO 組件
- **關鍵檔案**：`src/components/ui/`（shadcn）、`src/components/auth/AuthGuard.tsx`
- **設計系統**：shadcn/ui + Tailwind CSS，Mobile-first
- **常用元件**：Button、Card、Dialog、Toast、AuthGuard、SocialLoginButtons
- **新增元件**：`npx shadcn-ui@latest add [name]`

---

> **跨端對應**
> - 此為官網專屬記憶庫，無後端對應
> - 設計系統參考：shadcn/ui

---

## 元件架構

```
src/components/
├── ui/              # shadcn/ui 基礎元件
├── layout/          # 版面元件
├── common/          # 通用業務元件
└── auth/            # 認證相關元件
```

---

## UI 元件（shadcn/ui）

基於 Radix UI + Tailwind CSS 的無樣式元件庫。

### 已安裝元件

| 元件 | 用途 | 檔案 |
|------|------|------|
| Button | 按鈕 | `ui/button.tsx` |
| Card | 卡片容器 | `ui/card.tsx` |
| Badge | 標籤 | `ui/badge.tsx` |
| Dialog | 對話框 | `ui/dialog.tsx` |
| Toast | 通知訊息 | `ui/toast.tsx` |
| Skeleton | 載入骨架 | `ui/skeleton.tsx` |
| Input | 輸入框 | `ui/input.tsx` |
| Select | 下拉選單 | `ui/select.tsx` |

### 新增元件

```bash
npx shadcn-ui@latest add [component-name]
```

---

## 版面元件

### Header (`layout/Header.tsx`)

- Logo + 導航連結
- 響應式漢堡選單
- 商家登入按鈕

### Footer (`layout/Footer.tsx`)

- 法律頁面連結
- 社群媒體連結
- 版權聲明

---

## 通用業務元件

### SocialLoginButtons (`common/SocialLoginButtons.tsx`)

Google/Apple OAuth 登入按鈕組合。

```tsx
<SocialLoginButtons
  onSuccess={(token, user) => { /* 登入成功 */ }}
  onError={(error) => { /* 登入失敗 */ }}
  targetPortal="merchant"
/>
```

### DownloadButtons (`common/DownloadButtons.tsx`)

App 下載按鈕。

- iOS：跳轉 App Store
- Android：Toast 顯示「敬請期待」

---

## 認證元件

### AuthGuard (`auth/AuthGuard.tsx`)

保護需要登入的頁面。

```tsx
<AuthGuard>
  <ProtectedContent />
</AuthGuard>
```

行為：
- 未登入 → 跳轉 `/merchant/login`
- 已登入 → 顯示子元件

---

## SEO 元件

位於 `src/features/seo/components/`。

### JsonLdScript

注入 JSON-LD 結構化資料。

```tsx
<JsonLdScript data={generatePlaceJsonLd(place)} />
```

### Breadcrumb

麵包屑導航。

```tsx
<Breadcrumb items={placeBreadcrumb(place)} />
```

### SeoPageHeader

統一的頁面標題區塊。

---

## 設計規範

### 色彩

| 用途 | 類別 |
|------|------|
| 主色 | `bg-primary` / `text-primary` |
| 次要 | `bg-secondary` / `text-secondary` |
| 強調 | `bg-accent` |
| 破壞性 | `bg-destructive` |

### 間距

使用 Tailwind 的標準間距系統：
- `p-4`：1rem
- `p-6`：1.5rem
- `gap-4`：1rem

### 響應式

Mobile-first 設計：
- `sm:`：640px+
- `md:`：768px+
- `lg:`：1024px+

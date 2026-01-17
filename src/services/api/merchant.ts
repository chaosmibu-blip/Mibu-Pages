/**
 * 商家 API 服務
 *
 * 提供商家後台所需的所有 API 調用方法
 */

import { get, post, patch, del, put } from './index';

// ============ 類型定義 ============

/** 商家等級（依照 WEB 契約 v1.0.0） */
export type MerchantLevel = 'free' | 'pro' | 'premium' | 'partner';

/** 商家資料 */
export interface Merchant {
  id: number;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  businessAddress?: string;
  /** 商家等級（與後端契約同步） */
  merchantLevel: MerchantLevel;
  merchantLevelExpiresAt?: string;
  maxPlaces: number;
  maxCoupons: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  createdAt: string;
  updatedAt: string;
  subscription?: Subscription;
}

/** 訂閱資料 */
export interface Subscription {
  id: number;
  merchantId: number;
  provider: 'stripe' | 'recur';
  tier: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  billingPortalUrl?: string;
  createdAt: string;
}

/** 訂閱歷史 */
export interface SubscriptionHistory {
  id: number;
  subscriptionId: number;
  action: 'created' | 'renewed' | 'cancelled' | 'refunded' | 'upgraded' | 'downgraded';
  tier: string;
  amount: number;
  createdAt: string;
}

/** 退款資格回應 */
export interface RefundEligibility {
  subscriptionId: number;
  provider: 'stripe' | 'recur';
  tier: string;
  status: string;
  createdAt: string;
  daysSinceCreation: number;
  refundEligibility: {
    isEligible: boolean;
    reason: string;
    hoursRemaining: number;
    daysRemaining: number;
  };
  cancellationPolicy: {
    canCancel: boolean;
    note: string;
  };
}

/** 營業時間格式（依照 WEB 契約 v1.2.0） */
export interface OpeningHours {
  weekdayText?: string[];   // ["星期一: 09:00–21:00", ...]
  periods?: unknown[];      // Google Places API 格式
}

/** 商家景點（已認領）- 依照 WEB 契約 v1.2.0 */
export interface MerchantPlace {
  id: number;
  merchantId: number;
  officialPlaceId: number | null;
  placeCacheId: number | null;
  googlePlaceId: string | null;
  placeName: string;
  district: string;
  city: string;
  country: string;
  description: string | null;
  googleMapUrl: string | null;
  openingHours: OpeningHours | null;
  phone: string | null;           // Phase 6 新增
  website: string | null;         // Phase 6 新增
  status: 'pending' | 'approved' | 'rejected';
  cardLevel: MerchantLevel;
  promoTitle: string | null;
  promoDescription: string | null;
  inventoryImageUrl: string | null;
  isPromoActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 更新景點參數（依照 WEB 契約 v1.2.0） */
export interface UpdateMerchantPlaceParams {
  description?: string;
  googleMapUrl?: string;
  openingHours?: OpeningHours;
  phone?: string;                 // Phase 6 新增
  website?: string;               // Phase 6 新增
  promoTitle?: string;
  promoDescription?: string;
  isPromoActive?: boolean;
}

/** 可認領的景點（PlaceCache） */
export interface ClaimablePlace {
  id: number;
  placeName: string;
  district: string;
  city: string;
  country: string;
  category: string;
  description: string | null;
  placeId: string | null;        // Google Place ID
  googleRating: string | null;
  locationLat: string | null;
  locationLng: string | null;
  createdAt: string;
}

/** 新增景點請求（依照 WEB 契約 v1.2.0 - Phase 6） */
export interface CreatePlaceRequest {
  placeName: string;
  address: string;
  city: string;
  district?: string;
  category: string;               // 七大分類
  subcategory?: string;
  description?: string;
  openingHours?: OpeningHours;    // Phase 6 新增
  phone?: string;                 // Phase 6 新增
  website?: string;               // Phase 6 新增
  locationLat?: number;
  locationLng?: number;
}

/** 新增景點回應（待審核） */
export interface CreatePlaceResponse {
  success: boolean;
  draft: MerchantPlace;
  message: string;
}

/** 優惠券 */
export interface Coupon {
  id: number;
  merchantId: number;
  placeId?: number;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'freebie';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 建立優惠券請求 */
export interface CreateCouponRequest {
  placeId?: number;
  title: string;
  description?: string;
  discountType: 'percentage' | 'fixed' | 'freebie';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit?: number;
}

/** 結帳請求（與後端同步） */
export interface CheckoutRequest {
  /** 訂閱類型：商家訂閱或景點訂閱 */
  type: 'merchant' | 'place';
  /** 訂閱等級 */
  tier: 'pro' | 'premium' | 'partner';
  /** 支付提供商 */
  provider: 'stripe' | 'recur';
  /** 付款成功後跳轉 URL */
  successUrl: string;
  /** 付款取消後跳轉 URL */
  cancelUrl: string;
}

/** 結帳回應（支援 Stripe 和 Recur 兩種格式） */
export interface CheckoutResponse {
  // Stripe 格式
  /** Stripe 結帳頁面 URL */
  checkoutUrl?: string;
  /** Stripe Checkout URL（別名） */
  url?: string;
  // Recur 格式
  /** Recur 產品 ID */
  productId?: string;
  /** Recur 公開金鑰 */
  publishableKey?: string;
}

/** 商家權限回應 */
export interface MerchantPermissions {
  merchantId: number;
  currentTier: MerchantLevel;
  limits: {
    maxPlaces: number;
    maxCoupons: number;
    analyticsEnabled: boolean;
    prioritySupport: boolean;
  };
  tierLimits: Record<string, {
    maxPlaces: number;
    maxCoupons: number;
    analyticsEnabled: boolean;
    prioritySupport: boolean;
  }>;
}

/** 認領景點請求（完整參數） */
export interface ClaimPlaceRequest {
  /** PlaceCache ID（優先使用） */
  placeCacheId?: number;
  /** Google Place ID（可選） */
  googlePlaceId?: string;
  /** 景點名稱（當沒有 placeCacheId 時必填） */
  placeName?: string;
  /** 區域 */
  district?: string;
  /** 城市 */
  city?: string;
  /** 國家 */
  country?: string;
}

// ============ API 方法 ============

export const merchantApi = {
  // -------- 商家資料 --------

  /**
   * 取得當前商家資料
   */
  getMe: () => get<{ merchant: Merchant }>('/api/merchant/me'),

  /**
   * 取得商家資料（含訂閱資訊）
   */
  getMerchant: () => get<{ merchant: Merchant }>('/api/merchant'),

  /**
   * 註冊商家
   */
  register: (data: { businessName: string; businessEmail: string; businessPhone?: string }) =>
    post<{ merchant: Merchant }>('/api/merchant/register', data),

  // -------- 景點認領 --------

  /**
   * 取得已認領的景點列表
   */
  getPlaces: () => get<{ places: MerchantPlace[] }>('/api/merchant/places'),

  /**
   * 搜尋可認領的景點
   */
  searchPlaces: (query: string) =>
    get<{ places: ClaimablePlace[] }>(`/api/merchant/places/search?query=${encodeURIComponent(query)}`),

  /**
   * 認領景點（支援完整參數）
   */
  claimPlace: (params: ClaimPlaceRequest | number) => {
    // 向後相容：支援只傳 placeCacheId
    const body = typeof params === 'number' ? { placeCacheId: params } : params;
    return post<{ success: boolean; link: MerchantPlace }>('/api/merchant/places/claim', body);
  },

  /**
   * 新增自有景點（待審核）
   */
  createPlace: (data: CreatePlaceRequest) =>
    post<CreatePlaceResponse>('/api/merchant/places/new', data),

  /**
   * 更新景點資訊
   */
  updatePlace: (id: number, data: UpdateMerchantPlaceParams) =>
    put<{ success: boolean; link: MerchantPlace }>(`/api/merchant/places/${id}`, data),

  // -------- 優惠券管理 --------

  /**
   * 取得商家的優惠券列表
   */
  getCoupons: (merchantId: number) =>
    get<{ coupons: Coupon[] }>(`/api/coupons/merchant/${merchantId}`),

  /**
   * 建立優惠券
   */
  createCoupon: (data: CreateCouponRequest) =>
    post<{ coupon: Coupon }>('/api/coupons', data),

  /**
   * 更新優惠券
   */
  updateCoupon: (id: number, data: Partial<CreateCouponRequest>) =>
    patch<{ coupon: Coupon }>(`/api/coupons/${id}`, data),

  /**
   * 刪除優惠券
   */
  deleteCoupon: (id: number) => del<{ success: boolean }>(`/api/coupons/${id}`),

  /**
   * 啟用/停用優惠券
   */
  toggleCoupon: (id: number, isActive: boolean) =>
    patch<{ coupon: Coupon }>(`/api/coupons/${id}`, { isActive }),

  // -------- 訂閱管理 --------

  /**
   * 取得訂閱狀態
   */
  getSubscription: () =>
    get<{ subscription: Subscription | null }>('/api/merchant/subscription'),

  /**
   * 取得訂閱歷史
   */
  getSubscriptionHistory: () =>
    get<{ history: SubscriptionHistory[] }>('/api/merchant/subscription/history'),

  /**
   * 建立結帳工作階段
   */
  checkout: (data: CheckoutRequest) =>
    post<CheckoutResponse>('/api/merchant/subscription/checkout', data),

  /**
   * 取消訂閱
   */
  cancel: (subscriptionId: number) =>
    post<{ success: boolean; message: string }>('/api/merchant/subscription/cancel', {
      subscriptionId,
    }),

  /**
   * 升級訂閱
   */
  upgradeSubscription: (subscriptionId: number, newTier: 'pro' | 'premium' | 'partner') =>
    post<{ billingPortalUrl: string }>('/api/merchant/subscription/upgrade', {
      subscriptionId,
      newTier,
    }),

  /**
   * 取得商家權限與限制
   */
  getPermissions: () =>
    get<MerchantPermissions>('/api/merchant/permissions'),

  /**
   * 檢查退款資格
   */
  checkRefundEligibility: (subscriptionId: number) =>
    get<RefundEligibility>(
      `/api/merchant/subscription/refund-eligibility?subscriptionId=${subscriptionId}`
    ),

  /**
   * 申請退款
   */
  requestRefund: (subscriptionId: number, reason: string) =>
    post<{
      success: boolean;
      status: 'approved' | 'pending_manual_review' | 'not_eligible';
      message: string;
    }>('/api/merchant/subscription/refund-request', { subscriptionId, reason }),
};

export default merchantApi;

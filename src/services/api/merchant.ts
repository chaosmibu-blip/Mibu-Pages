/**
 * 商家 API 服務
 *
 * 提供商家後台所需的所有 API 調用方法
 */

import { get, post, patch, del, put } from './index';

// ============ 類型定義 ============

/** 商家資料 */
export interface Merchant {
  id: number;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone?: string;
  businessAddress?: string;
  merchantLevel: 'free' | 'basic' | 'pro' | 'premium' | 'partner';
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

/** 景點資料（商家已認領） */
export interface MerchantPlace {
  linkId: number;
  placeId: number;
  merchantId: number;
  place: {
    id: number;
    name: string;
    address: string;
    city: string;
    district?: string;
    category: string;
    imageUrl?: string;
    rating?: number;
  };
  isVerified: boolean;
  merchantOffer?: string;
  merchantDescription?: string;
  createdAt: string;
}

/** 可認領的景點 */
export interface ClaimablePlace {
  id: number;
  name: string;
  address: string;
  city: string;
  district?: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  isClaimed: boolean;
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

/** 結帳請求 */
export interface CheckoutRequest {
  tier: 'basic' | 'pro' | 'premium';
  provider: 'stripe' | 'recur';
  billingCycle?: 'monthly' | 'yearly';
  successUrl?: string;
  cancelUrl?: string;
}

/** 結帳回應 */
export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
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
    get<{ places: ClaimablePlace[] }>(`/api/merchant/places/search?q=${encodeURIComponent(query)}`),

  /**
   * 認領景點
   */
  claimPlace: (placeId: number) =>
    post<{ link: MerchantPlace }>('/api/merchant/places/claim', { placeId }),

  /**
   * 新增自有景點
   */
  createPlace: (data: {
    name: string;
    address: string;
    city: string;
    district?: string;
    category: string;
    description?: string;
  }) => post<{ place: ClaimablePlace; link: MerchantPlace }>('/api/merchant/places/new', data),

  /**
   * 更新景點優惠資訊
   */
  updatePlace: (linkId: number, data: { merchantOffer?: string; merchantDescription?: string }) =>
    put<{ link: MerchantPlace }>(`/api/merchant/places/${linkId}`, data),

  /**
   * 取消認領景點
   */
  unclaimPlace: (linkId: number) => del<{ success: boolean }>(`/api/merchant/places/${linkId}`),

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

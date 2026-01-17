/**
 * 募資系統型別定義
 *
 * 根據 WEB 契約 v1.2.0
 */

// ============ 募資活動 ============

/** 募資活動狀態 */
export type CampaignStatus =
  | 'upcoming'    // 預告
  | 'active'      // 進行中
  | 'completed'   // 已完成
  | 'collecting'  // 募資中
  | 'launched'    // 已上線
  | 'failed';     // 失敗

/** 募資活動 - GET /api/crowdfund/campaigns */
export interface CrowdfundCampaign {
  id: number;
  countryCode: string;
  countryNameZh: string;
  countryNameEn: string;
  goalAmount: number;
  currentAmount: number;
  contributorCount: number;
  progressPercent: number;
  estimatedPlaces: number;
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  launchedAt?: string;
}

/** 募資活動列表回應 */
export interface CampaignsResponse {
  campaigns: CrowdfundCampaign[];
  total: number;
}

/** 募資活動詳情回應 - GET /api/crowdfund/campaigns/:id */
export interface CampaignDetailResponse {
  campaign: CrowdfundCampaign;
  recentContributors: RecentContributor[];
  topContributors: TopContributor[];
}

/** 最近贊助者 */
export interface RecentContributor {
  name: string;           // 部分遮蔽
  amount: number;
  createdAt: string;
}

/** 頂級贊助者 */
export interface TopContributor {
  name: string;
  totalAmount: number;
}

// ============ 結帳 ============

/** 募資結帳請求 - POST /api/crowdfund/checkout */
export interface CrowdfundCheckoutRequest {
  campaignId: number;
  amount: number;           // NT$
  email?: string;           // 未登入時必填
  name?: string;            // 顯示名稱（選填）
  successUrl: string;
  cancelUrl: string;
}

/** 募資結帳回應 */
export interface CrowdfundCheckoutResponse {
  checkoutUrl: string;      // Stripe Checkout URL
  sessionId: string;
}

// ============ 我的贊助 ============

/** 我的贊助記錄項目 */
export interface Contribution {
  id: number;
  campaign: CrowdfundCampaign;
  amount: number;
  paymentMethod: 'stripe';
  createdAt: string;
}

/** 我的贊助記錄回應 - GET /api/crowdfund/my-contributions */
export interface MyContributionsResponse {
  contributions: Contribution[];
  summary: {
    totalAmount: number;
    campaignsSupported: number;
  };
}

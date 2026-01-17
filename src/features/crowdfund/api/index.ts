/**
 * 募資系統 API 層
 *
 * 根據 WEB 契約 v1.2.0
 */

import { get, post } from '@/services/api';
import type {
  CampaignsResponse,
  CampaignDetailResponse,
  CrowdfundCheckoutRequest,
  CrowdfundCheckoutResponse,
  MyContributionsResponse,
  CampaignStatus,
} from '../types';

/**
 * 取得募資活動列表（公開）
 * GET /api/crowdfund/campaigns
 */
export async function getCampaigns(
  status?: CampaignStatus
): Promise<CampaignsResponse> {
  const params = status ? `?status=${status}` : '';
  return get<CampaignsResponse>(`/api/crowdfund/campaigns${params}`);
}

/**
 * 取得募資活動詳情（公開）
 * GET /api/crowdfund/campaigns/:id
 */
export async function getCampaignDetail(
  id: number | string
): Promise<CampaignDetailResponse> {
  return get<CampaignDetailResponse>(`/api/crowdfund/campaigns/${id}`);
}

/**
 * 建立募資結帳（Stripe）
 * POST /api/crowdfund/checkout
 *
 * 可選認證 - 未登入可匿名贊助
 */
export async function createCrowdfundCheckout(
  data: CrowdfundCheckoutRequest
): Promise<CrowdfundCheckoutResponse> {
  return post<CrowdfundCheckoutResponse>('/api/crowdfund/checkout', data);
}

/**
 * 取得我的募資記錄
 * GET /api/crowdfund/my-contributions
 *
 * 需認證
 */
export async function getMyContributions(): Promise<MyContributionsResponse> {
  return get<MyContributionsResponse>('/api/crowdfund/my-contributions');
}

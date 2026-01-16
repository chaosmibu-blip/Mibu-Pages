/**
 * 行政區 API 資料獲取
 * 依照 WEB 契約 v1.0.0
 */

import { API_URL } from '@/lib/config';
import type { DistrictDetailResponse } from '../types';

const REVALIDATE_TIME = 3600; // 1 小時

/**
 * 取得行政區詳情（含景點列表）
 * GET /api/seo/districts/:citySlug/:districtSlug
 */
export async function getDistrictDetail(
  citySlug: string,
  districtSlug: string
): Promise<DistrictDetailResponse | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/seo/districts/${encodeURIComponent(citySlug)}/${encodeURIComponent(districtSlug)}`,
      { next: { revalidate: REVALIDATE_TIME } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 景點 API 資料獲取
 */

import { API_URL } from '@/lib/config';
import type { PlaceDetailResponse } from '../types';

const REVALIDATE_TIME = 3600; // 1 小時

// ============ API 函數 ============

/**
 * 取得景點詳情（含相關景點）
 * GET /api/seo/places/by-id/:id
 */
export async function getPlaceById(id: number | string): Promise<PlaceDetailResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/places/by-id/${id}`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 取得所有景點 ID（用於 sitemap 或 generateStaticParams）
 * 注意：這可能需要後端另外提供一個輕量級的端點
 */
export async function getAllPlaceIds(): Promise<{ id: number }[]> {
  // 目前後端沒有提供專門的景點 ID 列表端點
  // 可以從城市詳情頁收集，或者請後端新增
  return [];
}

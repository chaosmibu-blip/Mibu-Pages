/**
 * 景點 API 資料獲取
 * 依照 WEB 契約 v1.0.0
 */

import { API_URL } from '@/lib/config';
import type { PlaceDetailResponse, PlacesResponse, PlacesQueryParams } from '../types';

const REVALIDATE_TIME = 3600; // 1 小時

// ============ API 函數 ============

/**
 * 取得景點列表（支援搜尋/篩選）
 * GET /api/seo/places
 */
export async function getPlaces(params?: PlacesQueryParams): Promise<PlacesResponse | null> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.city) searchParams.set('city', params.city);
    if (params?.district) searchParams.set('district', params.district);
    if (params?.category) searchParams.set('category', params.category);
    if (params?.q) searchParams.set('q', params.q);
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const queryString = searchParams.toString();
    const url = `${API_URL}/api/seo/places${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 取得景點詳情（含相關景點）
 * GET /api/seo/places/by-id/:id（推薦用此端點）
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
 * 取得景點詳情（需提供城市）
 * GET /api/seo/places/:slug?city=xxx
 */
export async function getPlaceBySlug(slug: string, city: string): Promise<PlaceDetailResponse | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/seo/places/${encodeURIComponent(slug)}?city=${encodeURIComponent(city)}`,
      { next: { revalidate: REVALIDATE_TIME } }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 取得所有景點 ID（用於 sitemap 或 generateStaticParams）
 */
export async function getAllPlaceIds(): Promise<{ id: number }[]> {
  try {
    // 使用 getPlaces 取得所有景點，只要 ID
    const response = await getPlaces({ limit: 1000 });
    if (!response) return [];
    return response.places.map(p => ({ id: p.id }));
  } catch {
    return [];
  }
}

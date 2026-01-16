/**
 * 城市 API 資料獲取
 */

import { API_URL } from '@/lib/config';
import type { CitiesResponse, CityDetailResponse, RelatedCitiesResponse, City, District } from '../types';

const REVALIDATE_TIME = 3600; // 1 小時

// ============ Fallback 資料 ============

const FALLBACK_CITIES: City[] = [
  { name: '台北', slug: 'taipei', country: '台灣', placeCount: 50, tripCount: 20, imageUrl: null },
  { name: '東京', slug: 'tokyo', country: '日本', placeCount: 80, tripCount: 30, imageUrl: null },
  { name: '大阪', slug: 'osaka', country: '日本', placeCount: 45, tripCount: 15, imageUrl: null },
  { name: '京都', slug: 'kyoto', country: '日本', placeCount: 60, tripCount: 25, imageUrl: null },
  { name: '首爾', slug: 'seoul', country: '韓國', placeCount: 55, tripCount: 18, imageUrl: null },
  { name: '曼谷', slug: 'bangkok', country: '泰國', placeCount: 40, tripCount: 12, imageUrl: null },
];

// ============ API 函數 ============

/**
 * 取得所有城市列表
 * GET /api/seo/cities
 */
export async function getCities(): Promise<City[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return FALLBACK_CITIES;
    const data: CitiesResponse = await res.json();
    return data.cities || FALLBACK_CITIES;
  } catch {
    return FALLBACK_CITIES;
  }
}

/**
 * 取得城市詳情（含景點列表）
 * GET /api/seo/cities/:slug
 */
export async function getCityDetail(slug: string): Promise<CityDetailResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 取得相關城市
 * GET /api/seo/cities/:slug/related
 */
export async function getRelatedCities(slug: string): Promise<RelatedCitiesResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities/${encodeURIComponent(slug)}/related`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 取得城市內的行政區列表
 * GET /api/seo/cities/:slug/districts
 */
export async function getCityDistricts(slug: string): Promise<District[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities/${encodeURIComponent(slug)}/districts`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.districts || [];
  } catch {
    return [];
  }
}

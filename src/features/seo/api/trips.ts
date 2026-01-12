/**
 * 行程 API 資料獲取
 */

import { API_URL } from '@/lib/config';
import type { TripsResponse, TripDetailResponse, RelatedTripsResponse, Trip } from '../types';

const REVALIDATE_TIME = 3600; // 1 小時

// ============ API 函數 ============

/**
 * 取得所有行程列表
 * GET /api/seo/trips
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return [];
    const data: TripsResponse = await res.json();
    return data.trips || [];
  } catch {
    return [];
  }
}

/**
 * 取得指定城市的行程列表
 * GET /api/seo/trips?city=xxx
 */
export async function getTripsByCity(city: string): Promise<Trip[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips?city=${encodeURIComponent(city)}`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.trips || []);
  } catch {
    return [];
  }
}

/**
 * 取得指定城市和區域的行程列表
 * GET /api/seo/trips?city=xxx&district=xxx
 */
export async function getTripsByCityAndDistrict(city: string, district: string): Promise<Trip[]> {
  try {
    const url = `${API_URL}/api/seo/trips?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}`;
    const res = await fetch(url, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.trips || []);
  } catch {
    return [];
  }
}

/**
 * 取得行程詳情（含景點列表）
 * GET /api/seo/trips/:id
 */
export async function getTripDetail(id: number | string): Promise<TripDetailResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips/${id}`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/**
 * 取得相關行程
 * GET /api/seo/trips/:id/related
 */
export async function getRelatedTrips(id: number | string): Promise<RelatedTripsResponse | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips/${id}/related`, {
      next: { revalidate: REVALIDATE_TIME },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

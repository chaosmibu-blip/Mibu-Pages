/**
 * 活動系統 API
 * 依照 WEB 契約 v1.2.0
 */

import { API_URL } from '@/lib/config';
import type { Event, EventsResponse, EventsParams, EventDetail, EventDetailResponse } from '../types';

// Fallback 資料（當 API 不可用時使用）
const FALLBACK_EVENTS: Event[] = [
  {
    id: 1,
    type: 'announcement',
    title: '歡迎使用 Mibu 旅遊扭蛋',
    description: '下載 App 開始你的扭蛋之旅，發現隱藏的好去處！',
    linkUrl: '/explore',
    linkText: '開始探索',
    startDate: '2026-01-01',
    status: 'active',
    priority: 1,
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 2,
    type: 'festival',
    title: '春節特別活動',
    description: '農曆新年期間，扭蛋機率大幅提升！快來試試你的運氣。',
    imageUrl: '/images/events/cny.jpg',
    startDate: '2026-01-28',
    endDate: '2026-02-12',
    status: 'upcoming',
    priority: 2,
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 3,
    type: 'limited',
    title: '新會員首扭免費',
    description: '新註冊會員享有首次扭蛋免費優惠，數量有限！',
    linkUrl: '/download',
    linkText: '立即下載',
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    status: 'active',
    priority: 3,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

/**
 * 取得活動列表
 */
export async function getEvents(params?: EventsParams): Promise<Event[]> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set('type', params.type);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    const queryString = searchParams.toString();
    const url = `${API_URL}/api/events${queryString ? `?${queryString}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: 300 }, // 5 分鐘快取
    });

    if (!res.ok) {
      console.warn('Events API returned non-OK status, using fallback data');
      return filterFallbackEvents(params);
    }

    const data: EventsResponse = await res.json();
    return data.events || filterFallbackEvents(params);
  } catch (error) {
    console.warn('Failed to fetch events, using fallback data:', error);
    return filterFallbackEvents(params);
  }
}

/**
 * 取得進行中的活動
 */
export async function getActiveEvents(limit?: number): Promise<Event[]> {
  return getEvents({ status: 'active', limit });
}

/**
 * 取得活動詳情
 * 依照 WEB 契約：GET /api/events/:id
 */
export async function getEventDetail(id: string): Promise<EventDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/events/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data: EventDetailResponse = await res.json();
    return data.event || null;
  } catch {
    return null;
  }
}

/**
 * 篩選 Fallback 資料
 */
function filterFallbackEvents(params?: EventsParams): Event[] {
  let events = [...FALLBACK_EVENTS];

  if (params?.type) {
    events = events.filter((e) => e.type === params.type);
  }

  if (params?.status) {
    events = events.filter((e) => e.status === params.status);
  }

  // 依照優先級排序
  events.sort((a, b) => a.priority - b.priority);

  if (params?.limit) {
    events = events.slice(0, params.limit);
  }

  return events;
}

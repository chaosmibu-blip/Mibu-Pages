/**
 * 活動系統型別定義
 * 依照 WEB 契約 v1.2.0
 */

// 活動類型（契約定義：announcement | nationwide | limited）
export type EventType = 'announcement' | 'festival' | 'nationwide' | 'limited';

// 活動狀態
export type EventStatus = 'upcoming' | 'active' | 'ended';

// 活動項目
export interface Event {
  id: number;
  type: EventType;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
  startDate: string;
  endDate?: string;
  status: EventStatus;
  priority: number; // 排序優先級，數字越小越優先
  createdAt: string;
}

// 活動列表回應
export interface EventsResponse {
  events: Event[];
  total: number;
}

// 活動篩選參數
export interface EventsParams {
  type?: EventType;
  status?: EventStatus;
  limit?: number;
}

// 活動詳情（依照 WEB 契約 GET /api/events/:id）
export interface EventDetail {
  id: number;
  type: EventType;
  title: string;
  content: string;
  imageUrl: string | null;
  linkUrl: string | null;
  sourceUrl: string | null;
  address: string | null;
  city: string | null;
  startDate: string;
  endDate: string | null;
  priority: number;
}

// 活動詳情回應
export interface EventDetailResponse {
  event: EventDetail;
}

// 活動類型配置
export const EVENT_TYPE_CONFIG: Record<EventType, {
  label: string;
  color: string;
  bgColor: string;
}> = {
  announcement: {
    label: '公告',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  festival: {
    label: '節慶',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  nationwide: {
    label: '全台活動',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  limited: {
    label: '限時',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

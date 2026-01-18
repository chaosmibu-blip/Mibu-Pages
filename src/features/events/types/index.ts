/**
 * 活動系統型別定義
 * 依照 WEB 契約 v1.2.0
 */

// 活動類型
export type EventType = 'announcement' | 'festival' | 'limited';

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
  limited: {
    label: '限時',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
};

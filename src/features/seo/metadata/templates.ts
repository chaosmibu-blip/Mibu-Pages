/**
 * SEO Metadata 模板配置
 *
 * 統一管理網站的 SEO 相關設定
 */

import { BASE_URL } from '@/lib/config';

// ============ 基本設定 ============

export const SEO_CONFIG = {
  siteName: 'Mibu 旅遊扭蛋',
  titleSuffix: ' | Mibu 旅遊扭蛋',
  defaultDescription: '探索世界各地的精選景點和行程，用 Mibu 旅遊扭蛋發現你的下一趟旅程。',
  defaultOgImage: `${BASE_URL}/og-image.jpg`,
  baseUrl: BASE_URL,
  locale: 'zh_TW',
  twitterHandle: '@mibu_travel',
} as const;

// ============ 頁面類型模板 ============

export const TITLE_TEMPLATES = {
  // 城市頁面
  city: (name: string, placeCount?: number) =>
    placeCount
      ? `${name}景點推薦｜${placeCount} 個必去地點`
      : `${name}景點推薦｜熱門旅遊目的地`,

  // 景點頁面
  place: (name: string, cityName: string) =>
    `${name}｜${cityName}景點推薦`,

  // 行程頁面
  trip: (title: string) => title,

  // 城市行程列表
  cityTrips: (cityName: string) => `${cityName}行程推薦｜精選一日遊規劃`,

  // 區域行程列表
  districtTrips: (cityName: string, districtName: string) =>
    `${districtName}行程｜${cityName}旅遊推薦`,

  // 探索頁面
  explore: () => '探索城市｜發現全球熱門旅遊目的地',

  // 行程總覽
  trips: () => '精選行程｜探索各地一日遊規劃',
} as const;

export const DESCRIPTION_TEMPLATES = {
  // 城市頁面（後端沒有 nameEn，用 country 替代）
  city: (name: string, country: string) =>
    `探索${name}的熱門景點和隱藏好去處。${country}旅遊必去，用 Mibu 旅遊扭蛋發現${name}最棒的旅遊體驗。`,

  // 景點頁面
  place: (name: string, cityName: string, description?: string) =>
    description ||
    `${name}是${cityName}的熱門景點。查看詳細資訊、評價和推薦行程。`,

  // 行程頁面
  trip: (title: string, city: string, placeCount: number, description?: string) =>
    description ||
    `${title} - 包含 ${placeCount} 個${city}景點的精選行程。立即查看詳細路線規劃。`,

  // 城市行程列表
  cityTrips: (cityName: string) =>
    `探索${cityName}的精選旅遊行程，發現最棒的一日遊規劃和推薦路線。`,

  // 區域行程列表
  districtTrips: (cityName: string, districtName: string) =>
    `探索${cityName}${districtName}的精選行程，發現在地人推薦的旅遊路線。`,

  // 探索頁面
  explore: () =>
    '瀏覽全球熱門旅遊城市，探索各地精選景點和推薦行程。用 Mibu 旅遊扭蛋開始你的旅程。',

  // 行程總覽
  trips: () =>
    '瀏覽精選旅遊行程，探索各城市的一日遊規劃。用 Mibu 旅遊扭蛋發現完美的旅遊路線。',
} as const;

// ============ 關鍵字模板 ============

export const KEYWORDS_TEMPLATES = {
  city: (name: string, country: string) => [
    `${name}景點`,
    `${name}旅遊`,
    `${name}必去`,
    `${name}推薦`,
    `${name} travel`,
    `${name} attractions`,
    `${country}旅遊`,
  ],

  place: (name: string, cityName: string, category: string) => [
    name,
    `${cityName}${category}`,
    `${cityName}景點`,
    `${name}推薦`,
  ],

  trip: (city: string, district: string) => [
    `${city}行程`,
    `${city}一日遊`,
    `${district}景點`,
    `${city}旅遊規劃`,
  ],
} as const;

// ============ 工具函數 ============

/**
 * 組合完整標題（加上網站後綴）
 */
export function formatTitle(title: string): string {
  return title + SEO_CONFIG.titleSuffix;
}

/**
 * 產生 canonical URL
 */
export function canonicalUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.baseUrl}${normalizedPath}`;
}

/**
 * 截斷描述文字（SEO 建議 150-160 字元）
 */
export function truncateDescription(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

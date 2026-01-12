/**
 * 統一配置檔
 *
 * 用途：集中管理所有環境變數和配置
 * 避免在各檔案重複定義 API_URL
 */

// ============ API 配置 ============

/**
 * 後端 API URL
 * - 開發環境：使用 Replit dev URL
 * - 生產環境：使用正式 URL
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'https://gacha-travel--s8869420.replit.app';

/**
 * 開發環境 API URL（僅供參考，實際應使用 .env.local 設定）
 */
export const DEV_API_URL =
  'https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev';

/**
 * 生產環境 API URL
 */
export const PROD_API_URL = 'https://gacha-travel--s8869420.replit.app';

// ============ OAuth 配置 ============

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || '';

// ============ 金流配置 ============

export const RECUR_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY || '';

// ============ 網站配置 ============

export const BASE_URL = process.env.BASE_URL || 'https://mibu-travel.com';

// ============ 環境判斷 ============

export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// ============ API 工具函數 ============

/**
 * 建立完整的 API URL
 */
export function apiUrl(endpoint: string): string {
  // 確保 endpoint 以 / 開頭
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_URL}${normalizedEndpoint}`;
}

/**
 * 建立帶 Authorization header 的 fetch 選項
 */
export function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

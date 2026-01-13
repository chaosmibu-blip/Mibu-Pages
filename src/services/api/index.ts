/**
 * API 服務層 - 統一的 API 請求處理
 *
 * 功能：
 * - 統一 API 請求錯誤處理
 * - 自動注入 Authorization header
 * - 提供類型安全的請求方法
 */

import { API_URL } from '@/lib/config';

/** API 錯誤類型 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** API 請求選項 */
interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * 從 localStorage 取得 token
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem('merchant-auth');
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.state?.token || null;
  } catch {
    return null;
  }
}

/**
 * 統一 API 請求函數
 *
 * @param endpoint - API 端點（例如 /api/merchant/me）
 * @param options - fetch 選項
 * @returns 解析後的 JSON 資料
 * @throws ApiError 當請求失敗時
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  const token = getToken();

  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
  };

  const res = await fetch(`${API_URL}${normalizedEndpoint}`, config);

  // 處理非 JSON 回應（例如 204 No Content）
  const contentType = res.headers.get('content-type');
  if (!contentType?.includes('application/json')) {
    if (!res.ok) {
      throw new ApiError('請求失敗', res.status);
    }
    return {} as T;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.error || data.message || '請求失敗',
      res.status,
      data.code,
      data
    );
  }

  return data as T;
}

/**
 * GET 請求
 */
export function get<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST 請求
 */
export function post<T>(
  endpoint: string,
  body?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT 請求
 */
export function put<T>(
  endpoint: string,
  body?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * PATCH 請求
 */
export function patch<T>(
  endpoint: string,
  body?: unknown,
  options?: FetchOptions
): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: 'PATCH', body });
}

/**
 * DELETE 請求
 */
export function del<T>(endpoint: string, options?: FetchOptions): Promise<T> {
  return fetchApi<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * 錯誤碼常數
 *
 * 依照 COMMON 契約 v1.0.0 同步
 * 來源：後端 shared/errors.ts
 * 用於精確的錯誤處理和使用者提示
 */

// ============ 認證相關 (E1xxx) ============
export const AUTH_REQUIRED = 'E1001';
export const AUTH_TOKEN_EXPIRED = 'E1002';
export const AUTH_TOKEN_INVALID = 'E1003';
export const INVALID_CREDENTIALS = 'E1004';
export const EMAIL_ALREADY_EXISTS = 'E1005';
export const PENDING_APPROVAL = 'E1006';
export const ROLE_MISMATCH = 'E1007';
export const ROLE_NOT_ACCESSIBLE = 'E1008';
export const INVALID_ROLE = 'E1009';
export const ADMIN_REQUIRED = 'E1010';
export const FORBIDDEN = 'E1011';
export const SPECIALIST_REQUIRED = 'E1012';
export const ALREADY_REGISTERED = 'E1013';

// ============ 扭蛋相關 (E2xxx) ============
export const GACHA_NO_CREDITS = 'E2001';
export const GACHA_RATE_LIMITED = 'E2002';
export const GACHA_GENERATION_FAILED = 'E2003';

// ============ 地點相關 (E3xxx) ============
export const MISSING_LOCATION_ID = 'E3001';
export const NO_DISTRICT_FOUND = 'E3002';
export const REGION_NOT_FOUND = 'E3003';
export const CITY_REQUIRED = 'E3004';
export const NO_PLACES_AVAILABLE = 'E3005';
export const COUNTRY_NOT_FOUND = 'E3006';

// ============ 商家相關 (E4xxx) ============
export const MERCHANT_REQUIRED = 'E4001';
export const MERCHANT_NOT_FOUND = 'E4002';
export const NO_CODE_SET = 'E4003';
export const CODE_EXPIRED = 'E4004';
export const INVALID_CODE = 'E4005';
export const COUPON_NOT_FOUND = 'E4006';
export const COUPON_EXPIRED = 'E4007';
export const COUPON_ALREADY_USED = 'E4008';
export const PLACE_LIMIT_REACHED = 'E4009';
export const COUPON_LIMIT_REACHED = 'E4010';
export const RARITY_NOT_ALLOWED = 'E4011';

// ============ 驗證相關 (E5xxx) ============
export const VALIDATION_ERROR = 'E5001';
export const INVALID_PARAMS = 'E5002';
export const MISSING_REQUIRED_FIELD = 'E5003';
export const CONFIG_READONLY = 'E5004';
export const INVITE_EXPIRED = 'E5005';
export const INVITE_ALREADY_USED = 'E5006';
export const ALREADY_CLAIMED = 'E5007';
export const ALREADY_ACTIVE = 'E5008';
export const ALREADY_PROCESSED = 'E5009';
export const ALREADY_COMPLETED = 'E5010';

// ============ 資源相關 (E6xxx) ============
export const USER_NOT_FOUND = 'E6001';
export const COLLECTION_NOT_FOUND = 'E6002';
export const ITEM_NOT_FOUND = 'E6003';
export const PLACE_NOT_FOUND = 'E6004';
export const ANNOUNCEMENT_NOT_FOUND = 'E6005';
export const TRIP_NOT_FOUND = 'E6006';
export const PLAN_NOT_FOUND = 'E6007';
export const PLANNER_NOT_FOUND = 'E6008';
export const SUBSCRIPTION_NOT_FOUND = 'E6009';
export const TRANSACTION_NOT_FOUND = 'E6010';
export const NOTIFICATION_NOT_FOUND = 'E6011';
export const SOS_EVENT_NOT_FOUND = 'E6012';
export const PRODUCT_NOT_FOUND = 'E6013';
export const CART_NOT_FOUND = 'E6014';
export const ORDER_NOT_FOUND = 'E6015';

// ============ 支付相關 (E7xxx) ============
export const PAYMENT_FAILED = 'E7001';
export const SUBSCRIPTION_EXPIRED = 'E7002';
export const INSUFFICIENT_BALANCE = 'E7003';

// ============ 伺服器相關 (E9xxx) ============
export const SERVER_ERROR = 'E9001';
export const INTERNAL_ERROR = 'E9002';
export const SERVICE_UNAVAILABLE = 'E9003';
export const RATE_LIMITED = 'E9004';
export const CHAT_NOT_CONFIGURED = 'E9005';
export const WEBHOOK_NOT_CONFIGURED = 'E9006';
export const PAYMENT_NOT_CONFIGURED = 'E9007';
export const TWILIO_NOT_CONFIGURED = 'E9008';

// ============ 錯誤碼對應的中文訊息 ============
export const ErrorMessages: Record<string, string> = {
  // 認證
  [AUTH_REQUIRED]: '請先登入',
  [AUTH_TOKEN_EXPIRED]: '登入已過期，請重新登入',
  [AUTH_TOKEN_INVALID]: '無效的登入憑證',
  [INVALID_CREDENTIALS]: '帳號或密碼錯誤',
  [EMAIL_ALREADY_EXISTS]: '此信箱已被註冊',
  [PENDING_APPROVAL]: '帳號審核中，請稍候',
  [ROLE_MISMATCH]: '此帳號非商家類型，請下載 App 註冊商家',
  [ROLE_NOT_ACCESSIBLE]: '您沒有權限存取此功能',
  [INVALID_ROLE]: '無效的角色類型',
  [ADMIN_REQUIRED]: '需要管理員權限',
  [FORBIDDEN]: '您沒有權限執行此操作',
  [SPECIALIST_REQUIRED]: '需要專家身份',
  [ALREADY_REGISTERED]: '此帳號已註冊',

  // 商家
  [MERCHANT_REQUIRED]: '需要商家身份',
  [MERCHANT_NOT_FOUND]: '找不到商家資料',
  [PLACE_LIMIT_REACHED]: '已達到景點數量上限，請升級方案',
  [COUPON_LIMIT_REACHED]: '已達到優惠券數量上限，請升級方案',
  [COUPON_NOT_FOUND]: '找不到此優惠券',
  [COUPON_EXPIRED]: '優惠券已過期',
  [COUPON_ALREADY_USED]: '優惠券已被使用',
  [ALREADY_CLAIMED]: '此景點已被認領',

  // 支付
  [PAYMENT_FAILED]: '付款失敗，請重試',
  [SUBSCRIPTION_EXPIRED]: '訂閱已過期',
  [INSUFFICIENT_BALANCE]: '餘額不足',

  // 伺服器
  [SERVER_ERROR]: '伺服器錯誤，請稍後再試',
  [SERVICE_UNAVAILABLE]: '服務暫時無法使用',
  [RATE_LIMITED]: '請求過於頻繁，請稍後再試',
};

/**
 * 根據錯誤碼取得中文訊息
 */
export function getErrorMessage(code: string, fallback = '發生未知錯誤'): string {
  return ErrorMessages[code] || fallback;
}

/**
 * 判斷是否為認證相關錯誤
 */
export function isAuthError(code: string): boolean {
  return code.startsWith('E1');
}

/**
 * 判斷是否為商家相關錯誤
 */
export function isMerchantError(code: string): boolean {
  return code.startsWith('E4');
}

/**
 * 判斷是否為支付相關錯誤
 */
export function isPaymentError(code: string): boolean {
  return code.startsWith('E7');
}

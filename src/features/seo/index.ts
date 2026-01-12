/**
 * SEO 模組主入口
 *
 * 統一匯出所有 SEO 相關功能
 *
 * @example
 * // 匯入 metadata 產生器
 * import { generateCityMetadata, generatePlaceMetadata } from '@/features/seo';
 *
 * // 匯入 JSON-LD 產生器
 * import { generatePlaceJsonLd, generateBreadcrumbJsonLd } from '@/features/seo';
 *
 * // 匯入組件
 * import { Breadcrumb, JsonLdScript, SeoPageHeader } from '@/features/seo';
 *
 * // 匯入型別
 * import type { City, Place, Trip } from '@/features/seo';
 */

// ============ 型別 ============
export * from './types';

// ============ Metadata 產生器 ============
export {
  // 配置和工具
  SEO_CONFIG,
  TITLE_TEMPLATES,
  DESCRIPTION_TEMPLATES,
  KEYWORDS_TEMPLATES,
  formatTitle,
  canonicalUrl,
  truncateDescription,
  // 城市
  generateCityMetadata,
  generateExploreMetadata,
  // 景點
  generatePlaceMetadata,
  // 行程
  generateTripMetadata,
  generateTripsMetadata,
  generateCityTripsMetadata,
  generateDistrictTripsMetadata,
} from './metadata';

// ============ JSON-LD 產生器 ============
export {
  // 組織和網站
  generateOrganizationJsonLd,
  generateWebSiteJsonLd,
  // 麵包屑
  generateBreadcrumbJsonLd,
  cityBreadcrumb,
  placeBreadcrumb,
  tripsBreadcrumb,
  cityTripsBreadcrumb,
  districtTripsBreadcrumb,
  tripDetailBreadcrumb,
  // 城市
  generateCityJsonLd,
  generateCityPlacesListJsonLd,
  generateCityListJsonLd,
  // 景點
  generatePlaceJsonLd,
  // 行程
  generateTripJsonLd,
  generateTripListJsonLd,
  generateCityTripsJsonLd,
  generateDistrictTripsJsonLd,
} from './jsonLd';

// ============ 組件 ============
export { JsonLdScript, Breadcrumb, SeoPageHeader } from './components';

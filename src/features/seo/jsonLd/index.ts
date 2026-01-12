/**
 * JSON-LD 產生器模組
 *
 * 統一匯出所有 JSON-LD 產生函數
 */

// 型別
export * from './types';

// 組織和網站
export { generateOrganizationJsonLd, generateWebSiteJsonLd } from './organization';

// 麵包屑
export {
  generateBreadcrumbJsonLd,
  cityBreadcrumb,
  placeBreadcrumb,
  tripsBreadcrumb,
  cityTripsBreadcrumb,
  districtTripsBreadcrumb,
  tripDetailBreadcrumb,
} from './breadcrumb';

// 城市
export {
  generateCityJsonLd,
  generateCityPlacesListJsonLd,
  generatePlacesListJsonLd,
  generateCityListJsonLd,
} from './city';

// 景點
export { generatePlaceJsonLd } from './place';

// 行程
export {
  generateTripJsonLd,
  generateTripWithPlacesJsonLd,
  generateTripListJsonLd,
  generateCityTripsJsonLd,
  generateDistrictTripsJsonLd,
} from './trip';

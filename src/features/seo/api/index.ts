/**
 * SEO API 資料獲取層
 *
 * 統一管理所有 SEO 相關的 API 呼叫
 * 依照 WEB 契約 v1.0.0
 */

// 城市
export { getCities, getCityDetail, getRelatedCities, getCityDistricts } from './cities';

// 景點
export { getPlaces, getPlaceById, getPlaceBySlug, getAllPlaceIds } from './places';

// 行政區
export { getDistrictDetail } from './districts';

// 行程
export {
  getTrips,
  getTripsByCity,
  getTripsByCityAndDistrict,
  getTripDetail,
  getRelatedTrips,
} from './trips';

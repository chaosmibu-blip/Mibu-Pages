/**
 * SEO API 資料獲取層
 *
 * 統一管理所有 SEO 相關的 API 呼叫
 */

// 城市
export { getCities, getCityDetail, getRelatedCities } from './cities';

// 景點
export { getPlaceById, getAllPlaceIds } from './places';

// 行程
export {
  getTrips,
  getTripsByCity,
  getTripsByCityAndDistrict,
  getTripDetail,
  getRelatedTrips,
} from './trips';

/**
 * Metadata 產生器模組
 *
 * 統一匯出所有 metadata 產生函數
 */

// 模板和工具
export {
  SEO_CONFIG,
  TITLE_TEMPLATES,
  DESCRIPTION_TEMPLATES,
  KEYWORDS_TEMPLATES,
  formatTitle,
  canonicalUrl,
  truncateDescription,
} from './templates';

// 城市相關
export { generateCityMetadata, generateExploreMetadata } from './city';

// 景點相關
export { generatePlaceMetadata } from './place';

// 行程相關
export {
  generateTripMetadata,
  generateTripsMetadata,
  generateCityTripsMetadata,
  generateDistrictTripsMetadata,
} from './trip';

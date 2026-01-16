/**
 * SEO 模組型別定義
 *
 * 根據後端 API 實際回傳格式定義
 */

// ============ 通用型別 ============

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GeoLocation {
  lat: string;
  lng: string;
}

export interface I18nText {
  en?: string;
  ja?: string;
  ko?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============ 城市相關 ============

/** 城市列表項目 - GET /api/seo/cities */
export interface City {
  name: string;
  slug: string;
  country: string;
  placeCount: number;
  tripCount: number;
  imageUrl: string | null;
}

/** 城市詳情中的城市資訊 */
export interface CityInfo {
  name: string;
  slug: string;
  country: string;
  placeCount: number;
}

/** 城市詳情回應 - GET /api/seo/cities/:slug */
export interface CityDetailResponse {
  city: CityInfo;
  places: PlaceInCity[];
  pagination: Pagination;
}

/** 城市摘要（用於 related） */
export interface CitySummary {
  name: string;
  slug: string;
  country: string;
  placeCount?: number;
  imageUrl?: string | null;
}

/** 相關城市回應 - GET /api/seo/cities/:slug/related */
export interface RelatedCitiesResponse {
  city: {
    name: string;
    slug: string;
    country: string;
  };
  relatedCities: CitySummary[];
  total: number;
}

/** 城市列表回應 */
export interface CitiesResponse {
  cities: City[];
  total: number;
  message?: string;
}

// ============ 景點相關 ============

/** 城市詳情頁中的景點 */
export interface PlaceInCity {
  id: number;
  name: string;
  slug: string;
  nameI18n?: I18nText;
  district: string;
  address: string;
  category: string;
  subcategory: string;
  rating: number;
  photoReference: string | null;
  description: string;
  googlePlaceId: string;
  imageUrl: string | null;
}

/** 景點詳情 - GET /api/seo/places/by-id/:id */
export interface Place {
  id: number;
  name: string;
  slug: string;
  nameI18n?: I18nText;
  country: string;
  city: string;
  district: string;
  address: string;
  addressI18n?: I18nText;
  category: string;
  subcategory: string;
  description: string;
  descriptionI18n?: I18nText;
  rating: number;
  imageUrl: string | null;
  openingHours: unknown;
  location: GeoLocation | null;
  googlePlaceId: string;
  googleMapUrl: string | null;
}

/** 景點詳情回應 */
export interface PlaceDetailResponse {
  place: Place;
  relatedPlaces: PlaceSummary[];
}

/** 景點摘要（用於 related） */
export interface PlaceSummary {
  id: number;
  name: string;
  slug: string;
  district: string;
  category: string;
  rating: number;
  imageUrl: string | null;
}

// ============ 行程相關 ============

/** 行程列表項目 - GET /api/seo/trips */
export interface Trip {
  id: number;
  sessionId: string;
  title: string;
  city: string;
  district: string | null;
  description: string;
  imageUrl: string | null;
  placeCount: number;
  categoryDistribution: unknown;
  publishedAt: string;
}

/** 行程詳情回應 - GET /api/seo/trips/:id */
export interface TripDetailResponse {
  trip: Trip;
  places: TripPlace[];
}

/** 行程中的景點 */
export interface TripPlace {
  id: number;
  name: string;
  slug: string;
  district: string;
  category: string;
  subcategory: string;
  address: string;
  description: string;
  rating: number;
  imageUrl: string | null;
  location: GeoLocation | null;
}

/** 行程摘要（用於 related） */
export interface TripSummary {
  id: number;
  title: string;
  city: string;
  district: string | null;
  description: string;
  imageUrl: string | null;
  placeCount: number;
  publishedAt: string;
}

/** 相關行程回應 - GET /api/seo/trips/:id/related */
export interface RelatedTripsResponse {
  trip: {
    id: number;
    city: string;
    district: string | null;
  };
  relatedTrips: TripSummary[];
  total: number;
}

/** 行程列表回應 */
export interface TripsResponse {
  trips: Trip[];
  pagination: Pagination;
}

// ============ 區域相關 ============

export interface District {
  name: string;
  slug?: string;
  tripCount: number;
  placeCount?: number;
}

/** 行政區詳情回應 - GET /api/seo/districts/:citySlug/:districtSlug */
export interface DistrictDetailResponse {
  district: {
    name: string;
    slug: string;
    city: string;
    citySlug: string;
    country: string;
    placeCount: number;
    tripCount: number;
  };
  places: PlaceInCity[];
  pagination: Pagination;
}

// ============ 景點列表相關 ============

/** 景點列表查詢參數 - GET /api/seo/places */
export interface PlacesQueryParams {
  city?: string;
  district?: string;
  category?: string;
  q?: string;  // 搜尋關鍵字
  page?: number;
  limit?: number;
}

/** 景點列表回應 - GET /api/seo/places */
export interface PlacesResponse {
  places: PlaceInCity[];
  pagination: Pagination;
  filters?: {
    cities: string[];
    districts: string[];
    categories: string[];
  };
}

// ============ 分類相關（未來擴展） ============

export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  placeCount: number;
  icon?: string;
}

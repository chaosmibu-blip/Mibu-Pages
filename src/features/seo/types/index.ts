/**
 * SEO 模組型別定義
 *
 * 統一定義所有 SEO 相關的資料結構
 */

// ============ 城市相關 ============

export interface City {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  country: string;
  description: string;
  coverImage?: string;
  placeCount: number;
  tripCount?: number;
}

export interface CityDetail extends City {
  places?: PlaceSummary[];
  relatedCities?: CitySummary[];
  topCategories?: string[];
}

export interface CitySummary {
  slug: string;
  name: string;
  coverImage?: string;
}

// ============ 景點相關 ============

export interface Place {
  id: number | string;
  slug: string;
  name: string;
  nameEn?: string;
  category: string;
  subcategory?: string;
  description: string;
  coverImage?: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  location?: GeoLocation;
  city: CitySummary;
}

export interface PlaceSummary {
  id: number | string;
  slug: string;
  name: string;
  category: string;
  rating?: number;
  reviewCount?: number;
  coverImage?: string;
}

// ============ 行程相關 ============

export interface Trip {
  id: number;
  title: string;
  city: string;
  district: string;
  description: string;
  placeCount: number;
  duration?: string;
  coverImage?: string;
  publishedAt?: string;
}

export interface TripDetail extends Trip {
  places: TripPlace[];
  relatedTrips?: TripSummary[];
}

export interface TripPlace {
  id: number | string;
  name: string;
  slug: string;
  category: string;
  rating?: number;
  imageUrl?: string;
  description?: string;
  location?: GeoLocation;
}

export interface TripSummary {
  id: number;
  title: string;
  city: string;
  district: string;
  placeCount: number;
}

// ============ 通用型別 ============

export interface GeoLocation {
  lat: number;
  lng: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============ 區域相關 ============

export interface District {
  name: string;
  tripCount: number;
}

// ============ 分類相關（未來擴展） ============

export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  placeCount: number;
  icon?: string;
}

/**
 * JSON-LD Schema.org 型別定義
 *
 * 定義常用的結構化資料型別
 */

// ============ 基礎型別 ============

export interface WithContext<T> {
  '@context': 'https://schema.org';
  '@type': string;
}

// ============ 組織相關 ============

export interface Organization {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
  contactPoint?: ContactPoint;
}

export interface ContactPoint {
  '@type': 'ContactPoint';
  contactType: string;
  email?: string;
  url?: string;
}

// ============ 麵包屑 ============

export interface BreadcrumbList {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: ListItem[];
}

export interface ListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item?: string;
}

// ============ 地點相關 ============

export interface TouristAttraction {
  '@context': 'https://schema.org';
  '@type': 'TouristAttraction';
  name: string;
  description?: string;
  image?: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
  aggregateRating?: AggregateRating;
  telephone?: string;
  url?: string;
  openingHours?: string;
}

export interface Place {
  '@context': 'https://schema.org';
  '@type': 'Place';
  name: string;
  description?: string;
  image?: string;
  address?: PostalAddress;
  geo?: GeoCoordinates;
}

export interface City {
  '@context': 'https://schema.org';
  '@type': 'City';
  name: string;
  description?: string;
  image?: string;
  containedInPlace?: string;
}

export interface PostalAddress {
  '@type': 'PostalAddress';
  streetAddress?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressCountry?: string;
  postalCode?: string;
}

export interface GeoCoordinates {
  '@type': 'GeoCoordinates';
  latitude: number;
  longitude: number;
}

// ============ 評分相關 ============

export interface AggregateRating {
  '@type': 'AggregateRating';
  ratingValue: number;
  reviewCount?: number;
  bestRating?: number;
  worstRating?: number;
}

// ============ 列表相關 ============

export interface ItemList {
  '@context': 'https://schema.org';
  '@type': 'ItemList';
  name?: string;
  description?: string;
  numberOfItems: number;
  itemListElement: ItemListElement[];
}

export interface ItemListElement {
  '@type': 'ListItem';
  position: number;
  name: string;
  url?: string;
  image?: string;
  description?: string;
}

// ============ 文章相關（行程） ============

export interface TravelAction {
  '@context': 'https://schema.org';
  '@type': 'TravelAction';
  name: string;
  description?: string;
  image?: string;
  itinerary?: ItemList;
}

export interface TouristTrip {
  '@context': 'https://schema.org';
  '@type': 'TouristTrip';
  name: string;
  description?: string;
  image?: string;
  touristType?: string;
  itinerary?: ItemList;
}

// ============ 網站相關 ============

export interface WebSite {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  potentialAction?: SearchAction;
}

export interface SearchAction {
  '@type': 'SearchAction';
  target: {
    '@type': 'EntryPoint';
    urlTemplate: string;
  };
  'query-input': string;
}

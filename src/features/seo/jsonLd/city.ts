/**
 * 城市 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { City, CityInfo, CityDetailResponse, PlaceInCity } from '../types';
import type { City as CitySchema, ItemList } from './types';

/**
 * 產生城市的 JSON-LD
 * @param city - 城市列表項目或城市詳情中的城市資訊
 */
export function generateCityJsonLd(city: City | CityInfo): CitySchema {
  // City 沒有 description，用模板產生
  const description = `探索${city.name}的熱門景點和旅遊行程`;
  // City 列表有 imageUrl，CityInfo 沒有
  const image = ('imageUrl' in city && city.imageUrl) || SEO_CONFIG.defaultOgImage;

  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    description,
    image,
    containedInPlace: city.country,
  };
}

/**
 * 產生城市景點列表的 JSON-LD
 * 用於城市詳情頁，列出該城市的熱門景點
 * @param cityDetail - 城市詳情回應
 * @param maxItems - 最多顯示幾個景點
 */
export function generateCityPlacesListJsonLd(
  cityDetail: CityDetailResponse,
  maxItems = 10
): ItemList | null {
  if (!cityDetail.places || cityDetail.places.length === 0) {
    return null;
  }

  const places = cityDetail.places.slice(0, maxItems);
  const cityName = cityDetail.city.name;

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cityName}熱門景點`,
    description: `探索${cityName}的熱門旅遊景點`,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: place.name,
      url: `${SEO_CONFIG.baseUrl}/place/${place.id}`,
      image: place.imageUrl || undefined,
      description: place.category,
    })),
  };
}

/**
 * 從景點陣列產生列表 JSON-LD
 * @param cityName - 城市名稱
 * @param places - 景點陣列
 */
export function generatePlacesListJsonLd(
  cityName: string,
  places: PlaceInCity[]
): ItemList {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${cityName}熱門景點`,
    description: `探索${cityName}的熱門旅遊景點`,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: place.name,
      url: `${SEO_CONFIG.baseUrl}/place/${place.id}`,
      image: place.imageUrl || undefined,
      description: place.category,
    })),
  };
}

/**
 * 產生城市列表（探索頁）的 JSON-LD
 * @param cities - 城市列表
 */
export function generateCityListJsonLd(cities: City[]): ItemList {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '熱門旅遊城市',
    description: '探索全球熱門旅遊目的地',
    numberOfItems: cities.length,
    itemListElement: cities.map((city, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: city.name,
      url: `${SEO_CONFIG.baseUrl}/city/${city.slug}`,
      image: city.imageUrl || undefined,
      description: `${city.country} - ${city.placeCount} 個景點`,
    })),
  };
}

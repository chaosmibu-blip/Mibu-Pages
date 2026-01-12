/**
 * 城市 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { City as CityData, CityDetail } from '../types';
import type { City, ItemList } from './types';

/**
 * 產生城市的 JSON-LD
 */
export function generateCityJsonLd(city: CityData | CityDetail): City {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    description: city.description,
    image: city.coverImage || SEO_CONFIG.defaultOgImage,
    containedInPlace: city.country,
  };
}

/**
 * 產生城市景點列表的 JSON-LD
 * 用於城市詳情頁，列出該城市的熱門景點
 */
export function generateCityPlacesListJsonLd(
  city: CityDetail,
  maxItems = 10
): ItemList | null {
  if (!city.places || city.places.length === 0) {
    return null;
  }

  const places = city.places.slice(0, maxItems);

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${city.name}熱門景點`,
    description: `探索${city.name}的熱門旅遊景點`,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: place.name,
      url: `${SEO_CONFIG.baseUrl}/place/${place.slug}`,
      image: place.coverImage,
      description: place.category,
    })),
  };
}

/**
 * 產生城市列表（探索頁）的 JSON-LD
 */
export function generateCityListJsonLd(cities: CityData[]): ItemList {
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
      image: city.coverImage,
      description: city.description,
    })),
  };
}

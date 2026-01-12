/**
 * 行程 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { Trip, TripDetailResponse, TripSummary, TripPlace } from '../types';
import type { TouristTrip, ItemList } from './types';

/**
 * 產生行程的 JSON-LD (TouristTrip schema)
 * @param tripDetail - 行程詳情回應
 */
export function generateTripJsonLd(tripDetail: TripDetailResponse): TouristTrip {
  const { trip, places } = tripDetail;

  const itinerary: ItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${trip.title} 行程安排`,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: place.name,
      url: `${SEO_CONFIG.baseUrl}/place/${place.id}`,
      image: place.imageUrl || undefined,
      description: place.description,
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.description,
    image: trip.imageUrl || SEO_CONFIG.defaultOgImage,
    touristType: '自由行旅客',
    itinerary,
  };
}

/**
 * 從行程和景點陣列產生 JSON-LD
 * @param trip - 行程資料
 * @param places - 景點陣列
 */
export function generateTripWithPlacesJsonLd(trip: Trip, places: TripPlace[]): TouristTrip {
  const itinerary: ItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${trip.title} 行程安排`,
    numberOfItems: places.length,
    itemListElement: places.map((place, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: place.name,
      url: `${SEO_CONFIG.baseUrl}/place/${place.id}`,
      image: place.imageUrl || undefined,
      description: place.description,
    })),
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: trip.title,
    description: trip.description,
    image: trip.imageUrl || SEO_CONFIG.defaultOgImage,
    touristType: '自由行旅客',
    itinerary,
  };
}

/**
 * 產生行程列表的 JSON-LD
 * 用於行程總覽頁、城市行程頁、區域行程頁
 * @param trips - 行程列表
 * @param listName - 列表名稱
 * @param listDescription - 列表描述
 */
export function generateTripListJsonLd(
  trips: Trip[] | TripSummary[],
  listName: string,
  listDescription?: string
): ItemList {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    description: listDescription,
    numberOfItems: trips.length,
    itemListElement: trips.map((trip, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: trip.title,
      url: `${SEO_CONFIG.baseUrl}/trip/${trip.id}`,
      // district 可能是 null
      description: `${trip.city}${trip.district ? ` ${trip.district}` : ''} - ${trip.placeCount} 個景點`,
    })),
  };
}

/**
 * 產生城市行程列表的 JSON-LD
 * @param cityName - 城市名稱
 * @param trips - 行程列表
 */
export function generateCityTripsJsonLd(cityName: string, trips: Trip[]): ItemList {
  return generateTripListJsonLd(
    trips,
    `${cityName}精選行程`,
    `探索${cityName}的熱門旅遊行程和一日遊規劃`
  );
}

/**
 * 產生區域行程列表的 JSON-LD
 * @param cityName - 城市名稱
 * @param districtName - 區域名稱
 * @param trips - 行程列表
 */
export function generateDistrictTripsJsonLd(
  cityName: string,
  districtName: string,
  trips: Trip[]
): ItemList {
  return generateTripListJsonLd(
    trips,
    `${cityName}${districtName}行程`,
    `探索${cityName}${districtName}的精選旅遊路線`
  );
}

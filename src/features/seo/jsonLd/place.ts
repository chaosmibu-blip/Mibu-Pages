/**
 * 景點 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { Place } from '../types';
import type { TouristAttraction, AggregateRating, GeoCoordinates, PostalAddress } from './types';

/**
 * 產生景點的 JSON-LD (TouristAttraction schema)
 * @param place - 景點詳情資料
 */
export function generatePlaceJsonLd(place: Place): TouristAttraction {
  const jsonLd: TouristAttraction = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.description,
    image: place.imageUrl || SEO_CONFIG.defaultOgImage,
  };

  // 地址
  if (place.address || place.city) {
    const address: PostalAddress = {
      '@type': 'PostalAddress',
    };
    if (place.address) {
      address.streetAddress = place.address;
    }
    // place.city 現在是 string
    if (place.city) {
      address.addressLocality = place.city;
    }
    if (place.district) {
      address.addressRegion = place.district;
    }
    if (place.country) {
      address.addressCountry = place.country;
    }
    jsonLd.address = address;
  }

  // 座標（lat/lng 是 string，需要轉換）
  if (place.location) {
    const geo: GeoCoordinates = {
      '@type': 'GeoCoordinates',
      latitude: parseFloat(place.location.lat),
      longitude: parseFloat(place.location.lng),
    };
    jsonLd.geo = geo;
  }

  // 評分（後端沒有 reviewCount，但仍然可以顯示評分）
  if (place.rating) {
    const aggregateRating: AggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: place.rating,
      bestRating: 5,
      worstRating: 1,
    };
    jsonLd.aggregateRating = aggregateRating;
  }

  // Google Maps URL
  if (place.googleMapUrl) {
    jsonLd.url = place.googleMapUrl;
  }

  return jsonLd;
}

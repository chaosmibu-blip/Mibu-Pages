/**
 * 景點 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { Place as PlaceData } from '../types';
import type { TouristAttraction, AggregateRating, GeoCoordinates, PostalAddress } from './types';

/**
 * 產生景點的 JSON-LD (TouristAttraction schema)
 */
export function generatePlaceJsonLd(place: PlaceData): TouristAttraction {
  const jsonLd: TouristAttraction = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.description,
    image: place.coverImage || SEO_CONFIG.defaultOgImage,
  };

  // 地址
  if (place.address || place.city) {
    const address: PostalAddress = {
      '@type': 'PostalAddress',
    };
    if (place.address) {
      address.streetAddress = place.address;
    }
    if (place.city) {
      address.addressLocality = place.city.name;
    }
    jsonLd.address = address;
  }

  // 座標
  if (place.location) {
    const geo: GeoCoordinates = {
      '@type': 'GeoCoordinates',
      latitude: place.location.lat,
      longitude: place.location.lng,
    };
    jsonLd.geo = geo;
  }

  // 評分
  if (place.rating && place.reviewCount) {
    const aggregateRating: AggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: place.rating,
      reviewCount: place.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
    jsonLd.aggregateRating = aggregateRating;
  }

  // 聯絡資訊
  if (place.phone) {
    jsonLd.telephone = place.phone;
  }
  if (place.website) {
    jsonLd.url = place.website;
  }
  if (place.openingHours) {
    jsonLd.openingHours = place.openingHours;
  }

  return jsonLd;
}

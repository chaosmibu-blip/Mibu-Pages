/**
 * 行程頁面 Metadata 產生器
 */

import type { Metadata } from 'next';
import type { Trip, TripDetail } from '../types';
import {
  SEO_CONFIG,
  TITLE_TEMPLATES,
  DESCRIPTION_TEMPLATES,
  KEYWORDS_TEMPLATES,
  formatTitle,
  canonicalUrl,
  truncateDescription,
} from './templates';

/**
 * 產生行程詳情頁的 Metadata
 */
export function generateTripMetadata(trip: Trip | TripDetail): Metadata {
  const title = TITLE_TEMPLATES.trip(trip.title);
  const description = truncateDescription(
    DESCRIPTION_TEMPLATES.trip(trip.title, trip.city, trip.placeCount, trip.description)
  );
  const keywords = KEYWORDS_TEMPLATES.trip(trip.city, trip.district);
  const url = canonicalUrl(`/trip/${trip.id}`);
  const ogImage = trip.coverImage || SEO_CONFIG.defaultOgImage;

  return {
    title: formatTitle(title),
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: 'article',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: trip.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 產生行程列表頁（總覽）的 Metadata
 */
export function generateTripsMetadata(): Metadata {
  const title = TITLE_TEMPLATES.trips();
  const description = DESCRIPTION_TEMPLATES.trips();
  const url = canonicalUrl('/trips');

  return {
    title: formatTitle(title),
    description,
    keywords: ['旅遊行程', '一日遊', '行程規劃', '旅遊推薦'],
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: SEO_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: '精選旅遊行程',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SEO_CONFIG.defaultOgImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 產生城市行程列表頁的 Metadata
 */
export function generateCityTripsMetadata(cityName: string): Metadata {
  const title = TITLE_TEMPLATES.cityTrips(cityName);
  const description = DESCRIPTION_TEMPLATES.cityTrips(cityName);
  const url = canonicalUrl(`/trips/${encodeURIComponent(cityName)}`);

  return {
    title: formatTitle(title),
    description,
    keywords: [`${cityName}行程`, `${cityName}一日遊`, `${cityName}旅遊`],
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: SEO_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${cityName}精選行程`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SEO_CONFIG.defaultOgImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * 產生區域行程列表頁的 Metadata
 */
export function generateDistrictTripsMetadata(cityName: string, districtName: string): Metadata {
  const title = TITLE_TEMPLATES.districtTrips(cityName, districtName);
  const description = DESCRIPTION_TEMPLATES.districtTrips(cityName, districtName);
  const url = canonicalUrl(
    `/trips/${encodeURIComponent(cityName)}/${encodeURIComponent(districtName)}`
  );

  return {
    title: formatTitle(title),
    description,
    keywords: [`${districtName}行程`, `${cityName}${districtName}`, `${cityName}旅遊`],
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_CONFIG.siteName,
      locale: SEO_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: SEO_CONFIG.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${cityName}${districtName}精選行程`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [SEO_CONFIG.defaultOgImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

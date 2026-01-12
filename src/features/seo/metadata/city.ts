/**
 * 城市頁面 Metadata 產生器
 */

import type { Metadata } from 'next';
import type { City, CityInfo } from '../types';
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
 * 產生城市詳情頁的 Metadata
 * @param city - 城市列表項目或城市詳情中的城市資訊
 */
export function generateCityMetadata(city: City | CityInfo): Metadata {
  const title = TITLE_TEMPLATES.city(city.name, city.placeCount);
  const description = truncateDescription(
    DESCRIPTION_TEMPLATES.city(city.name, city.country)
  );
  const keywords = KEYWORDS_TEMPLATES.city(city.name, city.country);
  const url = canonicalUrl(`/city/${city.slug}`);
  // City 列表有 imageUrl，CityInfo 沒有
  const ogImage = ('imageUrl' in city && city.imageUrl) || SEO_CONFIG.defaultOgImage;

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
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${city.name}旅遊景點`,
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
 * 產生城市列表頁（探索頁）的 Metadata
 */
export function generateExploreMetadata(): Metadata {
  const title = TITLE_TEMPLATES.explore();
  const description = DESCRIPTION_TEMPLATES.explore();
  const url = canonicalUrl('/explore');

  return {
    title: formatTitle(title),
    description,
    keywords: ['旅遊城市', '熱門景點', '旅遊推薦', '城市探索'],
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
          alt: '探索全球熱門旅遊城市',
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

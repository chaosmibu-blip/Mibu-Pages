/**
 * 景點頁面 Metadata 產生器
 */

import type { Metadata } from 'next';
import type { Place } from '../types';
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
 * 產生景點詳情頁的 Metadata
 */
export function generatePlaceMetadata(place: Place): Metadata {
  const title = TITLE_TEMPLATES.place(place.name, place.city.name);
  const description = truncateDescription(
    DESCRIPTION_TEMPLATES.place(place.name, place.city.name, place.description)
  );
  const keywords = KEYWORDS_TEMPLATES.place(place.name, place.city.name, place.category);
  const url = canonicalUrl(`/place/${place.slug}`);
  const ogImage = place.coverImage || SEO_CONFIG.defaultOgImage;

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
      type: 'place',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: place.name,
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

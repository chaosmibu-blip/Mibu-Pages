/**
 * 組織和網站 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { Organization, WebSite } from './types';

/**
 * 產生網站組織資訊的 JSON-LD
 * 用於首頁或全站
 */
export function generateOrganizationJsonLd(): Organization {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    logo: `${SEO_CONFIG.baseUrl}/logo.png`,
    sameAs: [
      // 可以加入社群媒體連結
      // 'https://www.facebook.com/mibutravel',
      // 'https://www.instagram.com/mibutravel',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      url: `${SEO_CONFIG.baseUrl}/support`,
    },
  };
}

/**
 * 產生網站資訊的 JSON-LD
 * 用於首頁
 */
export function generateWebSiteJsonLd(): WebSite {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SEO_CONFIG.siteName,
    url: SEO_CONFIG.baseUrl,
    description: SEO_CONFIG.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SEO_CONFIG.baseUrl}/explore?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

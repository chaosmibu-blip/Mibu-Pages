/**
 * 麵包屑 JSON-LD 產生器
 */

import { SEO_CONFIG } from '../metadata/templates';
import type { BreadcrumbItem } from '../types';
import type { BreadcrumbList } from './types';

/**
 * 產生麵包屑的 JSON-LD
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): BreadcrumbList {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem' as const,
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${SEO_CONFIG.baseUrl}${item.href}` }),
    })),
  };
}

// ============ 預設麵包屑路徑 ============

/**
 * 城市頁面麵包屑
 */
export function cityBreadcrumb(cityName: string, citySlug: string): BreadcrumbItem[] {
  return [
    { label: '首頁', href: '/' },
    { label: '探索城市', href: '/explore' },
    { label: cityName },
  ];
}

/**
 * 景點頁面麵包屑
 */
export function placeBreadcrumb(
  cityName: string,
  citySlug: string,
  placeName: string
): BreadcrumbItem[] {
  return [
    { label: '首頁', href: '/' },
    { label: '探索城市', href: '/explore' },
    { label: cityName, href: `/city/${citySlug}` },
    { label: placeName },
  ];
}

/**
 * 行程列表頁面麵包屑
 */
export function tripsBreadcrumb(): BreadcrumbItem[] {
  return [
    { label: '首頁', href: '/' },
    { label: '行程' },
  ];
}

/**
 * 城市行程頁面麵包屑
 */
export function cityTripsBreadcrumb(cityName: string): BreadcrumbItem[] {
  return [
    { label: '首頁', href: '/' },
    { label: '行程', href: '/trips' },
    { label: cityName },
  ];
}

/**
 * 區域行程頁面麵包屑
 */
export function districtTripsBreadcrumb(
  cityName: string,
  districtName: string
): BreadcrumbItem[] {
  return [
    { label: '首頁', href: '/' },
    { label: '行程', href: '/trips' },
    { label: cityName, href: `/trips/${encodeURIComponent(cityName)}` },
    { label: districtName },
  ];
}

/**
 * 行程詳情頁面麵包屑
 */
export function tripDetailBreadcrumb(
  cityName: string,
  districtName: string,
  tripTitle: string
): BreadcrumbItem[] {
  return [
    { label: '首頁', href: '/' },
    { label: '行程', href: '/trips' },
    { label: cityName, href: `/trips/${encodeURIComponent(cityName)}` },
    { label: districtName, href: `/trips/${encodeURIComponent(cityName)}/${encodeURIComponent(districtName)}` },
    { label: tripTitle },
  ];
}

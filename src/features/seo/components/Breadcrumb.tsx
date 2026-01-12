/**
 * 統一麵包屑組件
 *
 * 同時產生視覺麵包屑和 JSON-LD 結構化資料
 */

import { Fragment } from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbJsonLd } from '../jsonLd';
import type { BreadcrumbItem } from '../types';
import { JsonLdScript } from './JsonLdScript';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /**
   * 是否顯示首頁圖示
   * @default true
   */
  showHomeIcon?: boolean;
  /**
   * 自訂 className
   */
  className?: string;
}

/**
 * 統一麵包屑組件
 *
 * @example
 * <Breadcrumb items={[
 *   { label: "首頁", href: "/" },
 *   { label: "探索城市", href: "/explore" },
 *   { label: "台北" }
 * ]} />
 */
export function Breadcrumb({
  items,
  showHomeIcon = true,
  className = '',
}: BreadcrumbProps) {
  // 產生 JSON-LD
  const jsonLd = generateBreadcrumbJsonLd(items);

  return (
    <>
      {/* JSON-LD 結構化資料 */}
      <JsonLdScript data={jsonLd} />

      {/* 視覺麵包屑 */}
      <nav
        aria-label="麵包屑導航"
        className={`flex items-center gap-2 text-sm text-muted-foreground flex-wrap ${className}`}
      >
        {items.map((item, index) => (
          <Fragment key={index}>
            {/* 分隔符（第一個不需要） */}
            {index > 0 && (
              <ChevronRight className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            )}

            {/* 項目 */}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors inline-flex items-center gap-1"
              >
                {/* 首頁顯示圖示 */}
                {index === 0 && showHomeIcon && (
                  <Home className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="text-foreground font-medium" aria-current="page">
                {item.label}
              </span>
            )}
          </Fragment>
        ))}
      </nav>
    </>
  );
}

/**
 * SEO 頁面統一 Header 組件
 *
 * 包含麵包屑、標題、副標題的統一排版
 */

import type { BreadcrumbItem } from '../types';
import { Breadcrumb } from './Breadcrumb';

interface SeoPageHeaderProps {
  /**
   * 麵包屑項目
   */
  breadcrumbItems: BreadcrumbItem[];
  /**
   * 頁面主標題
   */
  title: string;
  /**
   * 頁面副標題/描述
   */
  subtitle?: string;
  /**
   * 額外資訊（如：景點數量 badge）
   */
  badge?: React.ReactNode;
  /**
   * 自訂 className
   */
  className?: string;
}

/**
 * SEO 頁面統一 Header
 *
 * @example
 * <SeoPageHeader
 *   breadcrumbItems={[
 *     { label: "首頁", href: "/" },
 *     { label: "台北" }
 *   ]}
 *   title="台北景點推薦"
 *   subtitle="探索台北的熱門景點和隱藏好去處"
 *   badge={<Badge>42 個景點</Badge>}
 * />
 */
export function SeoPageHeader({
  breadcrumbItems,
  title,
  subtitle,
  badge,
  className = '',
}: SeoPageHeaderProps) {
  return (
    <section className={`bg-primary/5 py-12 md:py-16 ${className}`}>
      <div className="max-w-5xl mx-auto px-6">
        {/* 麵包屑 */}
        <Breadcrumb items={breadcrumbItems} className="mb-4" />

        {/* 標題區域 */}
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {title}
          </h1>
          {badge && <div className="mt-2">{badge}</div>}
        </div>

        {/* 副標題 */}
        {subtitle && (
          <p className="mt-4 text-muted-foreground text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

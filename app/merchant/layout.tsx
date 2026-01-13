'use client';

import { usePathname } from 'next/navigation';
import { MerchantSidebar } from '@/components/merchant/MerchantSidebar';

/** 不需要側邊欄的頁面 */
const pagesWithoutSidebar = ['/merchant/login', '/merchant/subscribe'];

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar = !pagesWithoutSidebar.includes(pathname);

  if (!showSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 側邊欄 - 桌面版 */}
          <MerchantSidebar className="hidden lg:block" />

          {/* 主要內容 */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  MapPin,
  Ticket,
  BookOpen,
  Store,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/merchant/dashboard',
    label: '儀表板',
    icon: LayoutDashboard,
    description: '總覽商家狀態',
  },
  {
    href: '/merchant/subscription',
    label: '我的訂閱',
    icon: CreditCard,
    description: '管理訂閱方案',
  },
  {
    href: '/merchant/places',
    label: '景點管理',
    icon: MapPin,
    description: '認領與管理景點',
  },
  {
    href: '/merchant/coupons',
    label: '優惠券管理',
    icon: Ticket,
    description: '建立與管理優惠券',
  },
  {
    href: '/merchant/guide',
    label: '新手教學',
    icon: BookOpen,
    description: '操作指南',
  },
];

interface MerchantSidebarProps {
  className?: string;
}

export function MerchantSidebar({ className }: MerchantSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn('w-64 shrink-0', className)}>
      <div className="sticky top-20 space-y-2">
        {/* 商家標識 */}
        <div className="flex items-center gap-3 px-4 py-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-foreground">商家後台</p>
            <p className="text-xs text-muted-foreground">管理您的商家資訊</p>
          </div>
        </div>

        {/* 導航項目 */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all group',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.label}</p>
                  {!isActive && (
                    <p className="text-xs opacity-70 truncate">{item.description}</p>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition-transform',
                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* 幫助連結 */}
        <div className="pt-4 mt-4 border-t">
          <Link
            href="/support"
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            需要協助？聯繫客服
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default MerchantSidebar;

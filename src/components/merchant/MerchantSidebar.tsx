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
  HelpCircle,
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
      {/* 深棕色側邊欄容器 */}
      <div className="sticky top-20 bg-sidebar text-sidebar-foreground rounded-2xl p-4 shadow-lg">
        {/* 商家標識 */}
        <div className="flex items-center gap-3 px-3 py-4 mb-2 border-b border-sidebar-border">
          <div className="p-2.5 bg-sidebar-primary/20 rounded-xl">
            <Store className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div>
            <p className="font-semibold text-sidebar-foreground">商家後台</p>
            <p className="text-xs text-sidebar-foreground/60">管理您的商家資訊</p>
          </div>
        </div>

        {/* 導航項目 */}
        <nav className="space-y-1 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <Icon className={cn(
                  'h-5 w-5 shrink-0 transition-transform',
                  isActive ? '' : 'group-hover:scale-110'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.label}</p>
                  {!isActive && (
                    <p className="text-xs opacity-60 truncate">{item.description}</p>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    'h-4 w-4 shrink-0 transition-all',
                    isActive
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2 group-hover:opacity-50 group-hover:translate-x-0'
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* 幫助連結 */}
        <div className="pt-3 mt-2 border-t border-sidebar-border">
          <Link
            href="/support"
            className="flex items-center gap-2 px-3 py-2.5 text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-all"
          >
            <HelpCircle className="h-4 w-4" />
            需要協助？聯繫客服
          </Link>
        </div>
      </div>
    </aside>
  );
}

export default MerchantSidebar;

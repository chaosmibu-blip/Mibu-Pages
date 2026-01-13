"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, MapPin, Ticket, BookOpen } from "lucide-react";

const navItems = [
  { href: "/merchant/subscription", label: "我的訂閱", icon: CreditCard },
  { href: "/merchant/places", label: "景點管理", icon: MapPin },
  { href: "/merchant/coupons", label: "優惠券管理", icon: Ticket },
  { href: "/merchant/guide", label: "新手教學", icon: BookOpen },
];

export function MerchantNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 mb-6" data-testid="nav-merchant">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
            data-testid={`link-merchant-${item.href.split("/").pop()}`}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

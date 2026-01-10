import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/for-business", label: "商家合作" },
  { href: "/pricing", label: "訂閱方案" },
  { href: "/merchant/login", label: "商家登入" },
  { href: "/privacy", label: "隱私權政策" },
  { href: "/terms", label: "使用條款" },
  { href: "/support", label: "技術支援" },
];

function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" data-testid="link-home">
          <span className="text-2xl font-bold text-primary tracking-tight">Mibu</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1" data-testid="nav-desktop">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                location === item.href
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`link-${item.href.slice(1)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button
          size="icon"
          variant="ghost"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="button-mobile-menu"
          aria-label={mobileMenuOpen ? "關閉選單" : "開啟選單"}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background" data-testid="nav-mobile">
          <div className="px-6 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  location === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
                data-testid={`link-mobile-${item.href.slice(1)}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            Copyright © {currentYear} 查爾斯有限公司
          </p>
          <a
            href="mailto:chaosmibu@gmail.com"
            className="flex items-center gap-2 hover:text-primary transition-colors"
            data-testid="link-email-footer"
          >
            <Mail className="h-4 w-4" />
            chaosmibu@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

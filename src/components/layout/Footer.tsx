import Link from "next/link";
import { Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/50 border-t border-border mt-auto">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link href="/" className="text-xl font-bold text-primary">
              Mibu
            </Link>
            <p className="text-sm text-muted-foreground mt-2">
              用旅遊扭蛋的方式探索世界
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">商家</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/for-business" className="hover:text-primary">商家合作</Link></li>
              <li><Link href="/for-business/pricing" className="hover:text-primary">訂閱方案</Link></li>
              <li><Link href="/merchant/login" className="hover:text-primary">商家登入</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-3">法律</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">隱私權政策</Link></li>
              <li><Link href="/terms" className="hover:text-primary">服務條款</Link></li>
              <li><Link href="/refund" className="hover:text-primary">退款政策</Link></li>
              <li><Link href="/support" className="hover:text-primary">技術支援</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-sm text-muted-foreground">
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

import { Button } from "@/components/ui/button";
import { MapPin, Home, Search } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-full bg-primary/10">
            <MapPin className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>

        <h2 className="text-xl font-semibold text-foreground mb-2">
          找不到頁面
        </h2>

        <p className="text-muted-foreground mb-6">
          這個頁面可能已被移除、名稱已變更，或暫時無法使用。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              返回首頁
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/explore">
              <Search className="mr-2 h-4 w-4" />
              探索城市
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { MapPin, ChevronRight, Loader2, Download, AlertCircle, RefreshCw } from "lucide-react";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";

interface City {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  country: string;
  coverImage: string;
  placesCount: number;
}

export default function ExplorePage() {
  useSEO({
    title: "探索城市",
    description:
      "探索世界各地的熱門旅遊城市，發現最棒的景點、美食和體驗。使用 Mibu 開啟您的旅遊冒險。",
  });

  const API_URL = import.meta.env.VITE_API_URL || "";

  const { data: cities, isLoading, error, refetch } = useQuery<City[]>({
    queryKey: ["seo-cities"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/seo/cities`);
      if (!res.ok) throw new Error("Failed to fetch cities");
      return res.json();
    },
  });

  return (
    <Layout>
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            data-testid="heading-explore"
          >
            探索城市
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            發現世界各地的精彩目的地，開始規劃您的下一趟旅程。
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                載入失敗
              </h2>
              <p className="text-muted-foreground mb-6">
                無法取得城市資料，請檢查網路連線後再試。
              </p>
              <Button onClick={() => refetch()} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                重新載入
              </Button>
            </div>
          ) : cities && cities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Link key={city.id} href={`/city/${city.slug}`}>
                  <Card
                    className="overflow-hidden hover-elevate cursor-pointer group"
                    data-testid={`card-city-${city.slug}`}
                  >
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img
                        src={city.coverImage}
                        alt={city.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-bold text-white mb-1">
                          {city.name}
                        </h2>
                        <p className="text-sm text-white/80">{city.nameEn}</p>
                      </div>
                    </div>
                    <div className="p-4 flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{city.country}</span>
                      </div>
                      <Badge variant="secondary">
                        {city.placesCount} 個景點
                      </Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                目前沒有城市資料
              </h2>
              <p className="text-muted-foreground mb-4">
                下載 Mibu App，用旅遊扭蛋的方式探索世界各地的精彩景點！
              </p>
              <Button asChild>
                <Link href="/">
                  <Download className="mr-2 h-4 w-4" />
                  前往下載 App
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <AppDownloadCTA />

      <section className="py-8 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <nav aria-label="麵包屑">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
              <li>
                <Link href="/" className="hover:text-primary">
                  首頁
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-foreground font-medium">探索城市</li>
            </ol>
          </nav>
        </div>
      </section>
    </Layout>
  );
}

import { useState } from "react";
import { Link, useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Star, ChevronRight, Loader2, ArrowLeft, ChevronLeft, AlertCircle, RefreshCw } from "lucide-react";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";

interface Place {
  id: number;
  slug: string;
  name: string;
  category: string;
  rating: number;
  image: string;
}

interface CityData {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  country: string;
  description: string;
  coverImage: string;
  places: Place[];
  totalPlaces: number;
  page: number;
  totalPages: number;
}

const PLACES_PER_PAGE = 50;

export default function CityDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const [page, setPage] = useState(1);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const { data: city, isLoading, error, refetch } = useQuery<CityData>({
    queryKey: ["seo-city", slug, page],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/seo/cities/${slug}?page=${page}&limit=${PLACES_PER_PAGE}`);
      if (!res.ok) throw new Error("City not found");
      return res.json();
    },
    enabled: !!slug,
  });

  useSEO({
    title: city ? `${city.name} 必去景點推薦` : "城市詳情",
    description: city
      ? `探索 ${city.name} 最熱門的 ${city.totalPlaces || city.places?.length || 0} 個景點，包含美食、購物、景點等分類。`
      : "探索城市景點",
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !city) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">找不到城市</h1>
          <p className="text-muted-foreground mb-6">
            抱歉，我們找不到這個城市的資料。
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              重新載入
            </Button>
            <Link href="/explore">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回城市列表
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const totalPages = city.totalPages || Math.ceil((city.totalPlaces || city.places.length) / PLACES_PER_PAGE);

  return (
    <Layout>
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={city.coverImage}
          alt={city.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 max-w-5xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            data-testid="heading-city"
          >
            {city.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="h-4 w-4" />
            <span>{city.country}</span>
            <span className="mx-2">|</span>
            <span>{city.nameEn}</span>
          </div>
        </div>
      </section>

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
              <li>
                <Link href="/explore" className="hover:text-primary">
                  探索城市
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-foreground font-medium">{city.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <p
            className="text-lg text-muted-foreground mb-8"
            data-testid="text-city-description"
          >
            {city.description}
          </p>

          <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
            <h2 className="text-2xl font-bold text-foreground">
              熱門景點
              {city.totalPlaces && (
                <span className="text-muted-foreground font-normal text-lg ml-2">
                  ({city.totalPlaces} 個)
                </span>
              )}
            </h2>
            {totalPages > 1 && (
              <div className="text-sm text-muted-foreground">
                第 {page} / {totalPages} 頁
              </div>
            )}
          </div>

          {city.places && city.places.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {city.places.map((place) => (
                  <Link key={place.id} href={`/place/${place.id}`}>
                    <Card
                      className="overflow-hidden hover-elevate cursor-pointer group"
                      data-testid={`card-place-${place.id}`}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <Badge
                          className="absolute top-3 left-3"
                          variant="secondary"
                        >
                          {place.category}
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2">
                          {place.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    data-testid="button-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    上一頁
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="icon"
                          onClick={() => setPage(pageNum)}
                          data-testid={`button-page-${pageNum}`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    data-testid="button-next-page"
                  >
                    下一頁
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">目前沒有景點資料。</p>
          )}
        </div>
      </section>

      <AppDownloadCTA />
    </Layout>
  );
}

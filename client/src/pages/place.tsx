import { Link, useParams } from "wouter";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Star,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Clock,
  Globe,
  Navigation,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";

interface PlaceData {
  id: number;
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  city: { slug: string; name: string };
  description: string;
  coverImage: string;
  rating: number;
  address: string;
  openingHours?: string;
  website?: string;
}

export default function PlaceDetailPage() {
  const params = useParams<{ id: string }>();
  const placeId = params.id;

  const API_URL = import.meta.env.VITE_API_URL || "";

  const { data: place, isLoading, error, refetch } = useQuery<PlaceData>({
    queryKey: ["seo-place", placeId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/seo/places/by-id/${placeId}`);
      if (!res.ok) throw new Error("Place not found");
      return res.json();
    },
    enabled: !!placeId,
  });

  useSEO({
    title: place ? `${place.name} - ${place.city.name}` : "景點詳情",
    description: place
      ? place.description
      : "探索景點詳情",
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

  if (error || !place) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">找不到景點</h1>
          <p className="text-muted-foreground mb-6">
            抱歉，我們找不到這個景點的資料。
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

  return (
    <Layout>
      <section className="relative h-64 md:h-96 overflow-hidden">
        <img
          src={place.coverImage}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 max-w-5xl mx-auto">
          <Badge className="mb-3" variant="secondary">
            {place.category}
          </Badge>
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            data-testid="heading-place"
          >
            {place.name}
          </h1>
          <div className="flex items-center gap-4 text-white/80 flex-wrap">
            <span>{place.nameEn}</span>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{place.rating}</span>
            </div>
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
              <li>
                <Link
                  href={`/city/${place.city.slug}`}
                  className="hover:text-primary"
                >
                  {place.city.name}
                </Link>
              </li>
              <ChevronRight className="h-4 w-4" />
              <li className="text-foreground font-medium">{place.name}</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-foreground mb-4">
                關於此景點
              </h2>
              <p
                className="text-muted-foreground leading-relaxed"
                data-testid="text-place-description"
              >
                {place.description}
              </p>
            </div>

            <div>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">地址</p>
                      <p className="font-medium text-foreground">
                        {place.address}
                      </p>
                    </div>
                  </div>

                  {place.openingHours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">營業時間</p>
                        <p className="font-medium text-foreground">
                          {place.openingHours}
                        </p>
                      </div>
                    </div>
                  )}

                  {place.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">官方網站</p>
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline"
                        >
                          前往網站
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Link href={`/city/${place.city.slug}`}>
                      <Button variant="outline" className="w-full">
                        <MapPin className="mr-2 h-4 w-4" />
                        探索 {place.city.name} 更多景點
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <AppDownloadCTA />
    </Layout>
  );
}

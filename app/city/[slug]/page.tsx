import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { MapPin, Star, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/config";

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
}

interface CityData {
  slug: string;
  name: string;
  nameEn: string;
  country: string;
  description: string;
  placeCount: number;
  places: Place[];
}

async function getCity(slug: string): Promise<CityData | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities/${slug}`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    const mockCities: Record<string, CityData> = {
      taipei: {
        slug: "taipei",
        name: "台北",
        nameEn: "Taipei",
        country: "台灣",
        description: "台灣首都，融合傳統與現代的活力城市。從夜市美食到歷史古蹟，處處充滿驚喜。",
        placeCount: 120,
        places: [
          { id: "taipei-101", name: "台北101", category: "地標", rating: 4.5, reviewCount: 1200, coverImage: "" },
          { id: "shilin-night-market", name: "士林夜市", category: "夜市", rating: 4.3, reviewCount: 890, coverImage: "" },
          { id: "national-palace-museum", name: "故宮博物院", category: "博物館", rating: 4.7, reviewCount: 650, coverImage: "" },
        ],
      },
      tokyo: {
        slug: "tokyo",
        name: "東京",
        nameEn: "Tokyo",
        country: "日本",
        description: "日本首都，傳統與科技完美融合的都市。從古老神社到霓虹閃爍的街道，體驗多元文化。",
        placeCount: 200,
        places: [
          { id: "sensoji", name: "淺草寺", category: "寺廟", rating: 4.6, reviewCount: 2100, coverImage: "" },
          { id: "shibuya-crossing", name: "澀谷十字路口", category: "地標", rating: 4.4, reviewCount: 1500, coverImage: "" },
          { id: "meiji-shrine", name: "明治神宮", category: "神社", rating: 4.5, reviewCount: 980, coverImage: "" },
        ],
      },
    };
    
    return mockCities[slug] || null;
  }
}

// 與 sitemap.ts 共用的 fallback，確保一致性
const STATIC_CITY_SLUGS = ["taipei", "tokyo", "osaka", "kyoto", "seoul", "bangkok"];

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities`);
    if (!res.ok) {
      return STATIC_CITY_SLUGS.map((slug) => ({ slug }));
    }
    const data = await res.json();

    // 支援多種 API 回應格式
    let cities: { slug: string }[] = [];
    if (Array.isArray(data)) {
      cities = data;
    } else if (data?.cities && Array.isArray(data.cities)) {
      cities = data.cities;
    } else if (data?.data && Array.isArray(data.data)) {
      cities = data.data;
    }

    if (cities.length === 0) {
      return STATIC_CITY_SLUGS.map((slug) => ({ slug }));
    }

    return cities.map((city) => ({ slug: city.slug }));
  } catch {
    return STATIC_CITY_SLUGS.map((slug) => ({ slug }));
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const city = await getCity(slug);
  
  if (!city) {
    return {
      title: "城市不存在 | Mibu 旅遊扭蛋",
    };
  }

  return {
    title: `${city.name}景點推薦 | Mibu 旅遊扭蛋`,
    description: `探索${city.name}(${city.nameEn})的熱門景點和隱藏好去處。${city.description}`,
    openGraph: {
      title: `${city.name}景點推薦 | Mibu 旅遊扭蛋`,
      description: city.description,
      images: [{ url: "https://mibu-travel.com/icon.jpg" }],
    },
  };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = await getCity(slug);

  if (!city) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/explore" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            返回城市列表
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Badge variant="secondary" className="mb-2">{city.country}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {city.name} <span className="text-muted-foreground font-normal text-xl">{city.nameEn}</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                {city.description}
              </p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span className="font-semibold">{city.placeCount} 個景點</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">熱門景點</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {city.places.map((place) => (
              <Link
                key={place.id}
                href={`/place/${place.id}`}
                data-testid={`link-place-${place.id}`}
              >
                <Card className="group cursor-pointer transition-all hover:shadow-md overflow-hidden h-full">
                  <div className="aspect-video bg-gradient-to-br from-accent/30 to-primary/20 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-primary/40" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {place.name}
                      </h3>
                      <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    </div>
                    <Badge variant="outline" className="mb-2">{place.category}</Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating}</span>
                      </div>
                      <span>({place.reviewCount} 則評論)</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <AppDownloadCTA />
    </div>
  );
}

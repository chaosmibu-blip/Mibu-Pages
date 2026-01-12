import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { MapPin, Building2, Globe } from "lucide-react";
import { API_URL } from "@/lib/config";

export const metadata: Metadata = {
  title: "探索城市 | Mibu 旅遊扭蛋",
  description: "探索世界各地的城市景點，用 Mibu 扭蛋發現隱藏的好去處。台北、東京、大阪、京都、首爾、曼谷等熱門旅遊城市。",
};

interface City {
  slug: string;
  name: string;
  nameEn: string;
  country: string;
  placeCount: number;
  coverImage: string;
}

const FALLBACK_CITIES: City[] = [
  { slug: "taipei", name: "台北", nameEn: "Taipei", country: "台灣", placeCount: 120, coverImage: "" },
  { slug: "tokyo", name: "東京", nameEn: "Tokyo", country: "日本", placeCount: 200, coverImage: "" },
  { slug: "osaka", name: "大阪", nameEn: "Osaka", country: "日本", placeCount: 150, coverImage: "" },
  { slug: "kyoto", name: "京都", nameEn: "Kyoto", country: "日本", placeCount: 180, coverImage: "" },
  { slug: "seoul", name: "首爾", nameEn: "Seoul", country: "韓國", placeCount: 160, coverImage: "" },
  { slug: "bangkok", name: "曼谷", nameEn: "Bangkok", country: "泰國", placeCount: 140, coverImage: "" },
];

async function getCities(): Promise<City[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return FALLBACK_CITIES;
    }
    
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.cities)) {
      return data.cities;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return FALLBACK_CITIES;
  } catch {
    return FALLBACK_CITIES;
  }
}

export default async function ExplorePage() {
  const cities = await getCities();

  return (
    <div className="flex flex-col">
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Globe className="h-4 w-4" />
            探索世界
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            探索城市
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            選擇一個城市，發現當地最獨特的景點和體驗。
            用 Mibu 扭蛋讓旅程充滿驚喜！
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/city/${city.slug}`}
                data-testid={`link-city-${city.slug}`}
              >
                <Card className="group cursor-pointer transition-all hover:shadow-md overflow-hidden h-full">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-primary/40" />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {city.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">{city.nameEn}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {city.country}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{city.placeCount} 個景點</span>
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

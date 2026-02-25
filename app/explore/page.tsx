import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { MapPin, Building2 } from "lucide-react";
import {
  generateExploreMetadata,
  generateCityListJsonLd,
  getCities,
  SeoPageHeader,
  JsonLdScript,
  type City,
} from "@/features/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateExploreMetadata();
}

export const revalidate = 3600;

export default async function ExplorePage() {
  const cities = await getCities();
  const cityListJsonLd = generateCityListJsonLd(cities);

  return (
    <div className="flex flex-col">
      <JsonLdScript data={cityListJsonLd} />

      <SeoPageHeader
        breadcrumbItems={[
          { label: "首頁", href: "/" },
          { label: "探索城市" },
        ]}
        title="探索城市"
        subtitle="選擇一個城市，發現當地最獨特的景點和體驗。用 Mibu 扭蛋讓旅程充滿驚喜！"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city: City) => (
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
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {city.name}
                      </h2>
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

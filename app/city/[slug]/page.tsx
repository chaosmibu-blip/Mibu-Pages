import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { MapPin, Star, ChevronRight } from "lucide-react";
import {
  getCities,
  getCityDetail,
  generateCityMetadata,
  generateCityJsonLd,
  generateCityPlacesListJsonLd,
  cityBreadcrumb,
  SeoPageHeader,
  JsonLdScript,
} from "@/features/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const cities = await getCities();
  return cities.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCityDetail(slug);
  if (!data) {
    return { title: "城市不存在 | Mibu 旅遊扭蛋" };
  }
  return generateCityMetadata(data.city);
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCityDetail(slug);

  if (!data) {
    notFound();
  }

  const { city, places } = data;
  const breadcrumbItems = cityBreadcrumb(city.name, city.slug);
  const cityJsonLd = generateCityJsonLd(city);
  const placesListJsonLd = generateCityPlacesListJsonLd(data);
  const jsonLdData = [cityJsonLd, placesListJsonLd].filter(Boolean);

  return (
    <div className="flex flex-col">
      <JsonLdScript data={jsonLdData} />

      <SeoPageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${city.name}景點推薦`}
        subtitle={`探索${city.name}的熱門景點和隱藏好去處`}
        badge={<Badge variant="secondary">{city.placeCount} 個景點</Badge>}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">熱門景點</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
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
                    {place.rating > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{place.rating}</span>
                      </div>
                    )}
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

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { MapPin, Star, Clock, Globe, ExternalLink } from "lucide-react";
import {
  getPlaceById,
  getAllPlaceIds,
  generatePlaceMetadata,
  generatePlaceJsonLd,
  placeBreadcrumb,
  SeoPageHeader,
  JsonLdScript,
} from "@/features/seo";

export const revalidate = 3600;

export async function generateStaticParams() {
  const placeIds = await getAllPlaceIds();
  return placeIds.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getPlaceById(id);
  if (!data) {
    return { title: "景點不存在 | Mibu 旅遊扭蛋" };
  }
  return generatePlaceMetadata(data.place);
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getPlaceById(id);

  if (!data) {
    notFound();
  }

  const { place } = data;
  const citySlug = encodeURIComponent(place.city);
  const breadcrumbItems = placeBreadcrumb(place.city, citySlug, place.name);
  const placeJsonLd = generatePlaceJsonLd(place);

  return (
    <div className="flex flex-col">
      <JsonLdScript data={placeJsonLd} />

      <SeoPageHeader
        breadcrumbItems={breadcrumbItems}
        title={place.name}
        subtitle={place.description}
        badge={<Badge variant="secondary">{place.category}</Badge>}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {place.nameI18n?.en && (
                <p className="text-muted-foreground mb-4">{place.nameI18n.en}</p>
              )}

              {place.rating > 0 && (
                <div className="flex items-center gap-1 mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{place.rating}</span>
                </div>
              )}

              <p className="text-foreground leading-relaxed">
                {place.description}
              </p>
            </div>

            <Card className="lg:w-80 shrink-0">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-foreground">景點資訊</h3>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-sm">{place.address}</span>
                </div>

                {place.openingHours != null && (
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-sm">
                      {typeof place.openingHours === 'string'
                        ? place.openingHours
                        : '請查看 Google Maps'}
                    </span>
                  </div>
                )}

                {place.googleMapUrl && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <a
                      href={place.googleMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      在 Google Maps 查看
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <AppDownloadCTA />
    </div>
  );
}

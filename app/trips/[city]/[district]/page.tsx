import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route } from "lucide-react";
import {
  getTrips,
  getTripsByCityAndDistrict,
  generateDistrictTripsMetadata,
  generateDistrictTripsJsonLd,
  districtTripsBreadcrumb,
  SeoPageHeader,
  JsonLdScript,
  type Trip,
} from "@/features/seo";

export const revalidate = 3600;

interface Props {
  params: Promise<{ city: string; district: string }>;
}

export async function generateStaticParams() {
  const trips = await getTrips();
  const cityDistrictPairs = [...new Set(
    trips
      .filter((t) => t.city && t.district)
      .map((t) => `${t.city}|${t.district}`)
  )];

  return cityDistrictPairs.map((pair) => {
    const [city, district] = pair.split("|");
    return {
      city: encodeURIComponent(city),
      district: encodeURIComponent(district),
    };
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = await params;
  return generateDistrictTripsMetadata(
    decodeURIComponent(city),
    decodeURIComponent(district)
  );
}

export default async function DistrictTripsPage({ params }: Props) {
  const { city, district } = await params;
  const decodedCity = decodeURIComponent(city);
  const decodedDistrict = decodeURIComponent(district);
  const trips = await getTripsByCityAndDistrict(decodedCity, decodedDistrict);

  const breadcrumbItems = districtTripsBreadcrumb(decodedCity, decodedDistrict);
  const jsonLd = generateDistrictTripsJsonLd(decodedCity, decodedDistrict, trips);

  return (
    <div className="flex flex-col">
      <JsonLdScript data={jsonLd} />

      <SeoPageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${decodedCity}${decodedDistrict}行程`}
        subtitle={`探索${decodedDistrict}的精選旅遊行程`}
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trips.map((trip: Trip) => (
                <Link
                  key={trip.id}
                  href={`/trip/${trip.id}`}
                  data-testid={`link-trip-${trip.id}`}
                >
                  <Card className="hover-elevate transition-all">
                    <CardContent className="p-6">
                      <h2 className="text-lg font-semibold mb-2">{trip.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {trip.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          <Route className="h-3 w-3 mr-1" />
                          {trip.placeCount} 個景點
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">暫無行程資料</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

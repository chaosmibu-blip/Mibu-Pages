import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Route } from "lucide-react";
import {
  generateTripsMetadata,
  generateTripListJsonLd,
  getTrips,
  tripsBreadcrumb,
  SeoPageHeader,
  JsonLdScript,
  type Trip,
} from "@/features/seo";

export async function generateMetadata(): Promise<Metadata> {
  return generateTripsMetadata();
}

export const revalidate = 3600;

interface CityGroup {
  name: string;
  tripCount: number;
}

function groupTripsByCity(trips: Trip[]): CityGroup[] {
  const cityMap = new Map<string, number>();
  trips.forEach((trip) => {
    cityMap.set(trip.city, (cityMap.get(trip.city) || 0) + 1);
  });
  return Array.from(cityMap.entries()).map(([name, tripCount]) => ({
    name,
    tripCount,
  }));
}

export default async function TripsPage() {
  const trips = await getTrips();
  const cities = groupTripsByCity(trips);

  const breadcrumbItems = tripsBreadcrumb();
  const tripsJsonLd = generateTripListJsonLd(trips, '精選旅遊行程', '探索各城市的精選旅遊行程規劃');

  return (
    <div className="flex flex-col">
      <JsonLdScript data={tripsJsonLd} />

      <SeoPageHeader
        breadcrumbItems={breadcrumbItems}
        title="探索行程"
        subtitle="發現精選旅遊行程，開始規劃您的下一趟旅程。"
      />

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {cities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cities.map((city) => (
                <Link
                  key={city.name}
                  href={`/trips/${encodeURIComponent(city.name)}`}
                  data-testid={`link-city-${city.name}`}
                >
                  <Card className="hover-elevate transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">{city.name}</h2>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Route className="h-4 w-4" />
                        <span>{city.tripCount} 個行程</span>
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

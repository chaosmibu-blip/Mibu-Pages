import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Route } from "lucide-react";

export const metadata: Metadata = {
  title: "探索行程 | Mibu",
  description: "探索精選旅遊行程，發現各地最棒的一日遊、多日遊行程規劃。",
};

export const revalidate = 3600;

interface Trip {
  id: number;
  title: string;
  city: string;
  district: string;
  description: string;
  placeCount: number;
}

interface City {
  name: string;
  tripCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev";

async function getTrips(): Promise<Trip[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.trips || []);
  } catch {
    return [];
  }
}

function groupTripsByCity(trips: Trip[]): City[] {
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

  return (
    <div className="flex flex-col">
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            探索行程
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            發現精選旅遊行程，開始規劃您的下一趟旅程。
          </p>
        </div>
      </section>

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

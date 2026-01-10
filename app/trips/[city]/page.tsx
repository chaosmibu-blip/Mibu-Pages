import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Route, ChevronRight } from "lucide-react";

export const revalidate = 3600;

interface Trip {
  id: number;
  title: string;
  city: string;
  district: string;
  description: string;
  placeCount: number;
}

interface District {
  name: string;
  tripCount: number;
}

interface Props {
  params: Promise<{ city: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev";

async function getTripsByCity(city: string): Promise<Trip[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips?city=${encodeURIComponent(city)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.trips || []);
  } catch {
    return [];
  }
}

function groupTripsByDistrict(trips: Trip[]): District[] {
  const districtMap = new Map<string, number>();
  trips.forEach((trip) => {
    districtMap.set(trip.district, (districtMap.get(trip.district) || 0) + 1);
  });
  return Array.from(districtMap.entries()).map(([name, tripCount]) => ({
    name,
    tripCount,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  return {
    title: `${decodedCity}行程 | Mibu`,
    description: `探索${decodedCity}的精選旅遊行程，發現最棒的一日遊規劃。`,
  };
}

export default async function CityTripsPage({ params }: Props) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  const trips = await getTripsByCity(decodedCity);
  const districts = groupTripsByDistrict(trips);

  return (
    <div className="flex flex-col">
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
            <Link href="/" className="hover:text-foreground">首頁</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/trips" className="hover:text-foreground">行程</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{decodedCity}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {decodedCity}行程
          </h1>
          <p className="text-muted-foreground">
            探索{decodedCity}的精選旅遊行程
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {districts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {districts.map((district) => (
                <Link
                  key={district.name}
                  href={`/trips/${encodeURIComponent(decodedCity)}/${encodeURIComponent(district.name)}`}
                  data-testid={`link-district-${district.name}`}
                >
                  <Card className="hover-elevate transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold">{district.name}</h2>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Route className="h-4 w-4" />
                        <span>{district.tripCount} 個行程</span>
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

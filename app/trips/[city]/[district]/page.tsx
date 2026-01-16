import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Route, ChevronRight } from "lucide-react";
import { API_URL } from "@/lib/config";

export const revalidate = 3600;

interface Trip {
  id: number;
  title: string;
  city: string;
  district: string;
  description: string;
  placeCount: number;
}

interface Props {
  params: Promise<{ city: string; district: string }>;
}

// 動態產生區域行程頁面的靜態參數
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const trips: Trip[] = Array.isArray(data) ? data : (data.trips || []);

    // 取得不重複的城市+區域組合
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
  } catch {
    return [];
  }
}

async function getTripsByCityAndDistrict(city: string, district: string): Promise<Trip[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/seo/trips?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.trips || []);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city, district } = await params;
  const decodedCity = decodeURIComponent(city);
  const decodedDistrict = decodeURIComponent(district);
  return {
    title: `${decodedCity}${decodedDistrict}行程 | Mibu`,
    description: `探索${decodedCity}${decodedDistrict}的精選旅遊行程，發現最棒的一日遊規劃。`,
  };
}

export default async function DistrictTripsPage({ params }: Props) {
  const { city, district } = await params;
  const decodedCity = decodeURIComponent(city);
  const decodedDistrict = decodeURIComponent(district);
  const trips = await getTripsByCityAndDistrict(decodedCity, decodedDistrict);

  return (
    <div className="flex flex-col">
      <section className="bg-primary/5 py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
            <Link href="/" className="hover:text-foreground">首頁</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/trips" className="hover:text-foreground">行程</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/trips/${encodeURIComponent(decodedCity)}`} className="hover:text-foreground">
              {decodedCity}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{decodedDistrict}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {decodedCity}{decodedDistrict}行程
          </h1>
          <p className="text-muted-foreground">
            探索{decodedDistrict}的精選旅遊行程
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          {trips.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trips.map((trip) => (
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

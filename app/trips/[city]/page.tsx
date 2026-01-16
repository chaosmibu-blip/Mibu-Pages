import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Route } from "lucide-react";
import { API_URL } from "@/lib/config";

// 使用新的 SEO 模組
import {
  generateCityTripsMetadata,
  cityTripsBreadcrumb,
  generateCityTripsJsonLd,
  SeoPageHeader,
  JsonLdScript,
  type Trip,
  type District,
} from "@/features/seo";

export const revalidate = 3600;

interface Props {
  params: Promise<{ city: string }>;
}

// 動態產生城市行程頁面的靜態參數
export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const trips: Trip[] = Array.isArray(data) ? data : (data.trips || []);

    // 取得不重複的城市列表
    const cities = [...new Set(trips.map((t) => t.city).filter(Boolean))];
    return cities.map((city) => ({ city: encodeURIComponent(city) }));
  } catch {
    return [];
  }
}

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
    // 跳過沒有 district 的行程
    if (!trip.district) return;
    districtMap.set(trip.district, (districtMap.get(trip.district) || 0) + 1);
  });
  return Array.from(districtMap.entries()).map(([name, tripCount]) => ({
    name,
    tripCount,
  }));
}

// ✅ 使用統一的 metadata 產生器
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  return generateCityTripsMetadata(decodedCity);
}

export default async function CityTripsPage({ params }: Props) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);
  const trips = await getTripsByCity(decodedCity);
  const districts = groupTripsByDistrict(trips);

  // ✅ 產生麵包屑和 JSON-LD
  const breadcrumbItems = cityTripsBreadcrumb(decodedCity);
  const jsonLd = generateCityTripsJsonLd(decodedCity, trips);

  return (
    <div className="flex flex-col">
      {/* ✅ JSON-LD 結構化資料 */}
      <JsonLdScript data={jsonLd} />

      {/* ✅ 使用統一的 SEO 頁面 Header */}
      <SeoPageHeader
        breadcrumbItems={breadcrumbItems}
        title={`${decodedCity}行程`}
        subtitle={`探索${decodedCity}的精選旅遊行程`}
      />

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

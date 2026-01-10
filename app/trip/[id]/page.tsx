import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Route, ChevronRight, Star, ArrowRight, ArrowDown, Download } from "lucide-react";

export const revalidate = 3600;

interface Place {
  id: number;
  name: string;
  slug: string;
  category: string;
  subcategory: string;
  address: string;
  description: string;
  rating: number;
  imageUrl: string;
  location: { lat: number; lng: number };
}

interface Trip {
  id: number;
  title: string;
  city: string;
  district: string;
  description: string;
  placeCount: number;
  publishedAt: string;
}

interface TripDetail {
  trip: Trip;
  places: Place[];
}

interface Props {
  params: Promise<{ id: string }>;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev";

async function getTripDetail(id: string): Promise<TripDetail | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips/${id}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function getRelatedTrips(city: string, district: string, currentId: string): Promise<Trip[]> {
  try {
    const res = await fetch(
      `${API_URL}/api/seo/trips?city=${encodeURIComponent(city)}&district=${encodeURIComponent(district)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const trips = Array.isArray(data) ? data : (data.trips || []);
    return trips.filter((t: Trip) => t.id.toString() !== currentId).slice(0, 3);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const data = await getTripDetail(id);
  if (!data) {
    return { title: "行程詳情 | Mibu" };
  }
  return {
    title: `${data.trip.title} | Mibu`,
    description: data.trip.description,
  };
}

function PlaceCard({ place, index }: { place: Place; index: number }) {
  return (
    <Card className="min-w-[280px] md:min-w-[300px] flex-shrink-0 overflow-hidden" data-testid={`card-place-${place.id}`}>
      <div className="aspect-[4/3] relative">
        {place.imageUrl ? (
          <Image
            src={place.imageUrl}
            alt={place.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className="bg-primary text-primary-foreground">{index + 1}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{place.name}</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Badge variant="outline" className="text-xs">{place.category}</Badge>
          {place.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
      </CardContent>
    </Card>
  );
}

export default async function TripDetailPage({ params }: Props) {
  const { id } = await params;
  const data = await getTripDetail(id);

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-2xl font-bold mb-4">找不到此行程</h1>
        <Link href="/trips">
          <Button>返回行程列表</Button>
        </Link>
      </div>
    );
  }

  const { trip, places } = data;
  const relatedTrips = await getRelatedTrips(trip.city, trip.district, id);

  return (
    <div className="flex flex-col">
      <section className="bg-primary/5 py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 flex-wrap">
            <Link href="/" className="hover:text-foreground">首頁</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/trips/${encodeURIComponent(trip.city)}`} className="hover:text-foreground">
              {trip.city}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/trips/${encodeURIComponent(trip.city)}/${encodeURIComponent(trip.district)}`}
              className="hover:text-foreground"
            >
              {trip.district}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">本行程</span>
          </nav>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {trip.title}
          </h1>
          <p className="text-muted-foreground">
            {trip.placeCount} 個景點
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold mb-2">行程簡介</h2>
            <p className="text-muted-foreground">{trip.description}</p>
          </div>

          <div className="hidden md:flex items-center gap-4 overflow-x-auto pb-4">
            {places.map((place, index) => (
              <PlaceCard key={place.id} place={place} index={index} />
            ))}
            <Link href="/" className="min-w-[200px] flex-shrink-0">
              <Card className="h-full hover-elevate transition-all">
                <CardContent className="h-full flex flex-col items-center justify-center p-6 text-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">下載查看更多</p>
                    <p className="text-sm text-muted-foreground">在 App 中探索完整行程</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {places.map((place, index) => (
              <PlaceCard key={place.id} place={place} index={index} />
            ))}
            <Link href="/" className="w-full">
              <Card className="hover-elevate transition-all">
                <CardContent className="flex items-center justify-center gap-3 p-6">
                  <ArrowDown className="h-5 w-5 text-primary" />
                  <span className="font-semibold">下載查看更多</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {relatedTrips.length > 0 && (
        <section className="py-8 md:py-12 bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-xl font-bold mb-6">相關行程推薦</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedTrips.map((relatedTrip) => (
                <Link
                  key={relatedTrip.id}
                  href={`/trip/${relatedTrip.id}`}
                  data-testid={`link-related-${relatedTrip.id}`}
                >
                  <Card className="hover-elevate transition-all">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{relatedTrip.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedTrip.description}
                      </p>
                      <Badge variant="secondary">
                        <Route className="h-3 w-3 mr-1" />
                        {relatedTrip.placeCount} 個景點
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

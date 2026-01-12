import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { MapPin, Star, Clock, Phone, Globe, ArrowLeft, ExternalLink } from "lucide-react";
import { API_URL } from "@/lib/config";

interface PlaceData {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  description: string;
  address: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  rating: number;
  reviewCount: number;
  coverImage: string;
  citySlug: string;
  cityName: string;
}

async function getPlace(id: string): Promise<PlaceData | null> {
  try {
    const res = await fetch(`${API_URL}/api/seo/places/${id}`, {
      next: { revalidate: 3600 },
    });
    
    if (!res.ok) {
      return null;
    }
    
    return res.json();
  } catch (error) {
    const mockPlaces: Record<string, PlaceData> = {
      "taipei-101": {
        id: "taipei-101",
        name: "台北101",
        nameEn: "Taipei 101",
        category: "地標",
        description: "台北101是台灣最具代表性的地標建築，曾為世界最高建築。觀景台可俯瞰整個台北盆地，夜景尤其壯觀。",
        address: "台北市信義區信義路五段7號",
        phone: "+886-2-8101-8800",
        website: "https://www.taipei-101.com.tw",
        openingHours: "週日至週四 11:00-21:00，週五至週六 11:00-22:00",
        rating: 4.5,
        reviewCount: 1200,
        coverImage: "",
        citySlug: "taipei",
        cityName: "台北",
      },
      "sensoji": {
        id: "sensoji",
        name: "淺草寺",
        nameEn: "Sensoji Temple",
        category: "寺廟",
        description: "淺草寺是東京最古老的寺廟，建於628年。雷門大燈籠是東京最具代表性的景點之一。",
        address: "東京都台東區淺草2-3-1",
        phone: "+81-3-3842-0181",
        website: "https://www.senso-ji.jp",
        openingHours: "全天開放，本堂 06:00-17:00",
        rating: 4.6,
        reviewCount: 2100,
        coverImage: "",
        citySlug: "tokyo",
        cityName: "東京",
      },
    };
    
    return mockPlaces[id] || null;
  }
}

export async function generateStaticParams() {
  const ids = ["taipei-101", "shilin-night-market", "national-palace-museum", "sensoji", "shibuya-crossing", "meiji-shrine"];
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const place = await getPlace(id);
  
  if (!place) {
    return {
      title: "景點不存在 | Mibu 旅遊扭蛋",
    };
  }

  return {
    title: `${place.name} - ${place.cityName}景點 | Mibu 旅遊扭蛋`,
    description: place.description,
    openGraph: {
      title: `${place.name} - ${place.cityName}景點`,
      description: place.description,
      images: [{ url: "https://mibu-travel.com/icon.jpg" }],
    },
  };
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = await getPlace(id);

  if (!place) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: place.name,
    description: place.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: place.address,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: place.rating,
      reviewCount: place.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col">
        <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-4 text-sm">
              <Link href="/explore" className="text-muted-foreground hover:text-primary">
                探索城市
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link href={`/city/${place.citySlug}`} className="text-muted-foreground hover:text-primary">
                {place.cityName}
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{place.name}</span>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">{place.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {place.name}
                </h1>
                <p className="text-muted-foreground mb-4">{place.nameEn}</p>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{place.rating}</span>
                    <span className="text-muted-foreground">({place.reviewCount} 則評論)</span>
                  </div>
                </div>
                
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
                  
                  {place.openingHours && (
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="text-sm">{place.openingHours}</span>
                    </div>
                  )}
                  
                  {place.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <a href={`tel:${place.phone}`} className="text-sm text-primary hover:underline">
                        {place.phone}
                      </a>
                    </div>
                  )}
                  
                  {place.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <a
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        官方網站
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
    </>
  );
}

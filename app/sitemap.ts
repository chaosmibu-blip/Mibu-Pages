import { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://591965a7-25f6-479c-b527-3890b1193c21-00-1m08cwv9a4rev.picard.replit.dev";

interface City {
  slug: string;
}

interface Place {
  id: string;
}

interface Trip {
  id: number;
  city: string;
  district: string;
}

const FALLBACK_CITIES: City[] = [
  { slug: "taipei" },
  { slug: "tokyo" },
  { slug: "osaka" },
  { slug: "kyoto" },
  { slug: "seoul" },
  { slug: "bangkok" },
];

async function getCities(): Promise<City[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/cities`);
    if (!res.ok) return FALLBACK_CITIES;
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.cities)) {
      return data.cities;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return FALLBACK_CITIES;
  } catch {
    return FALLBACK_CITIES;
  }
}

const FALLBACK_PLACES: Place[] = [
  { id: "taipei-101" },
  { id: "shilin-night-market" },
  { id: "national-palace-museum" },
  { id: "sensoji" },
  { id: "shibuya-crossing" },
  { id: "meiji-shrine" },
];

async function getPlaces(): Promise<Place[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/places`);
    if (!res.ok) return FALLBACK_PLACES;
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.places)) {
      return data.places;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    return FALLBACK_PLACES;
  } catch {
    return FALLBACK_PLACES;
  }
}

async function getTrips(): Promise<Trip[]> {
  try {
    const res = await fetch(`${API_URL}/api/seo/trips`);
    if (!res.ok) return [];
    const data = await res.json();
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.trips)) {
      return data.trips;
    }
    return [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mibu-travel.com";
  
  const cities = await getCities();
  const places = await getPlaces();
  const trips = await getTrips();

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/trips`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/for-business`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/for-business/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];

  const cityPages = cities.map((city) => ({
    url: `${baseUrl}/city/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const placePages = places.map((place) => ({
    url: `${baseUrl}/place/${place.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const tripCities = [...new Set(trips.map((t) => t.city))];
  const tripCityPages = tripCities.map((city) => ({
    url: `${baseUrl}/trips/${encodeURIComponent(city)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const tripCityDistricts = [...new Set(trips.map((t) => `${t.city}|${t.district}`))];
  const tripDistrictPages = tripCityDistricts.map((key) => {
    const [city, district] = key.split("|");
    return {
      url: `${baseUrl}/trips/${encodeURIComponent(city)}/${encodeURIComponent(district)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  const tripPages = trips.map((trip) => ({
    url: `${baseUrl}/trip/${trip.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...cityPages, ...placePages, ...tripCityPages, ...tripDistrictPages, ...tripPages];
}

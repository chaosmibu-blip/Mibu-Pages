"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EVENT_TYPE_CONFIG } from "../types";
import type { Event } from "../types";

interface NationwideEventsCarouselProps {
  events: Event[];
}

const ITEMS_PER_PAGE = 5;

function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { month: "numeric", day: "numeric" };

  if (!endDate) return start.toLocaleDateString("zh-TW", opts);

  const end = new Date(endDate);
  return `${start.toLocaleDateString("zh-TW", opts)} - ${end.toLocaleDateString("zh-TW", opts)}`;
}

export function NationwideEventsCarousel({ events }: NationwideEventsCarouselProps) {
  const [activeCity, setActiveCity] = useState<string>("全部");
  const [currentPage, setCurrentPage] = useState(0);

  const typeConfig = EVENT_TYPE_CONFIG.nationwide;

  // 從活動資料中提取城市列表
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    events.forEach((e) => {
      if (e.city) citySet.add(e.city);
    });
    return ["全部", ...Array.from(citySet).sort()];
  }, [events]);

  // 依城市篩選
  const filtered = useMemo(() => {
    if (activeCity === "全部") return events;
    return events.filter((e) => e.city === activeCity);
  }, [events, activeCity]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const pageEvents = filtered.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  // 切換城市時重置頁碼
  const handleCityChange = (city: string) => {
    setActiveCity(city);
    setCurrentPage(0);
  };

  if (events.length === 0) return null;

  return (
    <div className="mb-6">
      {/* 標題列 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">全台活動</h3>
          <Badge className={`${typeConfig.bgColor} ${typeConfig.color} text-xs`}>
            {filtered.length} 場進行中
          </Badge>
        </div>

        {/* 分頁控制 */}
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-full"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 rounded-full"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* 城市篩選 tabs */}
      {cities.length > 1 && (
        <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-hide">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityChange(city)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeCity === city
                  ? "bg-green-600 text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* 活動列表 */}
      <div className="rounded-xl border bg-card divide-y">
        {pageEvents.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            目前沒有活動
          </div>
        ) : (
          pageEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors group first:rounded-t-xl last:rounded-b-xl"
            >
              <div className="flex-1 min-w-0 mr-3">
                <h4 className="font-medium text-sm text-foreground group-hover:text-green-600 transition-colors line-clamp-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                  {event.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {event.city}
                    </span>
                  )}
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                詳情
                <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

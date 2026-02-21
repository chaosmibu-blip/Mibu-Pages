"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EVENT_TYPE_CONFIG } from "../types";
import type { Event } from "../types";

interface NationwideEventsCarouselProps {
  events: Event[];
}

function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };

  if (!endDate) return start.toLocaleDateString("zh-TW", opts);

  const end = new Date(endDate);
  return `${start.toLocaleDateString("zh-TW", opts)} - ${end.toLocaleDateString("zh-TW", opts)}`;
}

export function NationwideEventsCarousel({ events }: NationwideEventsCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setCurrentIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // 自動輪播：每 5 秒滑一次
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);

    return () => {
      clearInterval(interval);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (events.length === 0) return null;

  const typeConfig = EVENT_TYPE_CONFIG.nationwide;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-green-600" />
        <h3 className="text-lg font-semibold text-foreground">全台活動</h3>
        <Badge className={`${typeConfig.bgColor} ${typeConfig.color} text-xs`}>
          {events.length} 場進行中
        </Badge>
      </div>

      <div className="relative group">
        {/* Carousel */}
        <div ref={emblaRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {events.map((event) => {
              const href = event.linkUrl || `/events/${event.id}`;
              return (
                <div
                  key={event.id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4 first:pl-0"
                >
                  <Link href={href} className="block h-full">
                    <Card className="group/card cursor-pointer transition-all hover:shadow-lg h-full overflow-hidden border-green-200/50">
                      {/* 活動圖片 */}
                      <div className="relative aspect-[16/9] bg-gradient-to-br from-green-50 to-green-100">
                        {event.imageUrl ? (
                          <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="h-10 w-10 text-green-300" />
                          </div>
                        )}
                        {/* 類型標籤 */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-green-600 text-white text-xs shadow-md">
                            全台活動
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <h4 className="font-semibold text-foreground group-hover/card:text-green-600 transition-colors line-clamp-1 mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateRange(event.startDate, event.endDate)}
                          </span>
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            查看詳情
                            <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* 左右箭頭 */}
        {events.length > 1 && (
          <>
            <Button
              size="icon"
              variant="outline"
              className="absolute -left-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity bg-background hidden md:flex"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity bg-background hidden md:flex"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* 指示點 */}
        {events.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {events.map((_, idx) => (
              <button
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex
                    ? "w-6 bg-green-600"
                    : "w-1.5 bg-green-300 hover:bg-green-400"
                }`}
                onClick={() => emblaApi?.scrollTo(idx)}
                aria-label={`前往第 ${idx + 1} 張`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
  const totalSnaps = emblaApi?.scrollSnapList().length ?? events.length;

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
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold text-foreground">全台活動</h3>
          <Badge className={`${typeConfig.bgColor} ${typeConfig.color} text-xs`}>
            {events.length} 場進行中
          </Badge>
        </div>

        {/* 右側箭頭控制 + 頁碼 */}
        {events.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground tabular-nums">
              {currentIndex + 1} / {totalSnaps}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Carousel */}
      <div ref={emblaRef} className="overflow-hidden rounded-xl">
        <div className="flex -ml-4">
          {events.map((event) => {
            const href = `/events/${event.id}`;
            return (
              <div
                key={event.id}
                className="flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4"
              >
                <Link href={href} className="block h-full">
                  <Card className="group/card cursor-pointer transition-all hover:shadow-lg h-full overflow-hidden border-green-200/50">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-green-50 to-green-100">
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
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-green-600 text-white text-xs shadow-md">
                          全台活動
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <h4 className="font-semibold text-foreground group-hover/card:text-green-600 transition-colors line-clamp-2 mb-2 leading-snug">
                        {event.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDateRange(event.startDate, event.endDate)}
                        </span>
                        <span className="flex items-center gap-1 text-green-600 font-medium group-hover/card:translate-x-0.5 transition-transform">
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
    </div>
  );
}

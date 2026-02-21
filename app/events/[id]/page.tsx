import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ExternalLink, ChevronRight } from "lucide-react";
import { getEventDetail } from "@/features/events/api";
import { EVENT_TYPE_CONFIG } from "@/features/events/types";
import type { EventDetail } from "@/features/events/types";

export const revalidate = 3600;

interface Props {
  params: Promise<{ id: string }>;
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const startStr = start.toLocaleDateString("zh-TW", formatOptions);

  if (!endDate) {
    return startStr;
  }

  const end = new Date(endDate);
  const endStr = end.toLocaleDateString("zh-TW", formatOptions);
  return `${startStr} ~ ${endStr}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventDetail(id);

  if (!event) {
    return { title: "活動詳情 | Mibu" };
  }

  return {
    title: `${event.title} | Mibu`,
    description: event.content?.slice(0, 160) || "全台觀光活動資訊",
    openGraph: {
      title: event.title,
      description: event.content?.slice(0, 160) || "全台觀光活動資訊",
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await getEventDetail(id);

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <h1 className="text-2xl font-bold mb-4">找不到此活動</h1>
        <Link href="/">
          <Button>返回首頁</Button>
        </Link>
      </div>
    );
  }

  const typeConfig = EVENT_TYPE_CONFIG[event.type] || EVENT_TYPE_CONFIG.announcement;

  return (
    <div className="flex flex-col">
      {/* 活動圖片 */}
      <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-muted">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
            <Calendar className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
      </div>

      {/* 活動資訊 */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-6">
          {/* 麵包屑 */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link href="/" className="hover:text-foreground">首頁</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">活動詳情</span>
          </nav>

          {/* 類型標籤 */}
          <Badge className={`${typeConfig.bgColor} ${typeConfig.color} mb-4`}>
            {typeConfig.label}
          </Badge>

          {/* 標題 */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            {event.title}
          </h1>

          {/* 日期 */}
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <Calendar className="h-4 w-4" />
            <span>{formatDateRange(event.startDate, event.endDate)}</span>
          </div>

          {/* 地點 */}
          {(event.address || event.city) && (
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <MapPin className="h-4 w-4" />
              <span>
                {[event.city, event.address].filter(Boolean).join(" ")}
              </span>
            </div>
          )}

          {/* 分隔線 */}
          <hr className="my-6" />

          {/* 活動內容 */}
          <div className="prose prose-neutral max-w-none">
            <p className="text-foreground whitespace-pre-line leading-relaxed">
              {event.content}
            </p>
          </div>

          {/* 前往官方網站按鈕 */}
          {event.sourceUrl && (
            <div className="mt-8">
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  前往官方網站
                </Button>
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

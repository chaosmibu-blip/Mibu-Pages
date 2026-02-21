import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Calendar, ArrowRight, Megaphone, PartyPopper, Zap } from 'lucide-react';
import type { Event, EventType } from '../types';
import { EVENT_TYPE_CONFIG } from '../types';
import { NationwideEventsCarousel } from './NationwideEventsCarousel';

interface EventsSectionProps {
  events: Event[];
}

// 活動類型圖標
const EVENT_TYPE_ICONS: Record<EventType, typeof Bell> = {
  announcement: Megaphone,
  festival: PartyPopper,
  nationwide: PartyPopper,
  limited: Zap,
};

function formatDateRange(startDate: string, endDate?: string): string {
  const start = new Date(startDate);
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
  };

  if (!endDate) {
    return start.toLocaleDateString('zh-TW', formatOptions);
  }

  const end = new Date(endDate);
  return `${start.toLocaleDateString('zh-TW', formatOptions)} - ${end.toLocaleDateString('zh-TW', formatOptions)}`;
}

function EventCard({ event }: { event: Event }) {
  const typeConfig = EVENT_TYPE_CONFIG[event.type];
  const Icon = EVENT_TYPE_ICONS[event.type];

  const content = (
    <Card className="group cursor-pointer transition-all hover:shadow-md h-full">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${typeConfig.bgColor} shrink-0`}>
            <Icon className={`h-5 w-5 ${typeConfig.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className={`${typeConfig.bgColor} ${typeConfig.color} text-xs`}>
                {typeConfig.label}
              </Badge>
              {event.status === 'upcoming' && (
                <Badge variant="outline" className="text-xs">
                  即將開始
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateRange(event.startDate, event.endDate)}
              </span>
              {event.linkText && (
                <span className="flex items-center gap-1 text-primary font-medium">
                  {event.linkText}
                  <ArrowRight className="h-3 w-3" />
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 優先使用 linkUrl，沒有的話導向活動詳情頁
  const href = event.linkUrl || `/events/${event.id}`;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export function EventsSection({ events }: EventsSectionProps) {
  if (!events || events.length === 0) {
    return null;
  }

  // 分離全台活動和其他活動
  const nationwideEvents = events.filter((e) => e.type === 'nationwide');
  const otherEvents = events.filter((e) => e.type !== 'nationwide');

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">最新活動</h2>
          </div>
        </div>

        {/* 全台活動輪播 */}
        <NationwideEventsCarousel events={nationwideEvents} />

        {/* 其他活動卡片 */}
        {otherEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default EventsSection;

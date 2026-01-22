import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
// import { EventsSection, getActiveEvents } from "@/features/events";
import { MapPin, Gift, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Mibu - 旅遊扭蛋 | 用扭蛋探索世界",
  description: "用旅遊扭蛋的方式探索世界，發現隱藏的好去處。Mibu 讓每趟旅程都充滿驚喜！",
};

const features = [
  {
    icon: Gift,
    title: "扭蛋驚喜",
    description: "每次扭蛋都是全新的驚喜，讓你發現意想不到的好去處。",
  },
  {
    icon: MapPin,
    title: "在地推薦",
    description: "由當地人推薦的私房景點，體驗最道地的旅遊體驗。",
  },
  {
    icon: Compass,
    title: "探索未知",
    description: "突破旅遊舒適圈，讓扭蛋帶你去從未想過的地方。",
  },
];

export default async function HomePage() {
  // 暫時隱藏活動區塊
  // const events = await getActiveEvents(3);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            用扭蛋探索世界
            <br />
            <span className="text-primary">發現隱藏的好去處</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Mibu 讓每趟旅程都充滿驚喜！
            轉動扭蛋，讓命運決定你的下一個目的地。
          </p>
        </div>
      </section>

      {/* Events Section - 暫時隱藏 */}
      {/* <EventsSection events={events} /> */}

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            為什麼選擇 Mibu？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <AppDownloadCTA />
    </div>
  );
}

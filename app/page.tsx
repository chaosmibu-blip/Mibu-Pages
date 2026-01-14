import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { CatMascot } from "@/components/common/CatMascot";
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

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20">
        {/* 背景裝飾 - 浮動的小圖案 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-4xl opacity-20 mascot-float" style={{ animationDelay: '0s' }}>🎲</div>
          <div className="absolute top-20 right-20 text-3xl opacity-15 mascot-float" style={{ animationDelay: '1s' }}>✨</div>
          <div className="absolute bottom-20 left-1/4 text-2xl opacity-20 mascot-float" style={{ animationDelay: '0.5s' }}>🎁</div>
          <div className="absolute bottom-10 right-1/3 text-3xl opacity-15 mascot-float" style={{ animationDelay: '1.5s' }}>🗺️</div>
        </div>

        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* 左側文字區 */}
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                用扭蛋探索世界
                <br />
                <span className="text-primary">發現隱藏的好去處</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
                Mibu 讓每趟旅程都充滿驚喜！
                轉動扭蛋，讓命運決定你的下一個目的地。
              </p>
            </div>

            {/* 右側吉祥物 */}
            <div className="relative flex-shrink-0">
              <CatMascot
                variant="bouncing"
                size="xl"
                showSpeechBubble
                speechText="來扭蛋吧！🎲"
              />
              {/* 扭蛋機裝飾 */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-5xl mascot-wave">
                🎰
              </div>
            </div>
          </div>
        </div>
      </section>

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

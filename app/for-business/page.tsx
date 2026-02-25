import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { generateOrganizationJsonLd, JsonLdScript } from "@/features/seo";

export const metadata: Metadata = {
  title: "商家合作 | Mibu 旅遊扭蛋",
  description: "加入 Mibu 商家合作計畫，讓更多旅客發現您的店家。透過旅遊扭蛋獲得精準曝光。",
};

const benefits = [
  {
    icon: Users,
    title: "精準曝光",
    description: "觸及有興趣的旅客，提高轉換率",
  },
  {
    icon: TrendingUp,
    title: "數據分析",
    description: "了解您店家的曝光和互動數據",
  },
  {
    icon: Zap,
    title: "驚喜行銷",
    description: "透過扭蛋機制增加趣味性和記憶點",
  },
];

const features = [
  "在扭蛋結果中曝光您的店家",
  "客製化店家資訊和照片",
  "即時數據報表和分析",
  "優先客服支援",
  "行銷活動合作機會",
];

export default function ForBusinessPage() {
  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <div className="flex flex-col">
      <JsonLdScript data={orgJsonLd} />

      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            讓旅客在扭蛋中
            <br />
            <span className="text-primary">發現您的店家</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            加入 Mibu 商家合作計畫，透過獨特的旅遊扭蛋機制，
            讓您的店家被更多旅客發現。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/for-business/pricing">
              <Button size="lg" data-testid="button-view-pricing">
                查看訂閱方案
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/merchant/login">
              <Button size="lg" variant="outline" data-testid="button-merchant-login">
                商家登入
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            為什麼選擇 Mibu？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                合作內容
              </h2>
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>立即開始</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  只需三個簡單步驟，即可開始在 Mibu 上曝光您的店家：
                </p>
                <ol className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">1</span>
                    <span>下載 Mibu App 並申請商家帳號</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">2</span>
                    <span>選擇適合的訂閱方案</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium shrink-0">3</span>
                    <span>完善店家資訊，開始曝光</span>
                  </li>
                </ol>
                <Link href="/for-business/pricing" className="block">
                  <Button className="w-full" data-testid="button-start-now">
                    查看方案與價格
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

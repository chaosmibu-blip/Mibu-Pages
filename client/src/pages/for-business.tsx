import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSEO } from "@/hooks/use-seo";
import {
  Store,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "提升曝光率",
    description: "在 Mibu 旅遊扭蛋中獲得優先展示，吸引更多潛在顧客發現您的店家。",
  },
  {
    icon: Users,
    title: "精準觸及旅客",
    description: "接觸正在規劃旅程的活躍用戶，轉化率更高。",
  },
  {
    icon: BarChart3,
    title: "數據分析洞察",
    description: "掌握店家曝光、收藏、點擊等關鍵數據，優化行銷策略。",
  },
  {
    icon: Sparkles,
    title: "專屬優惠工具",
    description: "發放限時優惠券，刺激用戶到店消費，提升營業額。",
  },
];

const plans = [
  {
    tier: "free",
    name: "Free",
    price: "免費",
    features: ["基本店家資訊展示", "1 個景點刊登", "基礎數據報表"],
  },
  {
    tier: "pro",
    name: "Pro",
    price: "NT$299/月",
    features: [
      "優先曝光排序",
      "最多 5 個景點刊登",
      "進階數據分析",
      "每月 3 張優惠券",
    ],
    highlighted: true,
  },
  {
    tier: "premium",
    name: "Premium",
    price: "NT$799/月",
    features: [
      "最高優先曝光",
      "無限景點刊登",
      "完整數據分析",
      "無限優惠券",
      "專屬客服支援",
    ],
  },
];

export default function ForBusinessPage() {
  useSEO({
    title: "商家合作",
    description:
      "加入 Mibu 商家夥伴計劃，提升您的店家曝光率，吸引更多旅客。提供 Pro 和 Premium 訂閱方案。",
  });

  return (
    <Layout>
      <section className="bg-primary/5 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Store className="h-4 w-4" />
            商家夥伴計劃
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold text-foreground mb-6"
            data-testid="heading-for-business"
          >
            讓旅客發現您的好店
          </h1>
          <p
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
            data-testid="text-hero-description"
          >
            加入 Mibu 商家夥伴計劃，在旅遊扭蛋中獲得優先曝光，
            吸引正在探索旅程的活躍用戶。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/for-business/pricing">
              <Button size="lg" data-testid="button-view-plans">
                查看訂閱方案
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/support">
              <Button size="lg" variant="outline" data-testid="button-contact">
                聯繫我們
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground mb-4"
              data-testid="heading-benefits"
            >
              為什麼選擇 Mibu？
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              我們提供完整的商家行銷工具，幫助您在旅遊市場中脫穎而出。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-6 hover-elevate"
                data-testid={`card-benefit-${index}`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="text-2xl md:text-3xl font-bold text-foreground mb-4"
              data-testid="heading-plans-overview"
            >
              方案概覽
            </h2>
            <p className="text-muted-foreground">
              選擇適合您的方案，立即開始提升曝光。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <Card
                key={plan.tier}
                className={`p-6 hover-elevate ${
                  plan.highlighted
                    ? "ring-2 ring-primary bg-primary/5"
                    : ""
                }`}
                data-testid={`card-plan-${plan.tier}`}
              >
                {plan.highlighted && (
                  <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">
                    熱門選擇
                  </span>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-2xl font-bold text-primary mb-4">
                  {plan.price}
                </p>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/for-business/pricing">
              <Button size="lg" data-testid="button-see-full-plans">
                查看完整方案比較
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground mb-4"
            data-testid="heading-cta"
          >
            準備好加入了嗎？
          </h2>
          <p className="text-muted-foreground mb-8">
            立即註冊成為 Mibu 商家夥伴，開始吸引更多旅客。
            有任何問題歡迎聯繫我們的客服團隊。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/for-business/pricing">
              <Button size="lg" data-testid="button-start-now">
                立即開始
              </Button>
            </Link>
            <a href="mailto:chaosmibu@gmail.com">
              <Button size="lg" variant="outline" data-testid="button-email">
                chaosmibu@gmail.com
              </Button>
            </a>
          </div>
          <p className="text-muted-foreground mt-8">
            已經是商家？
            <Link
              href="/merchant/login"
              className="text-primary hover:underline ml-1"
              data-testid="link-merchant-login"
            >
              登入商家後台
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}

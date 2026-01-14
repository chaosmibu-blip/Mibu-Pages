"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type BillingInterval = "month" | "year";

interface PlanTier {
  id: string;
  name: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: { text: string; included: boolean }[];
  recommended?: boolean;
}

interface PlanCategory {
  id: string;
  name: string;
  description: string;
  tiers: PlanTier[];
}

const PLAN_CATEGORIES: PlanCategory[] = [
  {
    id: "merchant",
    name: "商家等級",
    description: "管理您的行程卡數量與數據分析權限",
    tiers: [
      {
        id: "merchant-free",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
          { text: "行程卡數量上限：1 張", included: true },
          { text: "數據分析", included: false },
          { text: "商品管理", included: true },
        ],
      },
      {
        id: "merchant-pro",
        name: "Pro",
        monthlyPrice: null,
        yearlyPrice: null,
        features: [
          { text: "行程卡數量上限：5 張", included: true },
          { text: "數據分析", included: true },
          { text: "商品管理", included: true },
        ],
        recommended: true,
      },
      {
        id: "merchant-premium",
        name: "Premium",
        monthlyPrice: null,
        yearlyPrice: null,
        features: [
          { text: "行程卡數量上限：20 張", included: true },
          { text: "數據分析", included: true },
          { text: "商品管理", included: true },
        ],
      },
    ],
  },
  {
    id: "tripcard",
    name: "行程卡等級",
    description: "提升行程卡的視覺效果與優惠券功能",
    tiers: [
      {
        id: "tripcard-free",
        name: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
          { text: "行程卡外框", included: false },
          { text: "抽中時載入特效", included: false },
          { text: "編輯優惠資訊", included: false },
          { text: "優惠券方案數：最多 1 種", included: true },
          { text: "可用優惠券等級：R", included: true },
          { text: "優惠券背景圖片", included: true },
          { text: "道具箱圖片", included: false },
        ],
      },
      {
        id: "tripcard-pro",
        name: "Pro",
        monthlyPrice: null,
        yearlyPrice: null,
        features: [
          { text: "行程卡外框", included: true },
          { text: "抽中時載入特效", included: false },
          { text: "編輯優惠資訊", included: true },
          { text: "優惠券方案數：最多 5 種", included: true },
          { text: "可用優惠券等級：R/S/SR/SSR", included: true },
          { text: "優惠券背景圖片", included: true },
          { text: "道具箱圖片", included: true },
        ],
        recommended: true,
      },
      {
        id: "tripcard-premium",
        name: "Premium",
        monthlyPrice: null,
        yearlyPrice: null,
        features: [
          { text: "行程卡外框", included: true },
          { text: "抽中時載入特效", included: true },
          { text: "編輯優惠資訊", included: true },
          { text: "優惠券方案數：最多 10 種", included: true },
          { text: "可用優惠券等級：R/S/SR/SSR/SP", included: true },
          { text: "優惠券背景圖片", included: true },
          { text: "道具箱圖片", included: true },
        ],
      },
    ],
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month");
  const [selectedCategory, setSelectedCategory] = useState<string>("merchant");

  const handleSelectPlan = (tierId: string) => {
    if (tierId.includes("free")) {
      return;
    }
    if (isLoggedIn) {
      router.push(`/merchant/subscribe?plan=${tierId}`);
    } else {
      router.push(`/merchant/login?redirect=${encodeURIComponent(`/merchant/subscribe?plan=${tierId}`)}`);
    }
  };

  const formatPrice = (price: number | null) => {
    if (price === null) {
      return "???";
    }
    if (price === 0) {
      return "免費";
    }
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPrice = (tier: PlanTier) => {
    return billingInterval === "month" ? tier.monthlyPrice : tier.yearlyPrice;
  };

  const currentCategory = PLAN_CATEGORIES.find((c) => c.id === selectedCategory) || PLAN_CATEGORIES[0];

  return (
    <div className="flex flex-col">
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            選擇適合的方案
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            根據您的需求選擇最適合的訂閱方案，開始讓更多旅客發現您的內容。
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              {PLAN_CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  data-testid={`tab-${category.id}`}
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-4 bg-muted p-1 rounded-lg">
                <Button
                  variant={billingInterval === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingInterval("month")}
                  data-testid="button-monthly"
                >
                  月繳
                </Button>
                <Button
                  variant={billingInterval === "year" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setBillingInterval("year")}
                  data-testid="button-yearly"
                >
                  年繳
                  <Badge variant="secondary" className="ml-2">省更多</Badge>
                </Button>
              </div>
            </div>

            {PLAN_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <p className="text-center text-muted-foreground mb-8">
                  {category.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {category.tiers.map((tier) => (
                    <Card
                      key={tier.id}
                      className={`relative transition-colors hover:border-primary ${tier.recommended ? "border-primary shadow-md" : ""}`}
                      data-testid={`card-plan-${tier.id}`}
                    >
                      {tier.recommended && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground">推薦</Badge>
                        </div>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle>{tier.name}</CardTitle>
                        <CardDescription>
                          <span className="text-3xl font-bold text-foreground">
                            {formatPrice(getPrice(tier))}
                          </span>
                          {getPrice(tier) !== 0 && (
                            <span className="text-muted-foreground">
                              /{billingInterval === "month" ? "月" : "年"}
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {tier.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              {feature.included ? (
                                <Check className="h-4 w-4 text-primary shrink-0" />
                              ) : (
                                <X className="h-4 w-4 text-muted-foreground shrink-0" />
                              )}
                              <span className={feature.included ? "" : "text-muted-foreground"}>
                                {feature.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {tier.id.includes("free") ? (
                          <Button
                            className="w-full"
                            variant="outline"
                            disabled
                            data-testid={`button-select-${tier.id}`}
                          >
                            目前方案
                          </Button>
                        ) : (
                          <Button
                            className="w-full"
                            variant={tier.recommended ? "default" : "outline"}
                            onClick={() => handleSelectPlan(tier.id)}
                            data-testid={`button-select-${tier.id}`}
                          >
                            選擇方案
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">優惠券等級說明</h2>
            </div>
            <p className="text-muted-foreground">
              不同等級的優惠券有不同的抽中機率與展示效果
            </p>
          </div>

          <div className="overflow-x-auto flex justify-center">
            <table className="text-sm md:w-auto w-full" data-testid="table-coupon-tiers">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">等級</th>
                  <th className="text-left py-3 px-4 font-semibold">機率</th>
                  <th className="text-left py-3 px-4 font-semibold">特效說明</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 font-bold text-yellow-600">SP</td>
                  <td className="py-3 px-4">2%</td>
                  <td className="py-3 px-4">全域跑馬燈、獎池中顯示、中獎動畫、背景圖片、道具箱圖片</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-bold text-purple-600">SSR</td>
                  <td className="py-3 px-4">8%</td>
                  <td className="py-3 px-4">獎池中顯示、中獎特效、背景圖片、道具箱圖片</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-bold text-blue-600">SR</td>
                  <td className="py-3 px-4">15%</td>
                  <td className="py-3 px-4">中獎特效、背景圖片、道具箱圖片</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-bold text-green-600">S</td>
                  <td className="py-3 px-4">23%</td>
                  <td className="py-3 px-4">背景圖片、道具箱圖片</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 font-bold text-gray-600">R</td>
                  <td className="py-3 px-4">32%</td>
                  <td className="py-3 px-4">背景圖片</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-muted-foreground mb-4">
            需要更多資訊？
          </p>
          <Link href="/support">
            <Button variant="outline">聯繫我們</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

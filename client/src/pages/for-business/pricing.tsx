import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, ArrowRight } from "lucide-react";
import { DownloadButton } from "@/components/common/DownloadButton";

type BillingInterval = "monthly" | "yearly";

interface SubscriptionPlan {
  id: string;
  tier: "free" | "pro" | "premium";
  title: string;
  priceMonthly: number;
  priceYearly: number | null;
  features: string[];
  buttonText: string;
  disabled: boolean;
  highlighted: boolean;
  highlightLabel: string | null;
}

export default function ForBusinessPricingPage() {
  useSEO({
    title: "商家訂閱方案",
    description:
      "選擇適合您的 Mibu 商家訂閱方案。提升曝光、吸引更多旅客。Free、Pro、Premium 三種方案任您選擇。",
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const { data: plans, isLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: () => fetch(`${API_URL}/api/subscription-plans`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });

  const { data: authStatus } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/merchant/verify"],
  });

  const isAuthenticated = authStatus?.authenticated === true;

  const handleSelectPlan = async (plan: SubscriptionPlan) => {
    if (plan.tier === "free") {
      return;
    }

    if (!isAuthenticated) {
      setLocation(`/merchant/login?redirect=/for-business/pricing`);
      return;
    }

    setCheckoutLoading(plan.tier);
    try {
      const res = await fetch("/api/merchant/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: plan.tier,
          interval: billingInterval,
          provider: "recur",
        }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "結帳失敗");
      }

      const recur = (window as any).RecurCheckout?.init({
        publishableKey: data.publishableKey,
      });

      if (recur) {
        await recur.redirectToCheckout({
          productId: data.productId,
          externalCustomerId: data.externalCustomerId,
          successUrl: data.successUrl,
          cancelUrl: data.cancelUrl,
        });
      } else {
        throw new Error("Recur SDK 未載入");
      }
    } catch (error) {
      toast({
        title: "結帳失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setCheckoutLoading(null);
    }
  };

  const getDisplayPrice = (plan: SubscriptionPlan) => {
    if (plan.tier === "free") return 0;
    if (billingInterval === "yearly" && plan.priceYearly) {
      return Math.round(plan.priceYearly / 12);
    }
    return plan.priceMonthly;
  };

  return (
    <Layout>
      <article className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        <header className="text-center mb-12">
          <div className="w-16 h-1 bg-primary mx-auto mb-6" />
          <h1
            className="text-3xl md:text-4xl font-bold text-foreground"
            data-testid="heading-pricing"
          >
            選擇適合您的方案
          </h1>
          <p
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
            data-testid="text-pricing-intro"
          >
            提升曝光、吸引更多旅客，選擇最適合您店家的訂閱方案
          </p>
        </header>

        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingInterval === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="button-monthly"
            >
              月付
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                billingInterval === "yearly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid="button-yearly"
            >
              年付
              <Badge variant="secondary" className="text-xs">
                省 20%
              </Badge>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 flex flex-col transition-transform duration-200 hover-elevate ${
                  plan.highlighted
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-105 relative z-10"
                    : ""
                }`}
                data-testid={`card-pricing-${plan.tier}`}
              >
                {plan.highlighted && plan.highlightLabel && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      {plan.highlightLabel}
                    </span>
                  </div>
                )}

                <h3
                  className={`text-2xl font-bold ${plan.highlighted ? "" : "text-foreground"}`}
                >
                  {plan.title}
                </h3>

                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    NT${getDisplayPrice(plan)}
                  </span>
                  <span
                    className={
                      plan.highlighted
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    }
                  >
                    {plan.tier === "free" ? " 永久免費" : "/月"}
                  </span>
                  {billingInterval === "yearly" && plan.priceYearly && (
                    <p
                      className={`text-sm mt-1 ${
                        plan.highlighted
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      年付 NT${plan.priceYearly.toLocaleString()}
                    </p>
                  )}
                </div>

                <ul className="mt-6 space-y-3 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.highlighted ? "text-primary-foreground" : "text-green-500"
                        }`}
                      />
                      <span className={plan.highlighted ? "" : "text-foreground"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {plan.tier === "free" ? (
                  <div className="mt-8 space-y-2">
                    <p
                      className={`text-sm text-center ${
                        plan.highlighted
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      下載 App 開始使用
                    </p>
                    <div className="flex gap-2">
                      <DownloadButton platform="ios" size="sm" className="flex-1" />
                      <DownloadButton platform="android" size="sm" className="flex-1" />
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={checkoutLoading === plan.tier}
                    variant={plan.highlighted ? "secondary" : "default"}
                    className={`w-full mt-8 ${
                      plan.highlighted ? "bg-white text-primary hover:bg-white/90" : ""
                    }`}
                    data-testid={`button-select-${plan.tier}`}
                  >
                    {checkoutLoading === plan.tier ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        處理中...
                      </>
                    ) : (
                      <>
                        {plan.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">目前沒有可用的訂閱方案。</p>
          </div>
        )}

        <div className="mt-16 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            所有方案均可隨時取消，無需綁約。
          </p>
          <p className="text-sm text-muted-foreground">
            已經是商家？
            <Link
              href="/merchant/login"
              className="text-primary hover:underline ml-1"
            >
              登入管理訂閱
            </Link>
          </p>
        </div>
      </article>
    </Layout>
  );
}

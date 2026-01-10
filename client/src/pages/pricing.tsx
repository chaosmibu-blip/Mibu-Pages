import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PricingCard } from "@/components/pricing/PricingCard";
import { PaymentMethodSelector } from "@/components/pricing/PaymentMethodSelector";
import { useSEO } from "@/hooks/use-seo";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type Tier = "pro" | "premium";

interface SubscriptionPlan {
  id: string;
  tier: string;
  title: string;
  priceMonthly: number;
  period: string;
  features: string[];
  buttonText: string;
  disabled: boolean;
  highlighted: boolean;
}

export default function PricingPage() {
  useSEO({
    title: "商家訂閱方案",
    description:
      "選擇適合您的 Mibu 商家訂閱方案。提升曝光、吸引更多旅客。Free、Pro、Premium 三種方案任您選擇。",
  });

  const { toast } = useToast();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "";
  
  const { data: plans, isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: () => fetch(`${API_URL}/api/subscription-plans`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSelectPlan = (tier: Tier) => {
    setSelectedTier(tier);
    setIsDialogOpen(true);
  };

  const handleConfirmPayment = async (provider: "stripe" | "recur") => {
    if (!selectedTier) return;

    setLoading(true);
    try {
      const res = await fetch("/api/merchant/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "merchant", tier: selectedTier, provider }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "結帳失敗");
      }

      if (provider === "stripe") {
        window.location.href = data.url;
      } else {
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
      }
    } catch (error) {
      toast({
        title: "結帳失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsDialogOpen(false);
    }
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
            商家訂閱方案
          </h1>
          <p
            className="text-muted-foreground mt-4 max-w-2xl mx-auto"
            data-testid="text-pricing-intro"
          >
            選擇適合您的方案，提升曝光、吸引更多旅客
          </p>
        </header>

        {plansLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : plans && plans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mt-12 items-start">
            {plans.map((plan) => (
              <PricingCard
                key={plan.id}
                title={plan.title}
                price={plan.priceMonthly}
                period={plan.period}
                features={plan.features}
                buttonText={plan.buttonText}
                disabled={plan.disabled}
                highlighted={plan.highlighted}
                onSelect={
                  !plan.disabled && (plan.tier === "pro" || plan.tier === "premium")
                    ? () => handleSelectPlan(plan.tier as Tier)
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">目前沒有可用的訂閱方案。</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            所有方案均可隨時取消，無需綁約。
          </p>
        </div>
      </article>

      {selectedTier && (
        <PaymentMethodSelector
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          tier={selectedTier}
          onConfirm={handleConfirmPayment}
          loading={loading}
        />
      )}
    </Layout>
  );
}

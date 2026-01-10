import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Check } from "lucide-react";
import { Link, useSearch } from "wouter";
import { useSEO } from "@/hooks/use-seo";

export default function SubscriptionSuccessPage() {
  useSEO({
    title: "訂閱成功",
    description: "您已成功升級 Mibu 商家訂閱方案。",
  });

  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tier = params.get("tier");

  const tierLabels: Record<string, string> = {
    pro: "Pro",
    premium: "Premium",
  };

  const tierFeatures: Record<string, string[]> = {
    pro: ["3 間店家名額", "20 張優惠券額度", "進階數據報表", "優先曝光"],
    premium: ["無限店家名額", "無限優惠券額度", "完整數據報表", "最高優先曝光", "專屬客服"],
  };

  const features = tier ? tierFeatures[tier] || [] : [];

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>

          <h1
            className="text-2xl font-bold mt-6 text-foreground"
            data-testid="heading-success"
          >
            訂閱成功！
          </h1>
          <p className="text-muted-foreground mt-2" data-testid="text-success-message">
            您已成功升級至 {tier ? tierLabels[tier] : ""} 方案
          </p>

          {features.length > 0 && (
            <div className="bg-muted/50 rounded-lg p-4 mt-6 text-left">
              <p className="text-sm text-muted-foreground mb-3">新權限已立即生效</p>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 space-y-3">
            <Link href="/">
              <Button className="w-full" data-testid="button-go-home">
                返回首頁
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="w-full" data-testid="button-view-plans">
                查看方案
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

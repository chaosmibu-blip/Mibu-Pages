import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface SubscriptionData {
  tier: "free" | "pro" | "premium";
  status: "active" | "expired" | "cancelled";
  currentPeriodEnd?: string;
  history?: {
    id: string;
    tier: string;
    status: string;
    createdAt: string;
  }[];
}

export default function SubscriptionManagePage() {
  useSEO({
    title: "訂閱管理",
    description: "管理您的 Mibu 商家訂閱方案。",
  });

  const { data, isLoading } = useQuery<SubscriptionData>({
    queryKey: ["/api/merchant/subscription"],
  });

  const tierLabels: Record<string, string> = {
    free: "Free",
    pro: "Pro",
    premium: "Premium",
  };

  const statusLabels: Record<string, string> = {
    active: "使用中",
    expired: "已過期",
    cancelled: "已取消",
  };

  return (
    <Layout>
      <article className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <header className="mb-8">
          <div className="w-16 h-1 bg-primary mb-6" />
          <h1
            className="text-3xl font-bold text-foreground"
            data-testid="heading-subscription"
          >
            訂閱管理
          </h1>
        </header>

        {isLoading ? (
          <Card className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </div>
          </Card>
        ) : (
          <>
            <Card className="p-6">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">目前方案</span>
                  <h2
                    className="text-xl font-bold mt-1 text-foreground"
                    data-testid="text-current-tier"
                  >
                    {tierLabels[data?.tier || "free"]}
                  </h2>
                </div>
                <Badge
                  variant={data?.status === "active" ? "default" : "secondary"}
                  data-testid="badge-status"
                >
                  {statusLabels[data?.status || "active"]}
                </Badge>
              </div>

              {data?.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground mt-4">
                  下次扣款日：
                  {format(new Date(data.currentPeriodEnd), "yyyy/MM/dd", {
                    locale: zhTW,
                  })}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-6">
                <Link href="/pricing">
                  <Button variant="outline" data-testid="button-change-plan">
                    變更方案
                  </Button>
                </Link>
                {data?.tier !== "free" && (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10"
                    data-testid="button-cancel-subscription"
                  >
                    取消訂閱
                  </Button>
                )}
              </div>
            </Card>

            {data?.history && data.history.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-foreground">訂閱歷史</h3>
                <div className="space-y-3">
                  {data.history.map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 flex flex-wrap justify-between items-center gap-2"
                    >
                      <div>
                        <span className="font-medium text-foreground">
                          {tierLabels[item.tier] || item.tier.toUpperCase()}
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          {format(new Date(item.createdAt), "yyyy/MM/dd")}
                        </span>
                      </div>
                      <span
                        className={`text-sm ${
                          item.status === "active"
                            ? "text-green-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {statusLabels[item.status] || item.status}
                      </span>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </article>
    </Layout>
  );
}

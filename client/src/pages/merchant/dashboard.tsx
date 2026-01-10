import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSEO } from "@/hooks/use-seo";
import { useQuery } from "@tanstack/react-query";
import { DownloadButton } from "@/components/common/DownloadButton";
import {
  Store,
  CreditCard,
  BarChart3,
  MapPin,
  Ticket,
  Settings,
  ArrowRight,
  TrendingUp,
  Eye,
  Heart,
  Loader2,
  Smartphone,
} from "lucide-react";

interface SubscriptionData {
  tier: "free" | "pro" | "premium";
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd?: boolean;
}

const tierLabels: Record<string, string> = {
  free: "免費方案",
  pro: "Pro 專業版",
  premium: "Premium 旗艦版",
};

const statusLabels: Record<string, string> = {
  active: "有效",
  cancelled: "已取消",
  past_due: "付款逾期",
  trialing: "試用中",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  past_due: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  trialing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

export default function MerchantDashboardPage() {
  useSEO({
    title: "商家後台",
    description: "管理您的 Mibu 商家帳戶、訂閱方案和店家資訊。",
  });

  const [, setLocation] = useLocation();

  const { data: authStatus, isLoading: authLoading } = useQuery<{ authenticated: boolean }>({
    queryKey: ["/api/merchant/verify"],
  });

  const { data: subscription, isLoading: subLoading } = useQuery<SubscriptionData>({
    queryKey: ["/api/merchant/subscription"],
    enabled: authStatus?.authenticated === true,
  });

  useEffect(() => {
    if (!authLoading && authStatus?.authenticated === false) {
      setLocation("/merchant/login?redirect=/merchant/dashboard");
    }
  }, [authStatus, authLoading, setLocation]);

  const mockStats = {
    views: 1234,
    saves: 89,
    clicks: 456,
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!authStatus?.authenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-foreground"
                data-testid="heading-dashboard"
              >
                商家後台
              </h1>
              <p className="text-muted-foreground">歡迎回來！</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card data-testid="card-stat-views">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">本月曝光</p>
                  <p className="text-3xl font-bold text-foreground">
                    {mockStats.views.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Eye className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+12% 較上月</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-saves">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">收藏次數</p>
                  <p className="text-3xl font-bold text-foreground">
                    {mockStats.saves.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-pink-600 dark:text-pink-300" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+8% 較上月</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-stat-clicks">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">點擊次數</p>
                  <p className="text-3xl font-bold text-foreground">
                    {mockStats.clicks.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+15% 較上月</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card data-testid="card-subscription">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                訂閱狀態
              </CardTitle>
              <CardDescription>您目前的訂閱方案</CardDescription>
            </CardHeader>
            <CardContent>
              {subLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-muted-foreground">當前方案</span>
                    <Badge variant="secondary" className="text-base">
                      {tierLabels[subscription?.tier || "free"]}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-muted-foreground">狀態</span>
                    <Badge
                      className={statusColors[subscription?.status || "active"]}
                    >
                      {statusLabels[subscription?.status || "active"]}
                    </Badge>
                  </div>
                  {subscription?.currentPeriodEnd && (
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-muted-foreground">到期日</span>
                      <span className="font-medium">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                  {subscription?.tier === "free" && (
                    <Link href="/for-business/pricing">
                      <Button className="w-full mt-4" data-testid="button-upgrade">
                        升級方案
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                快速操作
              </CardTitle>
              <CardDescription>常用功能入口</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  data-testid="button-manage-places"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  管理景點
                  <Badge variant="secondary" className="ml-auto">
                    {subscription?.tier === "free"
                      ? "1/1"
                      : subscription?.tier === "pro"
                      ? "2/5"
                      : "3/∞"}
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  data-testid="button-manage-coupons"
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  優惠券管理
                  {subscription?.tier === "free" && (
                    <Badge variant="secondary" className="ml-auto">
                      Pro 專屬
                    </Badge>
                  )}
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  data-testid="button-analytics"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  數據分析
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card data-testid="card-app-download">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Smartphone className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">使用 App 管理更多功能</h3>
                  <p className="text-sm text-muted-foreground">
                    商家認領、數據報表、優惠券發放等功能請使用 App
                  </p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <DownloadButton platform="ios" />
                <DownloadButton platform="android" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6" data-testid="card-help">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground">需要協助？</h3>
                <p className="text-sm text-muted-foreground">
                  如有任何問題，歡迎聯繫我們的客服團隊
                </p>
              </div>
              <a href="mailto:chaosmibu@gmail.com">
                <Button variant="outline" data-testid="button-contact-support">
                  聯繫客服
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

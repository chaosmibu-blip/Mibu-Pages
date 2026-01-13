"use client";

import { Suspense } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Ticket, Store, LogOut, ArrowRight, Smartphone, Info,
  Plus, BarChart3, Tag, ArrowUpRight
} from "lucide-react";
import { API_URL } from "@/lib/config";
import { MerchantNav } from "@/components/common/MerchantNav";

const tierQuotas: Record<string, { maxCoupons: number | null; description: string }> = {
  free: { maxCoupons: 5, description: "升級方案可解鎖更多優惠券額度" },
  basic: { maxCoupons: 10, description: "基礎方案提供 10 張優惠券額度" },
  pro: { maxCoupons: 20, description: "專業方案提供 20 張優惠券額度" },
  premium: { maxCoupons: null, description: "旗艦方案享有無限優惠券額度" },
  partner: { maxCoupons: null, description: "合作夥伴享有無限優惠券額度" },
};

function CouponsContent() {
  const { token, user, logout } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["merchant-coupons", token],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await fetch(`${API_URL}/api/merchant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!token,
  });

  const merchant = data?.merchant;
  const tier = merchant?.merchantLevel || "free";
  const quota = tierQuotas[tier] || tierQuotas.free;
  const usedCoupons = merchant?.usedCoupons || 0;
  const maxCoupons = merchant?.maxCoupons || quota.maxCoupons;
  const usagePercent = maxCoupons ? Math.min((usedCoupons / maxCoupons) * 100, 100) : 0;

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-muted/30 py-12 px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <MerchantNav />
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Ticket className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>優惠券管理</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground"
              >
                <LogOut className="h-4 w-4 mr-2" />
                登出
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">無法載入優惠券資訊</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  重新載入
                </Button>
              </div>
            ) : (
              <>
                {/* 額度使用情況 */}
                <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">優惠券額度</p>
                      <p className="text-2xl font-bold">
                        {usedCoupons} / {maxCoupons || "無限制"}
                      </p>
                    </div>
                    <Badge variant="secondary">{tier === "free" ? "免費方案" : tier.toUpperCase()}</Badge>
                  </div>
                  {maxCoupons && (
                    <div className="space-y-2">
                      <Progress value={usagePercent} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        已使用 {usagePercent.toFixed(0)}% 額度
                      </p>
                    </div>
                  )}
                </div>

                {/* 升級提示（免費或接近額度上限時顯示） */}
                {(tier === "free" || (maxCoupons && usagePercent >= 80)) && (
                  <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                    <div className="flex items-start gap-3">
                      <ArrowUpRight className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground">
                          {tier === "free" ? "升級解鎖更多額度" : "額度即將用完"}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {quota.description}
                        </p>
                        <Link href="/for-business/pricing" className="inline-block mt-3">
                          <Button size="sm">
                            查看方案
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* App 引導 */}
                <Alert>
                  <Smartphone className="h-4 w-4" />
                  <AlertTitle>在 App 中管理優惠券</AlertTitle>
                  <AlertDescription>
                    優惠券的建立、編輯、發放等操作請使用 Mibu App 完成。
                  </AlertDescription>
                </Alert>

                {/* 功能預覽 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">建立優惠券</p>
                    <p className="text-xs text-muted-foreground mt-1">在 App 中操作</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <Tag className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">發放優惠券</p>
                    <p className="text-xs text-muted-foreground mt-1">在 App 中操作</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg text-center">
                    <BarChart3 className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium">使用統計</p>
                    <p className="text-xs text-muted-foreground mt-1">在 App 中查看</p>
                  </div>
                </div>

                {/* 下載 App 按鈕 */}
                <div className="text-center pt-4">
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Smartphone className="h-4 w-4 mr-2" />
                    下載 Mibu App
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 返回連結 */}
        <div className="text-center">
          <Link href="/merchant/subscription" className="text-sm text-muted-foreground hover:text-foreground">
            <Store className="inline h-4 w-4 mr-1" />
            返回訂閱管理
          </Link>
        </div>
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <main className="min-h-[calc(100vh-12rem)] bg-muted/30 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function CouponsPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingState />}>
        <CouponsContent />
      </Suspense>
    </AuthGuard>
  );
}

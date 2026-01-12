"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Store, CreditCard, MapPin, Ticket, LogOut, ArrowRight, AlertTriangle, CheckCircle, PartyPopper } from "lucide-react";
import { RefundRequestDialog } from "@/components/common/RefundRequestDialog";
import { API_URL } from "@/lib/config";

const tierLabels: Record<string, { name: string; color: string }> = {
  free: { name: "免費方案", color: "bg-muted text-muted-foreground" },
  basic: { name: "基礎方案", color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  pro: { name: "專業方案", color: "bg-primary/10 text-primary" },
  premium: { name: "旗艦方案", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300" },
  partner: { name: "合作夥伴", color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
};

function SubscriptionContent() {
  const { token, user, logout } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // 檢查是否從結帳成功頁面跳轉過來
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessBanner(true);
      // 清除 URL 中的 success 參數，避免重新整理時再次顯示
      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["merchant-subscription", token],
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

  const cancelMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const res = await fetch(`${API_URL}/api/merchant/subscription/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ subscriptionId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant-subscription"] });
    },
  });

  const merchant = data?.merchant;
  const subscription = merchant?.subscription;
  const tierInfo = tierLabels[merchant?.merchantLevel] || tierLabels.free;
  const isPaidPlan = merchant?.merchantLevel && merchant.merchantLevel !== "free";

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-muted/30 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>我的訂閱</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                登出
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {showSuccessBanner && (
              <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                <PartyPopper className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700 dark:text-green-300">訂閱成功！</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  感謝您的訂閱，您的方案已啟用。如有任何問題，請聯繫客服。
                </AlertDescription>
              </Alert>
            )}

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">無法載入訂閱資訊</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  重新載入
                </Button>
              </div>
            ) : merchant ? (
              <>
                <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">目前方案</p>
                      <Badge className={tierInfo.color}>{tierInfo.name}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <CreditCard className="h-5 w-5" />
                    </div>
                  </div>
                  {merchant.merchantLevelExpiresAt && (
                    <p className="text-sm text-muted-foreground mt-3">
                      到期日：{new Date(merchant.merchantLevelExpiresAt).toLocaleDateString("zh-TW")}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <p className="text-sm">可管理店家數</p>
                    </div>
                    <p className="text-xl font-bold" data-testid="text-max-places">
                      {merchant.maxPlaces || "無限制"}
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Ticket className="h-4 w-4" />
                      <p className="text-sm">可發放優惠券數</p>
                    </div>
                    <p className="text-xl font-bold" data-testid="text-max-coupons">
                      {merchant.maxCoupons || "無限制"}
                    </p>
                  </div>
                </div>

                {(merchant.merchantLevel === "free" || !merchant.merchantLevel) && (
                  <Link href="/for-business/pricing" className="block">
                    <Button className="w-full" data-testid="button-upgrade">
                      升級方案
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}

                {isPaidPlan && (
                  <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      訂閱設定
                    </h4>
                    
                    {cancelMutation.data?.success && (
                      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 dark:text-green-300">
                          {cancelMutation.data.message || "訂閱已取消，將在當期結束後停止"}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    {cancelMutation.isError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          取消訂閱失敗，請稍後再試
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <RefundRequestDialog subscriptionId={subscription?.id} />
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (subscription?.id && confirm("確定要取消訂閱嗎？取消後服務將持續到當期結束。")) {
                            cancelMutation.mutate(subscription.id);
                          }
                        }}
                        disabled={cancelMutation.isPending}
                        data-testid="button-cancel-subscription"
                      >
                        {cancelMutation.isPending ? "處理中..." : "取消訂閱"}
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      取消後服務持續至當期結束。如需退款，請在首次付款後 7 天內申請。
                      <Link href="/refund" className="text-primary hover:underline ml-1">
                        查看退款政策
                      </Link>
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t text-center">
                  <p className="text-sm text-muted-foreground">
                    如需管理店家或優惠券，請使用 Mibu App
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                找不到商家資料
              </div>
            )}
          </CardContent>
        </Card>
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
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function SubscriptionPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingState />}>
        <SubscriptionContent />
      </Suspense>
    </AuthGuard>
  );
}

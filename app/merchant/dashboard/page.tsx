"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, Calendar, CreditCard, ExternalLink, LogOut } from "lucide-react";
import { API_URL } from "@/lib/config";

interface Subscription {
  plan: string;
  status: "active" | "expired" | "cancelled";
  expiresAt: string;
  price: number;
  interval: "month" | "year";
}

export default function MerchantDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/merchant/subscription`, {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/merchant/login");
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setSubscription(data);
        }
      } catch (error) {
        setSubscription({
          plan: "專業方案",
          status: "active",
          expiresAt: "2025-02-15",
          price: 799,
          interval: "month",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
    } finally {
      router.push("/merchant/login");
    }
  };

  const statusMap = {
    active: { label: "使用中", variant: "default" as const },
    expired: { label: "已過期", variant: "destructive" as const },
    cancelled: { label: "已取消", variant: "secondary" as const },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">商家後台</h1>
          <p className="text-muted-foreground">管理您的訂閱狀態</p>
        </div>
        <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
          <LogOut className="mr-2 h-4 w-4" />
          登出
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/10">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>訂閱狀態</CardTitle>
                <CardDescription>查看您目前的訂閱方案</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{subscription.plan}</span>
                  <Badge variant={statusMap[subscription.status].variant}>
                    {statusMap[subscription.status].label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    {formatPrice(subscription.price)}/{subscription.interval === "month" ? "月" : "年"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {subscription.status === "active" ? "下次續費：" : "已於 "}
                    {formatDate(subscription.expiresAt)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">尚未訂閱任何方案</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>管理與設定</CardTitle>
            <CardDescription>更多功能請使用 App</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              店家資訊編輯、數據報表、行銷活動等進階功能請使用 Mibu App。
            </p>
            <Button variant="outline" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              下載 Mibu App
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

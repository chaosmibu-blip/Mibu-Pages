"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, Globe, Calendar, CreditCard } from "lucide-react";
import { getMyContributions, type MyContributionsResponse } from "@/features/crowdfund";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function MyContributionsPage() {
  return (
    <AuthGuard>
      <MyContributionsContent />
    </AuthGuard>
  );
}

function MyContributionsContent() {
  const { user } = useAuth();
  const [data, setData] = useState<MyContributionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContributions() {
      try {
        setLoading(true);
        const result = await getMyContributions();
        setData(result);
      } catch (err) {
        setError("無法載入贊助紀錄");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchContributions();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error}</p>
          <Link href="/crowdfund">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回募資列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Back Link */}
      <div className="max-w-5xl mx-auto px-6 py-4 w-full">
        <Link
          href="/crowdfund"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          返回募資列表
        </Link>
      </div>

      {/* Header */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              我的贊助紀錄
            </h1>
          </div>
          <p className="text-muted-foreground">
            {user?.email} - 感謝您對 Mibu 的支持！
          </p>
        </div>
      </section>

      {/* Summary */}
      {data && (
        <section className="py-8">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">累計贊助金額</p>
                      <p className="text-2xl font-bold text-primary">
                        NT$ {data.summary.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">支持的國家</p>
                      <p className="text-2xl font-bold">
                        {data.summary.campaignsSupported} 個
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Contributions List */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-lg font-semibold mb-4">贊助明細</h2>

          {!data || data.contributions.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">您還沒有任何贊助紀錄</p>
                <Link href="/crowdfund">
                  <Button>瀏覽募資活動</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {data.contributions.map((contribution) => (
                <Card key={contribution.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">
                          {getFlagEmoji(contribution.campaign.countryCode)}
                        </span>
                        <div>
                          <Link
                            href={`/crowdfund/${contribution.campaign.id}`}
                            className="font-semibold hover:text-primary transition-colors"
                          >
                            {contribution.campaign.countryNameZh} 景點募資
                          </Link>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(contribution.createdAt).toLocaleDateString("zh-TW")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="outline">
                          {getStatusLabel(contribution.campaign.status)}
                        </Badge>
                        <span className="text-xl font-bold text-primary">
                          NT$ {contribution.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Skeleton className="h-8 w-32 mb-8" />
      <Skeleton className="h-10 w-64 mb-4" />
      <Skeleton className="h-6 w-48 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    </div>
  );
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    upcoming: "即將開始",
    active: "募資中",
    collecting: "募資中",
    completed: "已達標",
    launched: "已上線",
    failed: "未達標",
  };
  return labels[status] || status;
}

function getFlagEmoji(countryCode: string): string {
  const flags: Record<string, string> = {
    JP: "🇯🇵",
    KR: "🇰🇷",
    TH: "🇹🇭",
    TW: "🇹🇼",
    VN: "🇻🇳",
    SG: "🇸🇬",
    MY: "🇲🇾",
    ID: "🇮🇩",
    PH: "🇵🇭",
    US: "🇺🇸",
    GB: "🇬🇧",
    FR: "🇫🇷",
    DE: "🇩🇪",
    IT: "🇮🇹",
    ES: "🇪🇸",
    AU: "🇦🇺",
  };
  return flags[countryCode] || "🌍";
}

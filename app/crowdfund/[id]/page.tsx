"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Users,
  Target,
  Calendar,
  Trophy,
  Clock,
} from "lucide-react";
import {
  getCampaignDetail,
  createCrowdfundCheckout,
  type CampaignDetailResponse,
  type CrowdfundCampaign,
} from "@/features/crowdfund";
import { useAuth } from "@/hooks/useAuth";

const PRESET_AMOUNTS = [100, 300, 500, 1000];

export default function CrowdfundDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user } = useAuth();
  const campaignId = params.id as string;

  const [data, setData] = useState<CampaignDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [amount, setAmount] = useState<number>(300);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        setLoading(true);
        const result = await getCampaignDetail(campaignId);
        setData(result);
      } catch (err) {
        setError("無法載入募資活動資訊");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setAmount(parsed);
    }
  };

  const handleCheckout = async () => {
    if (!data) return;

    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    if (isNaN(finalAmount) || finalAmount < 50) {
      alert("最低贊助金額為 NT$ 50");
      return;
    }

    if (!token && !email) {
      alert("請輸入 Email 以接收贊助確認信");
      return;
    }

    try {
      setCheckoutLoading(true);
      const result = await createCrowdfundCheckout({
        campaignId: data.campaign.id,
        amount: finalAmount,
        email: token ? undefined : email,
        name: name || undefined,
        successUrl: `${window.location.origin}/crowdfund/${campaignId}?success=true`,
        cancelUrl: `${window.location.origin}/crowdfund/${campaignId}`,
      });

      // 跳轉到 Stripe Checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("建立結帳失敗，請稍後再試");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{error || "找不到此募資活動"}</p>
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

  const { campaign, recentContributors, topContributors } = data;
  const isActive = campaign.status === "active" || campaign.status === "collecting";
  const statusBadge = getStatusBadge(campaign.status);

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

      {/* Hero Section */}
      <section className="py-8 md:py-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Campaign Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{getFlagEmoji(campaign.countryCode)}</span>
                <div>
                  <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {campaign.countryNameZh} 景點募資
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {campaign.countryNameEn} - 預計收錄 {campaign.estimatedPlaces} 個景點
              </p>

              {/* Progress */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-2xl font-bold text-primary">
                      NT$ {campaign.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      / NT$ {campaign.goalAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={campaign.progressPercent} className="h-3" />
                </div>

                <div className="flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span>{campaign.progressPercent}% 達成</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{campaign.contributorCount} 人贊助</span>
                  </div>
                  {campaign.endDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>截止：{new Date(campaign.endDate).toLocaleDateString("zh-TW")}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Checkout Card */}
            {isActive && (
              <Card className="w-full md:w-96 shrink-0">
                <CardHeader>
                  <CardTitle className="text-lg">立即贊助</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Amount Selection */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">選擇金額</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_AMOUNTS.map((preset) => (
                        <Button
                          key={preset}
                          variant={amount === preset && !customAmount ? "default" : "outline"}
                          onClick={() => handleAmountSelect(preset)}
                          className="w-full"
                        >
                          NT$ {preset}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">自訂金額</label>
                    <Input
                      type="number"
                      placeholder="輸入金額（最低 50）"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      min={50}
                    />
                  </div>

                  {/* Guest Fields */}
                  {!token && (
                    <>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Email <span className="text-destructive">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          用於接收贊助確認信
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          顯示名稱（選填）
                        </label>
                        <Input
                          type="text"
                          placeholder="您的名稱"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {token && user && (
                    <p className="text-sm text-muted-foreground">
                      以 {user.email} 身份贊助
                    </p>
                  )}

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? "處理中..." : `贊助 NT$ ${customAmount || amount}`}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    使用 Stripe 安全付款
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Contributors */}
            {topContributors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    贊助排行榜
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topContributors.slice(0, 10).map((contributor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-center font-bold text-muted-foreground">
                            {index + 1}
                          </span>
                          <span>{contributor.name}</span>
                        </div>
                        <span className="font-medium text-primary">
                          NT$ {contributor.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Contributors */}
            {recentContributors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    最近贊助
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentContributors.slice(0, 10).map((contributor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <span className="font-medium">{contributor.name}</span>
                          <p className="text-xs text-muted-foreground">
                            {new Date(contributor.createdAt).toLocaleDateString("zh-TW")}
                          </p>
                        </div>
                        <span className="font-medium text-primary">
                          NT$ {contributor.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <Skeleton className="h-8 w-32 mb-8" />
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-16 w-16" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="w-full md:w-96 h-96" />
      </div>
    </div>
  );
}

function getStatusBadge(status: CrowdfundCampaign["status"]) {
  const config = {
    upcoming: { label: "即將開始", variant: "secondary" as const },
    active: { label: "募資中", variant: "default" as const },
    collecting: { label: "募資中", variant: "default" as const },
    completed: { label: "已達標", variant: "outline" as const },
    launched: { label: "已上線", variant: "secondary" as const },
    failed: { label: "未達標", variant: "destructive" as const },
  };
  return config[status] || { label: status, variant: "secondary" as const };
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

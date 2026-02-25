import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AppDownloadCTA } from "@/components/common/AppDownloadCTA";
import { Globe, Users, Target, TrendingUp } from "lucide-react";
import { API_URL } from "@/lib/config";
import type { CrowdfundCampaign, CampaignsResponse } from "@/features/crowdfund";
import { Breadcrumb } from "@/features/seo";

export const metadata: Metadata = {
  title: "募資活動 | Mibu 旅遊扭蛋",
  description: "支持 Mibu 開拓新國家景點資料！贊助募資活動，一起讓旅遊扭蛋覆蓋更多目的地。",
};

const FALLBACK_CAMPAIGNS: CrowdfundCampaign[] = [
  {
    id: 1,
    countryCode: "JP",
    countryNameZh: "日本",
    countryNameEn: "Japan",
    goalAmount: 100000,
    currentAmount: 75000,
    contributorCount: 150,
    progressPercent: 75,
    estimatedPlaces: 500,
    status: "active",
    startDate: "2026-01-01",
    endDate: "2026-03-31",
  },
  {
    id: 2,
    countryCode: "KR",
    countryNameZh: "韓國",
    countryNameEn: "South Korea",
    goalAmount: 80000,
    currentAmount: 45000,
    contributorCount: 89,
    progressPercent: 56,
    estimatedPlaces: 400,
    status: "active",
    startDate: "2026-01-15",
    endDate: "2026-04-15",
  },
  {
    id: 3,
    countryCode: "TH",
    countryNameZh: "泰國",
    countryNameEn: "Thailand",
    goalAmount: 60000,
    currentAmount: 60000,
    contributorCount: 120,
    progressPercent: 100,
    estimatedPlaces: 300,
    status: "completed",
    startDate: "2025-10-01",
    endDate: "2025-12-31",
    launchedAt: "2026-01-10",
  },
];

async function getCampaigns(): Promise<CrowdfundCampaign[]> {
  try {
    const res = await fetch(`${API_URL}/api/crowdfund/campaigns`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return FALLBACK_CAMPAIGNS;
    }

    const data: CampaignsResponse = await res.json();
    return data.campaigns || FALLBACK_CAMPAIGNS;
  } catch {
    return FALLBACK_CAMPAIGNS;
  }
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

function formatAmount(amount: number): string {
  return `NT$ ${amount.toLocaleString()}`;
}

export default async function CrowdfundPage() {
  const campaigns = await getCampaigns();

  const activeCampaigns = campaigns.filter(
    (c) => c.status === "active" || c.status === "collecting"
  );
  const completedCampaigns = campaigns.filter(
    (c) => c.status === "completed" || c.status === "launched"
  );
  const upcomingCampaigns = campaigns.filter((c) => c.status === "upcoming");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Breadcrumb
            items={[
              { label: "首頁", href: "/" },
              { label: "募資活動" },
            ]}
            className="justify-center mb-4"
          />
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-4">
            <Target className="h-4 w-4" />
            群眾募資
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            一起開拓新國家
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            支持 Mibu 收集更多國家的景點資料！
            您的贊助將幫助我們建立完整的旅遊資料庫，讓扭蛋體驗更加豐富。
          </p>
        </div>
      </section>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">進行中的募資</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Campaigns */}
      {upcomingCampaigns.length > 0 && (
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">即將開始</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Completed Campaigns */}
      {completedCampaigns.length > 0 && (
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">已完成的募資</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </div>
        </section>
      )}

      <AppDownloadCTA />
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: CrowdfundCampaign }) {
  const statusBadge = getStatusBadge(campaign.status);
  const isActive = campaign.status === "active" || campaign.status === "collecting";

  return (
    <Link href={`/crowdfund/${campaign.id}`}>
      <Card className="group cursor-pointer transition-all hover:shadow-md overflow-hidden h-full">
        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center relative">
          <span className="text-4xl">{getFlagEmoji(campaign.countryCode)}</span>
          <Badge className="absolute top-3 right-3" variant={statusBadge.variant}>
            {statusBadge.label}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {campaign.countryNameZh}
            </h3>
            <p className="text-sm text-muted-foreground">{campaign.countryNameEn}</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">募資進度</span>
                <span className="font-medium">{campaign.progressPercent}%</span>
              </div>
              <Progress value={campaign.progressPercent} className="h-2" />
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">已募集</span>
              <span className="font-medium text-primary">
                {formatAmount(campaign.currentAmount)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">目標金額</span>
              <span>{formatAmount(campaign.goalAmount)}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{campaign.contributorCount} 人贊助</span>
              </div>
              <div>預計收錄 {campaign.estimatedPlaces} 景點</div>
            </div>

            {isActive && (
              <div className="pt-2">
                <span className="text-sm text-primary font-medium">
                  立即贊助 →
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
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

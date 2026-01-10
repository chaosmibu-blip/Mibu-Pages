"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Check, ArrowLeft, Info, Store, Map, Loader2, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRecur } from "recur-tw";
import Link from "next/link";

interface PlanConfig {
  name: string;
  categoryName: string;
  categoryIcon: typeof Store;
  features: string[];
  type: "merchant" | "place";
  tier: "pro" | "premium";
}

const PLAN_INFO: Record<string, PlanConfig> = {
  "merchant-pro": {
    name: "進階商家",
    categoryName: "商家等級",
    categoryIcon: Store,
    features: ["優先曝光權重", "即時數據報表", "優先客服支援", "行銷活動合作資格"],
    type: "merchant",
    tier: "pro",
  },
  "merchant-premium": {
    name: "企業商家",
    categoryName: "商家等級",
    categoryIcon: Store,
    features: ["最高曝光權重", "多店家管理", "進階數據分析", "專屬客戶經理", "客製化行銷方案"],
    type: "merchant",
    tier: "premium",
  },
  "tripcard-pro": {
    name: "進階創作者",
    categoryName: "行程卡等級",
    categoryIcon: Map,
    features: ["優先推薦權重", "行程分析報表", "專屬創作者頁面", "粉絲互動功能"],
    type: "place",
    tier: "pro",
  },
  "tripcard-premium": {
    name: "專業創作者",
    categoryName: "行程卡等級",
    categoryIcon: Map,
    features: ["最高推薦權重", "品牌合作機會", "進階分析工具", "專屬客戶經理", "收益分潤計畫"],
    type: "place",
    tier: "premium",
  },
};

function SubscribeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const { checkout, isCheckingOut } = useRecur();
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<"recur" | "stripe">("recur");

  const planId = searchParams.get("plan") || "";
  const planInfo = PLAN_INFO[planId];
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleCheckout = async () => {
    if (!planInfo) return;
    
    setIsLoading(true);
    try {
      const successUrl = `${window.location.origin}/merchant/subscription?success=true`;
      const cancelUrl = `${window.location.origin}/merchant/subscribe?plan=${planId}&cancelled=true`;

      const res = await fetch(`${API_URL}/api/merchant/subscription/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type: planInfo.type,
          tier: planInfo.tier,
          provider,
          successUrl,
          cancelUrl,
        }),
        credentials: "include",
      });

      const data = await res.json();
      console.log("Checkout response:", { status: res.status, data });

      if (!res.ok) {
        throw new Error(data.message || data.error || `結帳失敗 (${res.status})`);
      }

      if (provider === "recur") {
        const customerEmail = user?.email || "test@example.com";
        const customerName = "Customer";
        
        console.log("Recur checkout params:", {
          planId: data.productId,
          customerEmail,
          customerName,
        });
        
        await checkout({
          planId: data.productId,
          customerEmail,
          customerName,
          onPaymentComplete: (subscription: any) => {
            console.log("訂閱成功:", subscription);
            toast({
              title: "訂閱成功",
              description: "感謝您的訂閱！",
            });
            router.push("/merchant/subscription?success=true");
          },
          onError: (error: any) => {
            console.error("訂閱失敗:", error.message);
            toast({
              title: "結帳失敗",
              description: error.message || "請稍後再試",
              variant: "destructive",
            });
          },
        });
      } else {
        const checkoutUrl = data.url || data.checkoutUrl;
        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          throw new Error("無法取得 Stripe 付款連結");
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "結帳失敗",
        description: error instanceof Error ? error.message : "請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isProcessing = isLoading || isCheckingOut;

  if (!planInfo) {
    return (
      <main className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-12 px-6">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>找不到方案</CardTitle>
            <CardDescription>請返回選擇一個有效的訂閱方案</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link href="/for-business/pricing">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回方案頁面
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const IconComponent = planInfo.categoryIcon;

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-muted/30 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link href="/for-business/pricing" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回方案頁面
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>確認訂閱</CardTitle>
                <CardDescription>請確認您的訂閱方案並選擇付款方式</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{planInfo.categoryName}</span>
              </div>
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-semibold text-lg">{planInfo.name}</h3>
                  <Badge variant="secondary">{planInfo.tier === "pro" ? "Pro" : "Premium"}</Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">方案內容</h4>
              <ul className="space-y-2">
                {planInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">訂閱帳號</p>
              <p className="font-medium" data-testid="text-user-email">{user?.email}</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">選擇付款方式</h4>
              <RadioGroup value={provider} onValueChange={(v) => setProvider(v as "recur" | "stripe")} className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                    provider === "recur" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  data-testid="option-recur"
                >
                  <RadioGroupItem value="recur" id="recur" />
                  <div className="flex-1">
                    <Label htmlFor="recur" className="font-semibold cursor-pointer">台灣本地支付</Label>
                    <p className="text-sm text-muted-foreground">信用卡、ATM 轉帳</p>
                  </div>
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </label>

                <label
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
                    provider === "stripe" ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  data-testid="option-stripe"
                >
                  <RadioGroupItem value="stripe" id="stripe" />
                  <div className="flex-1">
                    <Label htmlFor="stripe" className="font-semibold cursor-pointer">國際信用卡</Label>
                    <p className="text-sm text-muted-foreground">Visa, Mastercard, AMEX</p>
                  </div>
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </label>
              </RadioGroup>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>付款說明</AlertTitle>
              <AlertDescription>
                點擊下方按鈕後，將開啟安全的付款頁面完成訂閱。訂閱成功後會自動跳轉至訂閱管理頁面。
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full" 
              size="lg" 
              data-testid="button-checkout"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="mr-2 h-4 w-4" />
              )}
              {isProcessing ? "處理中..." : "前往付款"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              訂閱即表示您同意我們的{" "}
              <Link href="/terms" className="text-primary hover:underline">服務條款</Link>
              {" "}和{" "}
              <Link href="/privacy" className="text-primary hover:underline">隱私權政策</Link>
            </p>
          </CardFooter>
        </Card>
        <div id="recur-payment-container" />
      </div>
    </main>
  );
}

function LoadingState() {
  return (
    <main className="min-h-[calc(100vh-12rem)] bg-muted/30 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-6 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function SubscribePage() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingState />}>
        <SubscribeContent />
      </Suspense>
    </AuthGuard>
  );
}

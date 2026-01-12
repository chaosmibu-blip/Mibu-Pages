"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen, Store, CreditCard, Ticket, Smartphone, CheckCircle2,
  ArrowRight, PlayCircle, HelpCircle, ExternalLink, Sparkles,
  BarChart3, Users, Gift, ChevronRight
} from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  icon: typeof Store;
  link?: string;
  linkText?: string;
  appOnly?: boolean;
}

const onboardingSteps: Step[] = [
  {
    id: "register",
    title: "註冊商家帳號",
    description: "在 Mibu App 中申請商家帳號，完成身份驗證即可開始使用。",
    icon: Users,
    appOnly: true,
  },
  {
    id: "profile",
    title: "完善店家資訊",
    description: "填寫店家名稱、地址、營業時間等基本資訊，讓顧客更容易找到你。",
    icon: Store,
    appOnly: true,
  },
  {
    id: "subscribe",
    title: "選擇訂閱方案",
    description: "根據業務需求選擇合適的方案，解鎖進階功能和更高曝光。",
    icon: CreditCard,
    link: "/for-business/pricing",
    linkText: "查看方案",
  },
  {
    id: "coupons",
    title: "建立優惠券",
    description: "設計專屬優惠券吸引顧客，提升來客數和回訪率。",
    icon: Ticket,
    link: "/merchant/coupons",
    linkText: "管理優惠券",
  },
  {
    id: "analytics",
    title: "追蹤成效",
    description: "透過數據報表了解顧客行為，持續優化行銷策略。",
    icon: BarChart3,
    appOnly: true,
  },
];

const features = [
  {
    title: "優先曝光",
    description: "讓你的店家在搜尋結果中優先顯示",
    icon: Sparkles,
    tier: "pro",
  },
  {
    title: "數據報表",
    description: "深入分析顧客行為和優惠券使用情況",
    icon: BarChart3,
    tier: "pro",
  },
  {
    title: "多店管理",
    description: "一個帳號管理多間分店",
    icon: Store,
    tier: "premium",
  },
  {
    title: "專屬客服",
    description: "獲得專屬客戶經理的支援",
    icon: Users,
    tier: "premium",
  },
];

const faqs = [
  {
    question: "商家帳號需要審核嗎？",
    answer: "是的，為確保平台品質，我們會審核商家申請。通常在 1-3 個工作天內完成。",
  },
  {
    question: "可以先試用再訂閱嗎？",
    answer: "免費方案包含基礎功能，您可以先體驗再決定是否升級。",
  },
  {
    question: "訂閱可以隨時取消嗎？",
    answer: "可以。取消後服務會持續到當期結束，不會立即中斷。",
  },
  {
    question: "優惠券有數量限制嗎？",
    answer: "免費方案最多 5 張，Pro 方案 20 張，Premium 方案無限制。",
  },
];

export default function GuidePage() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const toggleStep = (stepId: string) => {
    setCompletedSteps(prev =>
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  return (
    <main className="min-h-[calc(100vh-12rem)] bg-muted/30 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">商家新手教學</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            歡迎加入 Mibu！這份指南將幫助您快速上手，開始經營您的商家帳號。
          </p>
        </div>

        <Tabs defaultValue="steps" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="steps">快速入門</TabsTrigger>
            <TabsTrigger value="features">功能介紹</TabsTrigger>
            <TabsTrigger value="faq">常見問題</TabsTrigger>
          </TabsList>

          {/* 快速入門 */}
          <TabsContent value="steps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  入門步驟
                </CardTitle>
                <CardDescription>
                  按照以下步驟完成設定，開始使用 Mibu 商家服務
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {onboardingSteps.map((step, index) => {
                  const isCompleted = completedSteps.includes(step.id);
                  const StepIcon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        isCompleted
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                            isCompleted
                              ? "bg-green-500 text-white"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{step.title}</h3>
                            {step.appOnly && (
                              <Badge variant="outline" className="text-xs">
                                <Smartphone className="h-3 w-3 mr-1" />
                                App
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {step.description}
                          </p>
                          {step.link && (
                            <Link href={step.link}>
                              <Button size="sm" variant="outline">
                                {step.linkText}
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          )}
                        </div>
                        <StepIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* 進度提示 */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">完成進度</p>
                      <p className="text-sm text-muted-foreground">
                        {completedSteps.length} / {onboardingSteps.length} 步驟已完成
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setCompletedSteps([])}>
                    重置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 功能介紹 */}
          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  進階功能
                </CardTitle>
                <CardDescription>
                  升級訂閱方案解鎖更多強大功能
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <div
                        key={feature.title}
                        className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-background rounded-lg">
                            <FeatureIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{feature.title}</h4>
                              <Badge
                                variant="secondary"
                                className={
                                  feature.tier === "premium"
                                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-primary/10 text-primary"
                                }
                              >
                                {feature.tier === "premium" ? "Premium" : "Pro"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {feature.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Link href="/for-business/pricing">
                <Button>
                  查看所有方案
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </TabsContent>

          {/* 常見問題 */}
          <TabsContent value="faq" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  常見問題
                </CardTitle>
                <CardDescription>
                  新手商家最常詢問的問題
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="cursor-pointer p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors font-medium">
                      {faq.question}
                    </summary>
                    <p className="mt-2 p-4 text-muted-foreground">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="text-center">
                  <HelpCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <h3 className="font-medium mb-2">還有其他問題？</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    歡迎聯繫我們的客服團隊，我們很樂意為您解答
                  </p>
                  <Link href="/support">
                    <Button variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      聯繫客服
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 底部導航 */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Link href="/merchant/subscription">
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              我的訂閱
            </Button>
          </Link>
          <Link href="/merchant/coupons">
            <Button variant="outline">
              <Ticket className="h-4 w-4 mr-2" />
              優惠券管理
            </Button>
          </Link>
          <Link href="/for-business">
            <Button variant="outline">
              <Store className="h-4 w-4 mr-2" />
              商家合作
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

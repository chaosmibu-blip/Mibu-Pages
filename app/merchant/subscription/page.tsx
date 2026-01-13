'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Store,
  CreditCard,
  MapPin,
  Ticket,
  LogOut,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  PartyPopper,
  ExternalLink,
  HelpCircle,
  CalendarDays,
  ArrowUpRight,
  RefreshCw,
  Clock,
  History,
} from 'lucide-react';
import { RefundRequestDialog } from '@/components/common/RefundRequestDialog';
import { MerchantNav } from '@/components/common/MerchantNav';
import { API_URL } from '@/lib/config';
import { merchantApi, type SubscriptionHistory } from '@/services/api/merchant';

const tierLabels: Record<string, { name: string; color: string; description: string }> = {
  free: {
    name: '免費方案',
    color: 'bg-muted text-muted-foreground',
    description: '基礎功能，適合新手試用',
  },
  basic: {
    name: '基礎方案',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    description: '小型商家適用',
  },
  pro: {
    name: '專業方案',
    color: 'bg-primary/10 text-primary',
    description: '進階功能，優先曝光',
  },
  premium: {
    name: '旗艦方案',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    description: '完整功能，專屬客服',
  },
  partner: {
    name: '合作夥伴',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    description: '策略合作夥伴專屬',
  },
};

const statusLabels: Record<string, { name: string; color: string; icon: typeof CheckCircle }> = {
  active: {
    name: '使用中',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    icon: CheckCircle,
  },
  cancelled: {
    name: '已取消',
    color: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    icon: Clock,
  },
  past_due: {
    name: '付款逾期',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    icon: AlertTriangle,
  },
  trialing: {
    name: '試用中',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    icon: RefreshCw,
  },
};

function SubscriptionContent() {
  const { token, user, logout } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // 檢查是否從結帳成功頁面跳轉過來
  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowSuccessBanner(true);
      // 清除 URL 中的 success 參數
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url.pathname);
    }
  }, [searchParams]);

  // 取得商家資料
  const { data, isLoading, error } = useQuery({
    queryKey: ['merchant-subscription', token],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      const res = await fetch(`${API_URL}/api/merchant`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: !!token,
  });

  // 取得訂閱歷史
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: ['subscription-history', token],
    queryFn: () => merchantApi.getSubscriptionHistory(),
    enabled: !!token && showHistory,
  });

  // 取消訂閱
  const cancelMutation = useMutation({
    mutationFn: async (subscriptionId: number) => {
      const res = await fetch(`${API_URL}/api/merchant/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ subscriptionId }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-subscription'] });
    },
  });

  const merchant = data?.merchant;
  const subscription = merchant?.subscription;
  const tierInfo = tierLabels[merchant?.merchantLevel] || tierLabels.free;
  const isPaidPlan = merchant?.merchantLevel && merchant.merchantLevel !== 'free';
  const history = historyData?.history || [];

  const actionLabels: Record<string, string> = {
    created: '訂閱建立',
    renewed: '續訂',
    cancelled: '取消訂閱',
    refunded: '退款',
    upgraded: '升級方案',
    downgraded: '降級方案',
  };

  return (
    <main className="space-y-6">
      {/* 手機版導航 */}
      <div className="lg:hidden">
        <MerchantNav />
      </div>

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
              <AlertTitle className="text-green-700 dark:text-green-300">
                訂閱成功！
              </AlertTitle>
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
              {/* 方案資訊卡片 */}
              <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">目前方案</p>
                    <div className="flex items-center gap-2">
                      <Badge className={tierInfo.color}>{tierInfo.name}</Badge>
                      {subscription?.status && statusLabels[subscription.status] && (
                        <Badge className={statusLabels[subscription.status].color}>
                          {statusLabels[subscription.status].name}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{tierInfo.description}</p>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                </div>

                {/* 日期資訊 */}
                {(merchant.merchantLevelExpiresAt || subscription?.currentPeriodEnd) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {subscription?.status === 'cancelled' ? '服務至：' : '下次續訂：'}
                      {new Date(
                        merchant.merchantLevelExpiresAt || subscription?.currentPeriodEnd
                      ).toLocaleDateString('zh-TW', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* 配額資訊 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4" />
                    <p className="text-sm">可管理店家數</p>
                  </div>
                  <p className="text-xl font-bold" data-testid="text-max-places">
                    {merchant.maxPlaces || '無限制'}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <Ticket className="h-4 w-4" />
                    <p className="text-sm">可發放優惠券數</p>
                  </div>
                  <p className="text-xl font-bold" data-testid="text-max-coupons">
                    {merchant.maxCoupons || '無限制'}
                  </p>
                </div>
              </div>

              {/* 免費方案升級提示 */}
              {(merchant.merchantLevel === 'free' || !merchant.merchantLevel) && (
                <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex items-start gap-3">
                    <ArrowUpRight className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">升級解鎖更多功能</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        升級至專業方案，獲得優先曝光、進階報表等功能
                      </p>
                      <Link href="/for-business/pricing" className="inline-block mt-3">
                        <Button data-testid="button-upgrade">
                          查看方案
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 付費方案管理區塊 */}
              {isPaidPlan && (
                <div className="space-y-4">
                  {/* 快捷操作 */}
                  <div className="flex flex-wrap gap-3">
                    <Link href="/for-business/pricing">
                      <Button variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        變更方案
                      </Button>
                    </Link>
                    {subscription?.billingPortalUrl && (
                      <Button
                        variant="outline"
                        onClick={() => window.open(subscription.billingPortalUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        管理帳單
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setShowHistory(!showHistory)}
                    >
                      <History className="h-4 w-4 mr-2" />
                      {showHistory ? '隱藏紀錄' : '訂閱紀錄'}
                    </Button>
                  </div>

                  {/* 訂閱歷史 */}
                  {showHistory && (
                    <div className="p-4 border rounded-lg space-y-3">
                      <h4 className="font-medium text-foreground flex items-center gap-2">
                        <History className="h-4 w-4" />
                        訂閱紀錄
                      </h4>
                      {isHistoryLoading ? (
                        <div className="space-y-2">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : history.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                          暫無訂閱紀錄
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {history.map((item: SubscriptionHistory) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm"
                            >
                              <div>
                                <span className="font-medium">
                                  {actionLabels[item.action] || item.action}
                                </span>
                                <span className="text-muted-foreground ml-2">
                                  {item.tier.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-muted-foreground">
                                  {new Date(item.createdAt).toLocaleDateString('zh-TW')}
                                </span>
                                {item.amount > 0 && (
                                  <span className="ml-2 font-medium">
                                    NT$ {item.amount.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 訂閱設定 */}
                  <div className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      訂閱設定
                    </h4>

                    {cancelMutation.data?.success && (
                      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-700 dark:text-green-300">
                          {cancelMutation.data.message || '訂閱已取消，將在當期結束後停止'}
                        </AlertDescription>
                      </Alert>
                    )}

                    {cancelMutation.isError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>取消訂閱失敗，請稍後再試</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <RefundRequestDialog subscriptionId={subscription?.id} />

                      <Button
                        variant="outline"
                        onClick={() => {
                          if (
                            subscription?.id &&
                            confirm('確定要取消訂閱嗎？取消後服務將持續到當期結束。')
                          ) {
                            cancelMutation.mutate(subscription.id);
                          }
                        }}
                        disabled={cancelMutation.isPending || subscription?.status === 'cancelled'}
                        data-testid="button-cancel-subscription"
                      >
                        {cancelMutation.isPending ? '處理中...' : '取消訂閱'}
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      取消後服務持續至當期結束。如需退款，請在首次付款後 7 天內申請。
                      <Link href="/refund" className="text-primary hover:underline ml-1">
                        查看退款政策
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* 常見問題 */}
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  <h4 className="font-medium text-foreground">常見問題</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <details className="group">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                      如何變更付款方式？
                    </summary>
                    <p className="mt-2 text-muted-foreground pl-4">
                      請點擊「管理帳單」進入帳單管理頁面，即可更新信用卡或付款資訊。
                    </p>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                      取消訂閱後會怎樣？
                    </summary>
                    <p className="mt-2 text-muted-foreground pl-4">
                      取消訂閱後，您的服務會持續到當期結束。之後帳號會降級為免費方案。
                    </p>
                  </details>
                  <details className="group">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                      可以申請退款嗎？
                    </summary>
                    <p className="mt-2 text-muted-foreground pl-4">
                      首次訂閱後 7 天內可申請全額退款。詳情請參閱
                      <Link href="/refund" className="text-primary hover:underline ml-1">
                        退款政策
                      </Link>
                      。
                    </p>
                  </details>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">找不到商家資料</div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="space-y-6">
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

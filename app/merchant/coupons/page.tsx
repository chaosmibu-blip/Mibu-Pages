'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import {
  merchantApi,
  type Coupon,
  type CreateCouponRequest,
} from '@/services/api/merchant';
import { CouponCard } from '@/components/merchant/CouponCard';
import { CouponForm } from '@/components/merchant/CouponForm';
import { MerchantNav } from '@/components/common/MerchantNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, Plus, ArrowUpRight, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '@/lib/config';

const tierQuotas: Record<string, { maxCoupons: number | null; description: string }> = {
  free: { maxCoupons: 5, description: '升級方案可解鎖更多優惠券額度' },
  basic: { maxCoupons: 10, description: '基礎方案提供 10 張優惠券額度' },
  pro: { maxCoupons: 20, description: '專業方案提供 20 張優惠券額度' },
  premium: { maxCoupons: null, description: '旗艦方案享有無限優惠券額度' },
  partner: { maxCoupons: null, description: '合作夥伴享有無限優惠券額度' },
};

function CouponsContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  // 取得商家資料
  const { data: merchantData, isLoading: isMerchantLoading } = useQuery({
    queryKey: ['merchant-info', token],
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

  const merchant = merchantData?.merchant;
  const merchantId = merchant?.id;

  // 取得已認領的景點（用於優惠券指定景點）
  const { data: placesData } = useQuery({
    queryKey: ['merchantPlaces', token],
    queryFn: () => merchantApi.getPlaces(),
    enabled: !!token,
  });

  // 取得優惠券列表
  const {
    data: couponsData,
    isLoading: isCouponsLoading,
    error: couponsError,
  } = useQuery({
    queryKey: ['merchantCoupons', merchantId],
    queryFn: () => merchantApi.getCoupons(merchantId!),
    enabled: !!merchantId,
  });

  // 建立優惠券
  const createMutation = useMutation({
    mutationFn: (data: CreateCouponRequest) => merchantApi.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCoupons'] });
      queryClient.invalidateQueries({ queryKey: ['merchant-info'] });
      setShowForm(false);
    },
  });

  // 更新優惠券
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateCouponRequest> }) =>
      merchantApi.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCoupons'] });
      setEditingCoupon(null);
    },
  });

  // 刪除優惠券
  const deleteMutation = useMutation({
    mutationFn: (id: number) => merchantApi.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCoupons'] });
      queryClient.invalidateQueries({ queryKey: ['merchant-info'] });
    },
  });

  // 切換優惠券狀態
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      merchantApi.toggleCoupon(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantCoupons'] });
    },
  });

  const tier = merchant?.merchantLevel || 'free';
  const quota = tierQuotas[tier] || tierQuotas.free;
  const coupons = couponsData?.coupons || [];
  const maxCoupons = merchant?.maxCoupons || quota.maxCoupons;
  const usedCoupons = coupons.length;
  const usagePercent = maxCoupons ? Math.min((usedCoupons / maxCoupons) * 100, 100) : 0;

  const canAddMore = !maxCoupons || usedCoupons < maxCoupons;

  // 分類優惠券
  const now = new Date();
  const activeCoupons = coupons.filter((c) => {
    const validUntil = new Date(c.validUntil);
    return c.isActive && validUntil >= now && (!c.usageLimit || c.usedCount < c.usageLimit);
  });
  const expiredCoupons = coupons.filter((c) => {
    const validUntil = new Date(c.validUntil);
    return validUntil < now || (c.usageLimit && c.usedCount >= c.usageLimit);
  });
  const inactiveCoupons = coupons.filter((c) => {
    const validUntil = new Date(c.validUntil);
    return !c.isActive && validUntil >= now;
  });

  const handleCreate = async (data: CreateCouponRequest) => {
    await createMutation.mutateAsync(data);
  };

  const handleUpdate = async (data: CreateCouponRequest) => {
    if (editingCoupon) {
      await updateMutation.mutateAsync({ id: editingCoupon.id, data });
    }
  };

  const handleDelete = (coupon: Coupon) => {
    if (confirm(`確定要刪除「${coupon.title}」嗎？此操作無法復原。`)) {
      deleteMutation.mutate(coupon.id);
    }
  };

  const handleToggle = (coupon: Coupon, isActive: boolean) => {
    toggleMutation.mutate({ id: coupon.id, isActive });
  };

  const isLoading = isMerchantLoading || isCouponsLoading;
  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending ||
    toggleMutation.isPending;

  const renderCouponList = (list: Coupon[]) => {
    if (list.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          沒有優惠券
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {list.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onEdit={() => setEditingCoupon(coupon)}
            onDelete={() => handleDelete(coupon)}
            onToggle={(isActive) => handleToggle(coupon, isActive)}
            isLoading={isMutating}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="space-y-6">
      {/* 手機版導航 */}
      <div className="lg:hidden">
        <MerchantNav />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>優惠券管理</CardTitle>
                <CardDescription>建立與管理您的優惠券</CardDescription>
              </div>
            </div>
            <Button onClick={() => setShowForm(true)} disabled={!canAddMore}>
              <Plus className="h-4 w-4 mr-2" />
              建立優惠券
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : couponsError ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">無法載入優惠券資料</p>
              <Button
                variant="outline"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['merchantCoupons'] })}
              >
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
                      {usedCoupons} / {maxCoupons || '無限制'}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {tier === 'free' ? '免費方案' : tier.toUpperCase()}
                  </Badge>
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

              {/* 升級提示 */}
              {(tier === 'free' || (maxCoupons && usagePercent >= 80)) && (
                <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                  <div className="flex items-start gap-3">
                    <ArrowUpRight className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {tier === 'free' ? '升級解鎖更多額度' : '額度即將用完'}
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

              {/* 優惠券列表 */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="active">
                    使用中 ({activeCoupons.length})
                  </TabsTrigger>
                  <TabsTrigger value="inactive">
                    已停用 ({inactiveCoupons.length})
                  </TabsTrigger>
                  <TabsTrigger value="expired">
                    已過期 ({expiredCoupons.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-4">
                  {activeCoupons.length === 0 ? (
                    <div className="text-center py-12">
                      <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium text-foreground mb-2">
                        還沒有使用中的優惠券
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        建立優惠券吸引更多顧客
                      </p>
                      <Button onClick={() => setShowForm(true)} disabled={!canAddMore}>
                        <Plus className="h-4 w-4 mr-2" />
                        建立第一張優惠券
                      </Button>
                    </div>
                  ) : (
                    renderCouponList(activeCoupons)
                  )}
                </TabsContent>

                <TabsContent value="inactive" className="mt-4">
                  {renderCouponList(inactiveCoupons)}
                </TabsContent>

                <TabsContent value="expired" className="mt-4">
                  {renderCouponList(expiredCoupons)}
                </TabsContent>
              </Tabs>
            </>
          )}
        </CardContent>
      </Card>

      {/* 建立優惠券表單 */}
      <CouponForm
        open={showForm}
        onOpenChange={setShowForm}
        places={placesData?.places}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* 編輯優惠券表單 */}
      <CouponForm
        open={!!editingCoupon}
        onOpenChange={() => setEditingCoupon(null)}
        coupon={editingCoupon}
        places={placesData?.places}
        onSubmit={handleUpdate}
        isLoading={updateMutation.isPending}
      />
    </main>
  );
}

export default function CouponsPage() {
  return (
    <AuthGuard>
      <CouponsContent />
    </AuthGuard>
  );
}

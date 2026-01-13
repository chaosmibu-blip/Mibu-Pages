'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { useAuth } from '@/hooks/useAuth';
import { merchantApi, type MerchantPlace } from '@/services/api/merchant';
import { PlaceCard } from '@/components/merchant/PlaceCard';
import { PlaceClaimModal } from '@/components/merchant/PlaceClaimModal';
import { MerchantNav } from '@/components/common/MerchantNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, ArrowUpRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

function PlacesContent() {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [editingPlace, setEditingPlace] = useState<MerchantPlace | null>(null);
  const [editForm, setEditForm] = useState({
    merchantOffer: '',
    merchantDescription: '',
  });

  // 取得商家資料（含配額）
  const { data: merchantData } = useQuery({
    queryKey: ['merchant-info', token],
    queryFn: () => merchantApi.getMerchant(),
    enabled: !!token,
  });

  // 取得已認領的景點
  const {
    data: placesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['merchantPlaces', token],
    queryFn: () => merchantApi.getPlaces(),
    enabled: !!token,
  });

  // 更新景點資訊
  const updateMutation = useMutation({
    mutationFn: ({ linkId, data }: { linkId: number; data: typeof editForm }) =>
      merchantApi.updatePlace(linkId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantPlaces'] });
      setEditingPlace(null);
    },
  });

  // 取消認領
  const unclaimMutation = useMutation({
    mutationFn: (linkId: number) => merchantApi.unclaimPlace(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantPlaces'] });
    },
  });

  const merchant = merchantData?.merchant;
  const places = placesData?.places || [];
  const maxPlaces = merchant?.maxPlaces || 1;

  const handleEdit = (place: MerchantPlace) => {
    setEditingPlace(place);
    setEditForm({
      merchantOffer: place.merchantOffer || '',
      merchantDescription: place.merchantDescription || '',
    });
  };

  const handleSaveEdit = () => {
    if (editingPlace) {
      updateMutation.mutate({ linkId: editingPlace.linkId, data: editForm });
    }
  };

  const handleRemove = (linkId: number) => {
    if (confirm('確定要取消認領此景點嗎？')) {
      unclaimMutation.mutate(linkId);
    }
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
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>景點管理</CardTitle>
                <CardDescription>認領並管理您的商家景點</CardDescription>
              </div>
            </div>
            <PlaceClaimModal
              maxPlaces={maxPlaces}
              currentPlacesCount={places.length}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 配額狀態 */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">已認領景點</p>
              <p className="text-2xl font-bold">
                {places.length} / {maxPlaces === Infinity ? '無限制' : maxPlaces}
              </p>
            </div>
            {places.length >= maxPlaces && maxPlaces !== Infinity && (
              <Link href="/for-business/pricing">
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  升級方案
                </Button>
              </Link>
            )}
          </div>

          {/* 景點列表 */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">無法載入景點資料</p>
              <Button
                variant="outline"
                onClick={() =>
                  queryClient.invalidateQueries({ queryKey: ['merchantPlaces'] })
                }
              >
                重新載入
              </Button>
            </div>
          ) : places.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">還沒有認領任何景點</h3>
              <p className="text-sm text-muted-foreground mb-4">
                認領景點後，可以設定專屬優惠吸引更多顧客
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {places.map((place) => (
                <PlaceCard
                  key={place.linkId}
                  place={place}
                  variant="owned"
                  onEdit={() => handleEdit(place)}
                  onRemove={() => handleRemove(place.linkId)}
                  isLoading={unclaimMutation.isPending}
                />
              ))}
            </div>
          )}

          {/* 提示訊息 */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              認領景點後，您可以：
            </p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
              <li>設定專屬優惠資訊，吸引更多顧客</li>
              <li>在 Mibu App 中優先曝光</li>
              <li>查看景點瀏覽數據（升級方案後）</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 編輯景點對話框 */}
      <Dialog open={!!editingPlace} onOpenChange={() => setEditingPlace(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯景點資訊</DialogTitle>
            <DialogDescription>
              設定您的專屬優惠資訊，讓顧客更容易找到您
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {editingPlace && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{editingPlace.place.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {editingPlace.place.address}
                  </p>
                </div>
                {editingPlace.isVerified && (
                  <Badge className="ml-auto bg-green-500">已驗證</Badge>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="merchantOffer">優惠資訊</Label>
              <Input
                id="merchantOffer"
                value={editForm.merchantOffer}
                onChange={(e) =>
                  setEditForm({ ...editForm, merchantOffer: e.target.value })
                }
                placeholder="例：出示 Mibu App 享 9 折優惠"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchantDescription">商家描述</Label>
              <Textarea
                id="merchantDescription"
                value={editForm.merchantDescription}
                onChange={(e) =>
                  setEditForm({ ...editForm, merchantDescription: e.target.value })
                }
                placeholder="介紹您的店家特色..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setEditingPlace(null)}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateMutation.isPending}
                className="flex-1"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    儲存中...
                  </>
                ) : (
                  '儲存變更'
                )}
              </Button>
            </div>

            {updateMutation.error && (
              <p className="text-sm text-destructive text-center">
                儲存失敗，請稍後再試
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function PlacesPage() {
  return (
    <AuthGuard>
      <PlacesContent />
    </AuthGuard>
  );
}

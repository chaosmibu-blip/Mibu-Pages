'use client';

import Image from 'next/image';
import { MapPin, Star, CheckCircle, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MerchantPlace, ClaimablePlace } from '@/services/api/merchant';

interface PlaceCardProps {
  place: MerchantPlace | ClaimablePlace;
  variant?: 'owned' | 'claimable';
  onClaim?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
}

/** 檢查是否為已認領的景點 */
function isMerchantPlace(
  place: MerchantPlace | ClaimablePlace
): place is MerchantPlace {
  return 'linkId' in place;
}

export function PlaceCard({
  place,
  variant = 'owned',
  onClaim,
  onEdit,
  onRemove,
  isLoading,
}: PlaceCardProps) {
  const isOwned = variant === 'owned';
  const placeData = isMerchantPlace(place) ? place.place : place;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* 圖片 */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
          {placeData.imageUrl ? (
            <Image
              src={placeData.imageUrl}
              alt={placeData.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {isOwned && isMerchantPlace(place) && place.isVerified && (
            <div className="absolute top-1 right-1">
              <Badge className="bg-green-500 text-white text-xs px-1">
                <CheckCircle className="h-3 w-3" />
              </Badge>
            </div>
          )}
        </div>

        {/* 內容 */}
        <CardContent className="flex-1 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground truncate">
                {placeData.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {placeData.address}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {placeData.category}
                </Badge>
                {placeData.rating && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {placeData.rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 商家優惠資訊 */}
          {isOwned && isMerchantPlace(place) && place.merchantOffer && (
            <p className="text-sm text-primary mt-2 truncate">
              優惠：{place.merchantOffer}
            </p>
          )}

          {/* 操作按鈕 */}
          <div className="flex items-center gap-2 mt-3">
            {isOwned ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  disabled={isLoading}
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  編輯
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRemove}
                  disabled={isLoading}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  移除
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                onClick={onClaim}
                disabled={isLoading || ('isClaimed' in place && place.isClaimed)}
              >
                {isLoading ? '處理中...' : '認領此景點'}
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default PlaceCard;

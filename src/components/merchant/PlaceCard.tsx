'use client';

import Image from 'next/image';
import { MapPin, Star, CheckCircle, Clock, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { MerchantPlace, ClaimablePlace } from '@/services/api/merchant';

interface PlaceCardProps {
  place: MerchantPlace | ClaimablePlace;
  variant?: 'owned' | 'claimable';
  onClaim?: () => void;
  onEdit?: () => void;
  isLoading?: boolean;
}

/** 檢查是否為已認領的景點 */
function isMerchantPlace(
  place: MerchantPlace | ClaimablePlace
): place is MerchantPlace {
  return 'merchantId' in place;
}

export function PlaceCard({
  place,
  variant = 'owned',
  onClaim,
  onEdit,
  isLoading,
}: PlaceCardProps) {
  const isOwned = variant === 'owned';
  const isMerchant = isMerchantPlace(place);

  // 取得顯示用資料
  const placeName = place.placeName;
  const location = `${place.city} ${place.district}`.trim();
  const imageUrl = isMerchant ? place.inventoryImageUrl : null;
  const category = !isMerchant ? place.category : null;
  const rating = !isMerchant && place.googleRating ? parseFloat(place.googleRating) : null;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex">
        {/* 圖片 */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={placeName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          {/* 狀態標籤 */}
          {isOwned && isMerchant && (
            <div className="absolute top-1 right-1">
              {place.status === 'approved' ? (
                <Badge className="bg-green-500 text-white text-xs px-1">
                  <CheckCircle className="h-3 w-3" />
                </Badge>
              ) : place.status === 'pending' ? (
                <Badge className="bg-yellow-500 text-white text-xs px-1">
                  <Clock className="h-3 w-3" />
                </Badge>
              ) : null}
            </div>
          )}
        </div>

        {/* 內容 */}
        <CardContent className="flex-1 p-3 sm:p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground truncate">
                {placeName}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {location}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {category && (
                  <Badge variant="secondary" className="text-xs">
                    {category}
                  </Badge>
                )}
                {rating && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {rating.toFixed(1)}
                  </span>
                )}
                {isMerchant && place.status === 'pending' && (
                  <Badge variant="outline" className="text-xs text-yellow-600">
                    審核中
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* 商家優惠資訊 */}
          {isOwned && isMerchant && place.promoTitle && place.isPromoActive && (
            <p className="text-sm text-primary mt-2 truncate">
              優惠：{place.promoTitle}
            </p>
          )}

          {/* 操作按鈕 */}
          <div className="flex items-center gap-2 mt-3">
            {isOwned ? (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                disabled={isLoading}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                編輯
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={onClaim}
                disabled={isLoading}
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

'use client';

import { Ticket, Calendar, Users, MoreVertical, Edit2, Trash2, Power } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Coupon } from '@/services/api/merchant';

interface CouponCardProps {
  coupon: Coupon;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggle?: (isActive: boolean) => void;
  isLoading?: boolean;
}

const discountTypeLabels: Record<string, string> = {
  percentage: '折扣',
  fixed: '折抵',
  freebie: '贈品',
};

export function CouponCard({
  coupon,
  onEdit,
  onDelete,
  onToggle,
  isLoading,
}: CouponCardProps) {
  const now = new Date();
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);

  const isExpired = validUntil < now;
  const isNotStarted = validFrom > now;
  const isUsedUp = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  let statusBadge = null;
  if (isExpired) {
    statusBadge = <Badge variant="secondary">已過期</Badge>;
  } else if (isNotStarted) {
    statusBadge = <Badge variant="outline">尚未開始</Badge>;
  } else if (isUsedUp) {
    statusBadge = <Badge variant="secondary">已用完</Badge>;
  } else if (!coupon.isActive) {
    statusBadge = <Badge variant="secondary">已停用</Badge>;
  } else {
    statusBadge = <Badge className="bg-green-500">使用中</Badge>;
  }

  const formatDiscount = () => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}% OFF`;
    } else if (coupon.discountType === 'fixed') {
      return `NT$ ${coupon.discountValue} 折抵`;
    } else {
      return '贈品';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-TW', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg shrink-0">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-foreground truncate">
                  {coupon.title}
                </h3>
                {statusBadge}
              </div>
              {coupon.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {coupon.description}
                </p>
              )}

              <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                <span className="font-medium text-primary">{formatDiscount()}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(validFrom)} - {formatDate(validUntil)}
                </span>
                {coupon.usageLimit && (
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {coupon.usedCount} / {coupon.usageLimit}
                  </span>
                )}
              </div>

              {coupon.minPurchase && (
                <p className="text-xs text-muted-foreground mt-2">
                  低消 NT$ {coupon.minPurchase}
                  {coupon.maxDiscount && ` / 最高折抵 NT$ ${coupon.maxDiscount}`}
                </p>
              )}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit} disabled={isLoading}>
                <Edit2 className="h-4 w-4 mr-2" />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggle?.(!coupon.isActive)}
                disabled={isLoading || isExpired}
              >
                <Power className="h-4 w-4 mr-2" />
                {coupon.isActive ? '停用' : '啟用'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={onDelete}
                disabled={isLoading}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export default CouponCard;

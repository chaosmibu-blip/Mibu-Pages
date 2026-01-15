'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Coupon, CreateCouponRequest, MerchantPlace } from '@/services/api/merchant';

const couponSchema = z.object({
  title: z.string().min(1, '請輸入優惠券名稱').max(50, '名稱不能超過 50 字'),
  description: z.string().max(200, '描述不能超過 200 字').optional(),
  discountType: z.enum(['percentage', 'fixed', 'freebie'], {
    required_error: '請選擇折扣類型',
  }),
  discountValue: z.number().min(0, '折扣值不能為負數'),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  validFrom: z.string().min(1, '請選擇開始日期'),
  validUntil: z.string().min(1, '請選擇結束日期'),
  usageLimit: z.number().min(1).optional(),
  placeId: z.number().optional(),
});

type CouponFormData = z.infer<typeof couponSchema>;

interface CouponFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupon?: Coupon | null;
  places?: MerchantPlace[];
  onSubmit: (data: CreateCouponRequest) => Promise<void>;
  isLoading?: boolean;
}

export function CouponForm({
  open,
  onOpenChange,
  coupon,
  places = [],
  onSubmit,
  isLoading,
}: CouponFormProps) {
  const isEditing = !!coupon;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      discountType: 'percentage',
      discountValue: 10,
    },
  });

  const discountType = watch('discountType');

  useEffect(() => {
    if (coupon) {
      reset({
        title: coupon.title,
        description: coupon.description || '',
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minPurchase: coupon.minPurchase || undefined,
        maxDiscount: coupon.maxDiscount || undefined,
        validFrom: coupon.validFrom.split('T')[0],
        validUntil: coupon.validUntil.split('T')[0],
        usageLimit: coupon.usageLimit || undefined,
        placeId: coupon.placeId || undefined,
      });
    } else {
      // 預設值：從今天開始，一個月後結束
      const today = new Date().toISOString().split('T')[0];
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthStr = nextMonth.toISOString().split('T')[0];

      reset({
        title: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        validFrom: today,
        validUntil: nextMonthStr,
      });
    }
  }, [coupon, reset]);

  const handleFormSubmit = async (data: CouponFormData) => {
    await onSubmit({
      ...data,
      description: data.description || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? '編輯優惠券' : '建立優惠券'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? '修改優惠券資訊'
              : '建立新的優惠券吸引更多顧客'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          {/* 名稱 */}
          <div className="space-y-2">
            <Label htmlFor="title">優惠券名稱 *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="例：新客專屬 9 折券"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* 描述 */}
          <div className="space-y-2">
            <Label htmlFor="description">說明</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="優惠券使用說明..."
              rows={2}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* 折扣類型與值 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>折扣類型 *</Label>
              <Select
                value={discountType}
                onValueChange={(value: 'percentage' | 'fixed' | 'freebie') =>
                  setValue('discountType', value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">百分比折扣</SelectItem>
                  <SelectItem value="fixed">固定金額折抵</SelectItem>
                  <SelectItem value="freebie">贈品</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {discountType === 'percentage' ? '折扣 (%)' : '金額 (NT$)'}
              </Label>
              <Input
                id="discountValue"
                type="number"
                {...register('discountValue', { valueAsNumber: true })}
                placeholder={discountType === 'percentage' ? '10' : '100'}
              />
              {errors.discountValue && (
                <p className="text-sm text-destructive">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          {/* 低消與上限（百分比折扣時顯示） */}
          {discountType === 'percentage' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPurchase">低消金額</Label>
                <Input
                  id="minPurchase"
                  type="number"
                  {...register('minPurchase', { valueAsNumber: true })}
                  placeholder="不限"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxDiscount">最高折抵</Label>
                <Input
                  id="maxDiscount"
                  type="number"
                  {...register('maxDiscount', { valueAsNumber: true })}
                  placeholder="不限"
                />
              </div>
            </div>
          )}

          {/* 有效期間 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">開始日期 *</Label>
              <Input
                id="validFrom"
                type="date"
                {...register('validFrom')}
              />
              {errors.validFrom && (
                <p className="text-sm text-destructive">{errors.validFrom.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">結束日期 *</Label>
              <Input
                id="validUntil"
                type="date"
                {...register('validUntil')}
              />
              {errors.validUntil && (
                <p className="text-sm text-destructive">{errors.validUntil.message}</p>
              )}
            </div>
          </div>

          {/* 使用次數上限 */}
          <div className="space-y-2">
            <Label htmlFor="usageLimit">使用次數上限</Label>
            <Input
              id="usageLimit"
              type="number"
              {...register('usageLimit', { valueAsNumber: true })}
              placeholder="不限"
            />
          </div>

          {/* 指定景點 */}
          {places.length > 0 && (
            <div className="space-y-2">
              <Label>適用景點</Label>
              <Select
                value={watch('placeId')?.toString() || ''}
                onValueChange={(value) =>
                  setValue('placeId', value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="所有景點" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">所有景點</SelectItem>
                  {places.map((place) => (
                    <SelectItem key={place.id} value={place.id.toString()}>
                      {place.placeName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 按鈕 */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              取消
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  處理中...
                </>
              ) : isEditing ? (
                '儲存變更'
              ) : (
                '建立優惠券'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CouponForm;

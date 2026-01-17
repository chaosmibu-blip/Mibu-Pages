'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { MerchantNav } from '@/components/common/MerchantNav';
import { merchantApi, type CreatePlaceRequest } from '@/services/api/merchant';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import {
  MapPin,
  Plus,
  Loader2,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Globe,
  Building2,
} from 'lucide-react';
import Link from 'next/link';

// 七大分類（依照 WEB 契約 v1.2.0）
const CATEGORIES = [
  '美食',
  '住宿',
  '景點',
  '購物',
  '娛樂設施',
  '生態文化教育',
  '遊程體驗',
];

// 星期列表
const WEEKDAYS = [
  { key: 'monday', label: '星期一', short: '一' },
  { key: 'tuesday', label: '星期二', short: '二' },
  { key: 'wednesday', label: '星期三', short: '三' },
  { key: 'thursday', label: '星期四', short: '四' },
  { key: 'friday', label: '星期五', short: '五' },
  { key: 'saturday', label: '星期六', short: '六' },
  { key: 'sunday', label: '星期日', short: '日' },
];

// 時間選項（每 30 分鐘）
const TIME_OPTIONS: string[] = [];
for (let hour = 0; hour < 24; hour++) {
  const h = hour.toString().padStart(2, '0');
  TIME_OPTIONS.push(`${h}:00`);
  TIME_OPTIONS.push(`${h}:30`);
}
TIME_OPTIONS.push('24:00');

interface DayHours {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

const DEFAULT_HOURS: DayHours = {
  isOpen: true,
  openTime: '09:00',
  closeTime: '21:00',
};

function NewPlaceContent() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 表單狀態
  const [formData, setFormData] = useState<CreatePlaceRequest>({
    placeName: '',
    address: '',
    city: '',
    district: '',
    category: '',
    subcategory: '',
    description: '',
    phone: '',
    website: '',
  });

  // 營業時間狀態
  const [weeklyHours, setWeeklyHours] = useState<DayHours[]>(
    WEEKDAYS.map(() => ({ ...DEFAULT_HOURS }))
  );
  const [showOpeningHours, setShowOpeningHours] = useState(false);

  // 成功訊息
  const [successMessage, setSuccessMessage] = useState('');

  // 表單驗證錯誤
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 提交表單
  const createMutation = useMutation({
    mutationFn: () => {
      // 組裝營業時間
      const weekdayText = weeklyHours.map((day, index) => {
        const label = WEEKDAYS[index].label;
        if (!day.isOpen) {
          return `${label}: 休息`;
        }
        return `${label}: ${day.openTime}–${day.closeTime}`;
      });

      const placeData: CreatePlaceRequest = {
        ...formData,
        openingHours: showOpeningHours ? { weekdayText } : undefined,
      };

      return merchantApi.createPlace(placeData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['merchantPlaces'] });
      setSuccessMessage(data.message || '景點已提交審核，審核通過後將自動認領給您');

      // 3 秒後跳轉到景點列表
      setTimeout(() => {
        router.push('/merchant/places');
      }, 3000);
    },
  });

  // 更新表單欄位
  const updateField = (field: keyof CreatePlaceRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // 清除該欄位的錯誤
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // 更新營業時間
  const updateDayHours = (dayIndex: number, field: keyof DayHours, value: string | boolean) => {
    setWeeklyHours((prev) => {
      const newHours = [...prev];
      newHours[dayIndex] = { ...newHours[dayIndex], [field]: value };
      return newHours;
    });
  };

  // 套用營業時間到所有日期
  const applyToAll = (sourceIndex: number) => {
    const source = weeklyHours[sourceIndex];
    setWeeklyHours(WEEKDAYS.map(() => ({ ...source })));
  };

  // 表單驗證
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.placeName.trim()) {
      newErrors.placeName = '請輸入景點名稱';
    }
    if (!formData.address.trim()) {
      newErrors.address = '請輸入地址';
    }
    if (!formData.city.trim()) {
      newErrors.city = '請選擇或輸入城市';
    }
    if (!formData.category) {
      newErrors.category = '請選擇類別';
    }

    // 驗證網站格式
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = '請輸入有效的網址（需包含 http:// 或 https://）';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 提交表單
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      createMutation.mutate();
    }
  };

  // 顯示成功訊息
  if (successMessage) {
    return (
      <main className="space-y-6">
        <div className="lg:hidden">
          <MerchantNav />
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">提交成功！</h2>
              <p className="text-muted-foreground">{successMessage}</p>
              <p className="text-sm text-muted-foreground">正在跳轉至景點列表...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      {/* 手機版導航 */}
      <div className="lg:hidden">
        <MerchantNav />
      </div>

      {/* 返回按鈕 */}
      <Link href="/merchant/places">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          返回景點列表
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>新增景點</CardTitle>
              <CardDescription>
                填寫景點資訊，提交後將進行審核
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              新增的景點需要經過審核，審核通過後將自動認領給您。
              審核時間約 1-3 個工作日。
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本資訊區塊 */}
            <section className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                基本資訊
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="placeName">
                    景點名稱 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="placeName"
                    value={formData.placeName}
                    onChange={(e) => updateField('placeName', e.target.value)}
                    placeholder="例：星巴克信義店"
                    className={errors.placeName ? 'border-destructive' : ''}
                  />
                  {errors.placeName && (
                    <p className="text-sm text-destructive">{errors.placeName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    類別 <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => updateField('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="選擇類別" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">子類別</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory || ''}
                    onChange={(e) => updateField('subcategory', e.target.value)}
                    placeholder="例：咖啡廳"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">
                    城市 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="例：台北市"
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">區域</Label>
                  <Input
                    id="district"
                    value={formData.district || ''}
                    onChange={(e) => updateField('district', e.target.value)}
                    placeholder="例：信義區"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">
                    地址 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="完整地址"
                    className={errors.address ? 'border-destructive' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="description">描述</Label>
                  <Textarea
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="簡單描述此景點的特色..."
                    rows={3}
                  />
                </div>
              </div>
            </section>

            {/* 聯絡資訊區塊 */}
            <section className="space-y-4">
              <h3 className="font-medium flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                聯絡資訊
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    電話
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="例：02-1234-5678"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="h-3.5 w-3.5" />
                    網站
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website || ''}
                    onChange={(e) => updateField('website', e.target.value)}
                    placeholder="https://..."
                    className={errors.website ? 'border-destructive' : ''}
                  />
                  {errors.website && (
                    <p className="text-sm text-destructive">{errors.website}</p>
                  )}
                </div>
              </div>
            </section>

            {/* 營業時間區塊 */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  營業時間
                </h3>
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-hours" className="text-sm text-muted-foreground">
                    啟用
                  </Label>
                  <Switch
                    id="show-hours"
                    checked={showOpeningHours}
                    onCheckedChange={setShowOpeningHours}
                  />
                </div>
              </div>

              {showOpeningHours && (
                <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWeeklyHours(WEEKDAYS.map(() => ({
                          isOpen: true,
                          openTime: '09:00',
                          closeTime: '21:00',
                        })));
                      }}
                    >
                      預設（09:00-21:00）
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWeeklyHours(WEEKDAYS.map((_, i) => ({
                          isOpen: i < 5, // 週一到週五營業
                          openTime: '09:00',
                          closeTime: '18:00',
                        })));
                      }}
                    >
                      週一至週五
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setWeeklyHours(WEEKDAYS.map(() => ({
                          isOpen: true,
                          openTime: '00:00',
                          closeTime: '24:00',
                        })));
                      }}
                    >
                      24 小時營業
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {WEEKDAYS.map((day, index) => (
                      <div
                        key={day.key}
                        className="flex items-center gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="w-14 flex items-center gap-2">
                          <Switch
                            checked={weeklyHours[index].isOpen}
                            onCheckedChange={(checked) =>
                              updateDayHours(index, 'isOpen', checked)
                            }
                          />
                        </div>
                        <span className="w-16 text-sm font-medium">
                          {day.label}
                        </span>

                        {weeklyHours[index].isOpen ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Select
                              value={weeklyHours[index].openTime}
                              onValueChange={(value) =>
                                updateDayHours(index, 'openTime', value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_OPTIONS.slice(0, -1).map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <span className="text-muted-foreground">至</span>
                            <Select
                              value={weeklyHours[index].closeTime}
                              onValueChange={(value) =>
                                updateDayHours(index, 'closeTime', value)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {TIME_OPTIONS.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-xs text-muted-foreground ml-auto"
                              onClick={() => applyToAll(index)}
                            >
                              套用至全部
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            休息
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 錯誤訊息 */}
            {createMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {createMutation.error.message || '提交失敗，請稍後再試'}
                </AlertDescription>
              </Alert>
            )}

            {/* 提交按鈕 */}
            <div className="flex gap-3 pt-4">
              <Link href="/merchant/places" className="flex-1 sm:flex-none">
                <Button type="button" variant="outline" className="w-full sm:w-auto">
                  取消
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 sm:flex-none"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    提交審核
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

export default function NewPlacePage() {
  return (
    <AuthGuard>
      <NewPlaceContent />
    </AuthGuard>
  );
}

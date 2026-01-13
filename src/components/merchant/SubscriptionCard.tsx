'use client';

import { CreditCard, CalendarDays, CheckCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Subscription } from '@/services/api/merchant';

interface SubscriptionCardProps {
  subscription: Subscription;
  tier: string;
  tierInfo: {
    name: string;
    color: string;
    description: string;
  };
}

const statusConfig: Record<
  string,
  { name: string; color: string; icon: typeof CheckCircle }
> = {
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

export function SubscriptionCard({
  subscription,
  tier,
  tierInfo,
}: SubscriptionCardProps) {
  const statusInfo = statusConfig[subscription.status] || statusConfig.active;
  const StatusIcon = statusInfo.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {/* 方案資訊 */}
        <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">目前方案</p>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={tierInfo.color}>{tierInfo.name}</Badge>
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.name}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{tierInfo.description}</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* 日期資訊 */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary/10">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {subscription.status === 'cancelled' ? '服務至：' : '下次續訂：'}
              {formatDate(subscription.currentPeriodEnd)}
            </p>
          </div>

          {/* 付款方式 */}
          <div className="flex items-center gap-2 mt-2">
            <p className="text-xs text-muted-foreground">
              付款方式：{subscription.provider === 'stripe' ? 'Stripe' : 'Recur'}
            </p>
          </div>
        </div>

        {/* 訂閱期間 */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">開始日期</p>
            <p className="text-sm font-medium">{formatDate(subscription.currentPeriodStart)}</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">結束日期</p>
            <p className="text-sm font-medium">{formatDate(subscription.currentPeriodEnd)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default SubscriptionCard;

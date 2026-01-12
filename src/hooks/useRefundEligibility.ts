import { useQuery } from '@tanstack/react-query';
import { API_URL } from '@/lib/config';

interface RefundEligibility {
  subscriptionId: number;
  provider: 'stripe' | 'recur';
  tier: string;
  status: string;
  createdAt: string;
  daysSinceCreation: number;
  refundEligibility: {
    isEligible: boolean;
    reason: string;
    hoursRemaining: number;
    daysRemaining: number;
  };
  cancellationPolicy: {
    canCancel: boolean;
    note: string;
  };
}

export function useRefundEligibility(subscriptionId: number | undefined) {
  return useQuery<RefundEligibility>({
    queryKey: ['refund-eligibility', subscriptionId],
    queryFn: async () => {
      const res = await fetch(
        `${API_URL}/api/merchant/subscription/refund-eligibility?subscriptionId=${subscriptionId}`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Failed to check eligibility');
      const data = await res.json();
      return data;
    },
    enabled: !!subscriptionId,
  });
}

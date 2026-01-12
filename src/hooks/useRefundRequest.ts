import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API_URL } from '@/lib/config';

interface RefundRequestInput {
  subscriptionId: number;
  reason: string;
}

interface RefundResponse {
  success: boolean;
  message: string;
  refundStatus: 'approved' | 'pending_manual_review' | 'not_eligible' | 'error';
  refundId?: string;
  requestId?: number;
  eligibility?: any;
  contactEmail?: string;
}

export function useRefundRequest() {
  const queryClient = useQueryClient();

  return useMutation<RefundResponse, Error, RefundRequestInput>({
    mutationFn: async (data) => {
      const res = await fetch(
        `${API_URL}/api/merchant/subscription/refund-request`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['refund-eligibility'] });
    },
  });
}

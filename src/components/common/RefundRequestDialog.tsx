"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRefundEligibility } from "@/hooks/useRefundEligibility";
import { useRefundRequest } from "@/hooks/useRefundRequest";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

interface RefundRequestDialogProps {
  subscriptionId: number | undefined;
}

export function RefundRequestDialog({ subscriptionId }: RefundRequestDialogProps) {
  const { data: eligibility, isLoading: eligibilityLoading } = useRefundEligibility(subscriptionId);
  const refundMutation = useRefundRequest();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  if (!subscriptionId) return null;

  const handleSubmit = async () => {
    if (!subscriptionId || reason.length < 10) return;
    
    await refundMutation.mutateAsync({ subscriptionId, reason });
    
    if (refundMutation.data?.success) {
      setOpen(false);
      setReason("");
    }
  };

  const isEligible = eligibility?.refundEligibility?.isEligible;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          disabled={eligibilityLoading}
          data-testid="button-refund-request"
        >
          申請退款
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>申請退款</DialogTitle>
          <DialogDescription>
            根據消費者保護法，首次訂閱享有 7 天鑑賞期
          </DialogDescription>
        </DialogHeader>

        {eligibilityLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : eligibility ? (
          <div className="space-y-4">
            {isEligible ? (
              <>
                <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    {eligibility.refundEligibility.reason}
                    {eligibility.refundEligibility.hoursRemaining > 0 && (
                      <span className="block mt-1">
                        剩餘 {eligibility.refundEligibility.hoursRemaining} 小時可申請
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <label className="text-sm font-medium">退款原因</label>
                  <Textarea
                    placeholder="請說明退款原因（至少 10 字）"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[100px]"
                    data-testid="input-refund-reason"
                  />
                  <p className="text-xs text-muted-foreground">
                    {reason.length}/10 字（最少 10 字）
                  </p>
                </div>

                {refundMutation.isError && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      申請失敗，請稍後再試或聯繫客服
                    </AlertDescription>
                  </Alert>
                )}

                {refundMutation.data && !refundMutation.data.success && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      {refundMutation.data.message}
                    </AlertDescription>
                  </Alert>
                )}

                {refundMutation.data?.success && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700 dark:text-green-300">
                      {refundMutation.data.message}
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  {eligibility.refundEligibility.reason}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              無法取得退款資格資訊，請稍後再試
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          {isEligible && (
            <Button
              onClick={handleSubmit}
              disabled={reason.length < 10 || refundMutation.isPending}
              data-testid="button-confirm-refund"
            >
              {refundMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  處理中...
                </>
              ) : (
                "確認申請退款"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

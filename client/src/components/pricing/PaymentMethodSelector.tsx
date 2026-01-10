import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CreditCard, Building2 } from "lucide-react";

interface PaymentMethodSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  tier: "pro" | "premium";
  onConfirm: (provider: "stripe" | "recur") => void;
  loading?: boolean;
}

export function PaymentMethodSelector({
  isOpen,
  onClose,
  tier,
  onConfirm,
  loading = false,
}: PaymentMethodSelectorProps) {
  const [provider, setProvider] = useState<"stripe" | "recur">("recur");

  const tierLabels = {
    pro: "Pro",
    premium: "Premium",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>選擇付款方式</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          您正在升級至 <strong>{tierLabels[tier]}</strong> 方案
        </p>

        <div className="space-y-4 py-4">
          <label
            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
              provider === "recur"
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            data-testid="option-recur"
          >
            <input
              type="radio"
              name="provider"
              checked={provider === "recur"}
              onChange={() => setProvider("recur")}
              className="w-5 h-5 text-primary"
            />
            <div className="flex-1">
              <div className="font-semibold text-foreground">台灣本地支付</div>
              <div className="text-sm text-muted-foreground">
                信用卡、ATM 轉帳
              </div>
            </div>
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </label>

          <label
            className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition ${
              provider === "stripe"
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            data-testid="option-stripe"
          >
            <input
              type="radio"
              name="provider"
              checked={provider === "stripe"}
              onChange={() => setProvider("stripe")}
              className="w-5 h-5 text-primary"
            />
            <div className="flex-1">
              <div className="font-semibold text-foreground">國際信用卡</div>
              <div className="text-sm text-muted-foreground">
                Visa, Mastercard, AMEX
              </div>
            </div>
            <CreditCard className="h-6 w-6 text-muted-foreground" />
          </label>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-payment">
            取消
          </Button>
          <Button
            onClick={() => onConfirm(provider)}
            disabled={loading}
            data-testid="button-confirm-payment"
          >
            {loading ? "處理中..." : "前往付款"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/config";

export interface SubscriptionPlan {
  id: string;
  tier: "free" | "pro" | "premium";
  title: string;
  priceMonthly: number;
  priceYearly: number | null;
  features: string[];
  buttonText: string;
  disabled: boolean;
  highlighted: boolean;
  highlightLabel: string | null;
}

export function useSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/subscription-plans`);
      if (!res.ok) throw new Error("Failed to fetch subscription plans");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

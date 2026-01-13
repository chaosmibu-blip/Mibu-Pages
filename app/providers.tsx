"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RecurProvider } from "recur-tw";
import { useState } from "react";
import { RECUR_PUBLISHABLE_KEY } from "@/lib/config";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RecurProvider
          config={{
            publishableKey: RECUR_PUBLISHABLE_KEY,
            checkoutMode: "modal",
          }}
        >
          {children}
        </RecurProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

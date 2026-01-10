"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RecurProvider } from "recur-tw";
import { useState, useEffect } from "react";

const RECUR_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_RECUR_PUBLISHABLE_KEY || "";

if (typeof window !== "undefined") {
  console.log("Recur publishable key length:", RECUR_PUBLISHABLE_KEY.length);
  console.log("Recur publishable key preview:", RECUR_PUBLISHABLE_KEY.substring(0, 20) + "...");
  const nonAscii = RECUR_PUBLISHABLE_KEY.match(/[^\x00-\x7F]/g);
  if (nonAscii) {
    console.error("Non-ASCII characters found in publishable key:", nonAscii);
  }
}

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

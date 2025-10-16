"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Retry failed requests once
      // refetchOnWindowFocus: false, // Don’t refetch when user switches back to tab
      staleTime: Infinity,
    },
  },
});

export function TanstackQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

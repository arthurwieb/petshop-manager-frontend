"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Your existing staleTime from your page queries
            staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes

            // How long inactive queries are kept in the cache before garbage collection.
            // Increase this to keep data longer when navigating away from a page.
            // Default is 5 minutes.
            gcTime: 1000 * 60 * 60, // Keep data in cache for 1 hour even if inactive
            // Or use Infinity if you want data to persist for the entire session
            // gcTime: Infinity,

            refetchOnWindowFocus: true,
          },
          // You can also add default options for mutations here if needed
          // mutations: {
          //   retry: 1,
          // },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
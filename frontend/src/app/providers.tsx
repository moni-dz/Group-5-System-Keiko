"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { getQueryClient } from "./query-client";
import { SpeedInsights } from "@vercel/speed-insights/next";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers(props: ProvidersProps) {
  const { children } = props;
  const queryClient = getQueryClient();

  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <ReactQueryStreamedHydration>
          {children}
          <SpeedInsights />
        </ReactQueryStreamedHydration>
      </QueryClientProvider>
    </NuqsAdapter>
  );
}

"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { ServiceWorkerProvider } from "@/components/providers/service-worker-provider";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ServiceWorkerProvider />
      {children}
    </ThemeProvider>
  );
}

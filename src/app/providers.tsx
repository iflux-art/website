'use client';

import { ThemeProvider } from 'next-themes';
import { ServiceWorkerProvider } from '@/components/providers/service-worker-provider';
import React from 'react';

const themeConfig = {
  attribute: 'class',
  defaultTheme: 'system',
  enableSystem: true,
  storageKey: 'iflux-theme-preference',
  disableTransitionOnChange: true,
} as const;

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider {...themeConfig}>
      <ServiceWorkerProvider />
      {children}
    </ThemeProvider>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export function PageLayout({ children, className, containerClassName }: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen bg-background', className)}>
      <div className={cn('container mx-auto px-4 py-6', containerClassName)}>
        <div className="mx-auto">{children}</div>
      </div>
    </div>
  );
}

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: PageTitleProps) {
  return <h1 className={cn('text-3xl font-bold mb-6', className)}>{children}</h1>;
}

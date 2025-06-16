'use client';

import { cn } from '@/lib/utils';

export function Background({ className }: { className?: string }) {
  return (
    <div className={cn('absolute inset-0 -z-10', className)}>
      <div className="absolute bottom-0 left-0 w-full h-64 opacity-10">
        <div
          className="absolute bottom-0 left-0 w-[200%] h-40 bg-primary/20 rounded-[100%] animate-wave"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute bottom-5 left-0 w-[200%] h-40 bg-primary/15 rounded-[100%] animate-wave"
          style={{ animationDuration: '15s', animationDelay: '2s' }}
        />
      </div>
    </div>
  );
}
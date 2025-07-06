"use client";

import { cn } from "@/lib/utils";

export function Background({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      <div className="absolute bottom-0 left-0 h-64 w-full opacity-10">
        <div
          className="animate-wave absolute bottom-0 left-0 h-40 w-[200%] rounded-[100%] bg-primary/20"
          style={{ animationDuration: "20s" }}
        />
        <div
          className="animate-wave absolute bottom-5 left-0 h-40 w-[200%] rounded-[100%] bg-primary/15"
          style={{ animationDuration: "15s", animationDelay: "2s" }}
        />
      </div>
    </div>
  );
}

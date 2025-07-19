import React from "react";
import Link from "next/link";
import { cn } from "packages/src/lib/utils";
import type { AdminPageContentLayoutProps } from "packages/src/types/admin-types";

export default function AdminPageContentLayout({
  children,
  title,
  description,
  icon: Icon,
  backUrl,
  backLabel,
  className,
  headerClassName,
  contentClassName,
}: AdminPageContentLayoutProps) {
  return (
    <div
      className={cn("min-h-screen p-4 sm:p-6 md:p-8", className)}
      role="region"
      aria-label="管理页面内容"
    >
      <div className="mx-auto max-w-7xl">
        {(title || description || backUrl) && (
          <header
            className={cn(
              "mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center",
              headerClassName,
            )}
          >
            {(title || description) && (
              <div>
                {title && (
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                    {description}
                  </p>
                )}
              </div>
            )}
            {(backUrl || Icon) && (
              <div className="flex items-center space-x-3">
                {Icon && (
                  <Icon
                    className="h-5 w-5 text-muted-foreground sm:h-6 sm:w-6"
                    aria-hidden="true"
                  />
                )}
                {backUrl && (
                  <Link
                    href={backUrl}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={backLabel || "返回"}
                  >
                    {backLabel || "返回"}
                  </Link>
                )}
              </div>
            )}
          </header>
        )}
        <main className={cn("w-full", contentClassName)} role="main">
          {children}
        </main>
      </div>
    </div>
  );
} 
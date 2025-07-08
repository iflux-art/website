"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MDXCardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

export const MDXCard = ({
  children,
  title,
  description,
  icon,
  className,
  variant = "default",
  size = "md",
  hoverable = false,
}: MDXCardProps) => {
  const variantStyles = {
    default: "bg-white dark:bg-gray-800 shadow-sm",
    outline: "border border-gray-200 dark:border-gray-700",
    ghost: "bg-transparent",
  };

  const sizeStyles = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        variantStyles[variant],
        sizeStyles[size],
        hoverable && "hover:-translate-y-1 hover:shadow-md",
        className,
      )}
    >
      {(title || icon || description) && (
        <div className="mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="text-primary-500 flex-shrink-0">{icon}</div>
            )}
            {title && (
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {title}
              </h3>
            )}
          </div>
          {description && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </div>
          )}
        </div>
      )}
      <div className="prose max-w-none">{children}</div>
    </div>
  );
};

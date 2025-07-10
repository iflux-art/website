"use client";

import type { MDXCalloutProps } from "@/types/mdx-component-types";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const CALLOUT_CONFIG = {
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    textColor: "text-blue-800 dark:text-blue-200",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    textColor: "text-green-800 dark:text-green-200",
    titleColor: "text-green-900 dark:text-green-100",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    textColor: "text-yellow-800 dark:text-yellow-200",
    titleColor: "text-yellow-900 dark:text-yellow-100",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
    textColor: "text-red-800 dark:text-red-200",
    titleColor: "text-red-900 dark:text-red-100",
  },
};

export const MDXCallout = ({
  type = "info",
  title,
  children,
  className,
}: MDXCalloutProps) => {
  const {
    icon: Icon,
    bgColor,
    borderColor,
    textColor,
    titleColor,
  } = CALLOUT_CONFIG[type];

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        bgColor,
        borderColor,
        textColor,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          {title && (
            <h4 className={cn("mb-2 font-semibold", titleColor)}>{title}</h4>
          )}
          <div className="prose-sm [&>p]:m-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

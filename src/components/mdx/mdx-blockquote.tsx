"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type BlockquoteVariant = "default" | "info" | "elegant";

export interface MDXBlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
  citation?: string;
  author?: string;
  variant?: BlockquoteVariant;
}

export const MDXBlockquote = ({
  children,
  citation,
  author,
  className,
  variant = "default",
  ...props
}: MDXBlockquoteProps) => {
  const baseStyles = cn(
    "not-prose my-6 rounded-r-lg px-6 py-4",
    "border-l-4 italic text-muted-foreground",
    "flex items-start gap-4",
    className,
  );

  const variantStyles = {
    default: cn(
      "bg-gray-50 dark:bg-gray-800",
      "border-gray-300 dark:border-gray-600",
    ),
    info: cn(
      "bg-blue-50 dark:bg-blue-900/20",
      "border-blue-500 dark:border-blue-400",
    ),
    elegant: cn(
      "bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800",
      "border-primary-500",
    ),
  };

  return (
    <blockquote className={cn(baseStyles, variantStyles[variant])} {...props}>
      <Quote className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
      <div className="flex-1">
        {children}
        {(citation || author) && (
          <footer className="mt-4 text-sm text-muted-foreground">
            {citation && (
              <cite className="font-medium not-italic">{citation}</cite>
            )}
            {author && (
              <span className="block text-xs">
                — <span className="font-medium">{author}</span>
              </span>
            )}
          </footer>
        )}
      </div>
    </blockquote>
  );
};

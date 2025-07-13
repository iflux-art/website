"use client";

import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MDXBlockquoteProps } from "@/types/mdx-component-types";

export const MDXBlockquote = ({
  children,
  citation,
  author,
  className,
  ...props
}: MDXBlockquoteProps) => {
  return (
    <blockquote
      className={cn(
        "not-prose my-6 rounded-r-lg px-6 py-4",
        "border-l-4 text-muted-foreground italic",
        "flex items-start gap-4",
        "bg-gray-50 dark:bg-gray-800",
        "border-gray-300 dark:border-gray-600",
        className,
      )}
      {...props}
    >
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

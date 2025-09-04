"use client";

import { cn } from "@/utils";
import { Quote } from "lucide-react";

type MDXBlockquoteProps = {
  children: React.ReactNode;
  citation?: string;
  author?: string;
  className?: string;
} & React.BlockquoteHTMLAttributes<HTMLQuoteElement>;

export const MDXBlockquote = ({
  children,
  citation,
  author,
  className,
  ...props
}: MDXBlockquoteProps) => (
  <blockquote
    className={cn(
      "not-prose my-6 rounded-r-lg px-6 py-4",
      "border-l-4 text-muted-foreground italic",
      "flex items-start gap-4",
      "bg-muted/50",
      "border-border",
      className
    )}
    {...props}
  >
    <Quote className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
    <div className="flex-1">
      {children}
      {(citation ?? author) && (
        <footer className="mt-4 text-sm text-muted-foreground">
          {citation && <cite className="font-medium not-italic">{citation}</cite>}
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

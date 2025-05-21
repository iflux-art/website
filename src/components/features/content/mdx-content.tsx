"use client"

import React from "react";
import { useMDXComponents } from "@/mdx-components";

interface MDXContentProps {
  children: React.ReactNode;
}

export function MDXContent({ children }: MDXContentProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      {children}
    </div>
  );
}

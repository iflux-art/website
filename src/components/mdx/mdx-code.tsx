import React from "react";

export function MDXCode({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={`inline rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-sm text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </code>
  );
}

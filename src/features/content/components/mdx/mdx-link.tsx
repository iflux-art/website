"use client";

import { cn } from "@/utils";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

type MDXLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  openInNewTab?: boolean;
  showExternalIcon?: boolean;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>;

const isExternalLink = (href: string): boolean =>
  href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");

export const MDXLink = ({
  href,
  children,
  className,
  external,
  openInNewTab = true,
  showExternalIcon = true,
}: MDXLinkProps) => {
  if (!href) return null;

  const isExternal = external ?? isExternalLink(href);
  const linkClasses = cn(
    "not-prose font-medium text-primary hover:text-primary/80",
    "relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0",
    "after:bg-current after:transition-all after:duration-300 after:ease-out",
    "hover:after:w-full",
    isExternal && "text-primary",
    className
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClasses}
        target={openInNewTab ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        {children}
        {showExternalIcon && <ExternalLink className="ml-1 inline-block h-3 w-3" />}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  );
};

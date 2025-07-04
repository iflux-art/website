'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import { cn } from '@/utils';

export interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  openInNewTab?: boolean;
  showExternalIcon?: boolean;
}

const styles = {
  base: 'relative inline-flex items-center gap-1 text-primary no-underline transition-colors hover:text-primary/80',
  external: 'cursor-alias',
  icon: 'h-3 w-3',
  underline:
    'after:absolute after:left-1/2 after:bottom-0 after:h-px after:w-0 after:bg-current after:transition-all hover:after:left-0 hover:after:w-full',
} as const;

const isExternalLink = (href: string): boolean => {
  return href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
};

export const MDXLink: React.FC<MDXLinkProps> = ({
  href,
  children,
  className,
  external,
  openInNewTab = true,
  showExternalIcon = true,
}) => {
  if (!href) return null;

  const isExternal = external ?? isExternalLink(href);
  const linkClasses = cn(styles.base, isExternal && styles.external, styles.underline, className);

  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClasses}
        target={openInNewTab ? '_blank' : undefined}
        rel="noopener noreferrer"
      >
        {children}
        {showExternalIcon && <ExternalLinkIcon className={styles.icon} />}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  );
};

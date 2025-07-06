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
  const linkClasses = cn(
    'not-prose font-medium text-primary relative',
    'hover:text-primary/80',
    'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-px',
    'after:bg-current after:transition-all after:duration-300 after:ease-out',
    'hover:after:left-0 hover:after:w-full hover:after:right-0',
    isExternal && 'text-primary-dark dark:text-primary-light',
    className
  );

  if (isExternal) {
    return (
      <a
        href={href}
        className={linkClasses}
        target={openInNewTab ? '_blank' : undefined}
        rel="noopener noreferrer"
      >
        {children}
        {showExternalIcon && <ExternalLinkIcon className="ml-1 inline-block h-3 w-3" />}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClasses}>
      {children}
    </Link>
  );
};

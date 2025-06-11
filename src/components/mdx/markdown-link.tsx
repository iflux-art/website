import { cn } from '@/lib/utils';
import Link from 'next/link';
import { HTMLAttributeAnchorTarget } from 'react';

interface MarkdownLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
  target?: HTMLAttributeAnchorTarget;
}

export function MarkdownLink({
  href,
  children,
  isExternal,
  className,
  target,
  ...props
}: MarkdownLinkProps) {
  if (isExternal) {
    return (
      <a
        href={href}
        className={cn('not-prose', className)}
        target={target || '_blank'}
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cn('not-prose', className)} {...props}>
      {children}
    </Link>
  );
}
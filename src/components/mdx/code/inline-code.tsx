import { cn } from '@/shared/utils/utils';

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return <code className={cn('not-prose', className)}>{children}</code>;
}


import { cn } from '@/lib/utils';
import './styles.css';  // 样式会移到统一的样式文件中

interface InlineCodeProps {
  children: React.ReactNode;
  className?: string;
}

export function InlineCode({ children, className }: InlineCodeProps) {
  return <code className={cn('not-prose', className)}>{children}</code>;
}

export default InlineCode;

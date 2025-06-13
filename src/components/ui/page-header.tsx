import { ReactNode } from 'react';

interface PageHeaderProps {
  /** 标题文本 */
  heading: string;
  /** 副标题或描述文本 */
  text?: string;
  /** 额外的子元素 */
  children?: ReactNode;
}
export function PageHeader({
  heading,
  text,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{heading}</h1>
      {text && <p className="text-muted-foreground">{text}</p>}
      {children}
    </div>
  );
}
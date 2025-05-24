import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BaseCardProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function BaseCard({
  title,
  description,
  children,
  className,
  onClick,
  href,
}: BaseCardProps) {
  const CardWrapper = href ? 'a' : 'div';

  return (
    <Card
      className={cn(
        'group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <CardWrapper {...(href ? { href } : {})} className="block h-full">
        <CardHeader>
          <CardTitle className="group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </CardTitle>
          {description && <CardDescription className="line-clamp-2">{description}</CardDescription>}
        </CardHeader>
        {children && <CardContent>{children}</CardContent>}
      </CardWrapper>
    </Card>
  );
}

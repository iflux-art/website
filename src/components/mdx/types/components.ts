export interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  icon: string;
  tags: string[];
  featured?: boolean;
}

export interface ResourceGridProps {
  columns: '1' | '2' | '3' | '4';
  children: React.ReactNode;
}

export interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
}

export interface HeadingProps extends TypographyProps {
  id?: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface LinkProps extends TypographyProps {
  href: string;
  external?: boolean;
}
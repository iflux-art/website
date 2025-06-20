import React, { forwardRef } from 'react';
import { Search, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
  onClear?: () => void;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ isLoading, onClear, className, value, ...props }, ref) => {
    return (
      <div
        className={`relative border-b border-border/30 dark:border-border/20 group hover:bg-accent/10 focus-within:bg-accent/15 transition-colors ${className || ''}`}
      >
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="h-[14px] w-[14px] text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors" />
        </div>
        <Input
          ref={ref}
          className="w-full rounded-none bg-transparent outline-none placeholder:text-muted-foreground/50 px-2.5 py-2 pl-8 border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-[15px] shadow-none"
          placeholder="搜索或输入命令..."
          value={value}
          aria-label="搜索"
          {...props}
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {isLoading && (
            <Loader2 className="h-[14px] w-[14px] animate-spin text-muted-foreground/60" />
          )}
          {value && !isLoading && onClear && (
            <button
              onClick={onClear}
              className="h-5 w-5 inline-flex items-center justify-center rounded-sm opacity-60 transition-all hover:opacity-100 hover:bg-accent/50 focus:outline-none focus:ring-1 focus:ring-ring"
              aria-label="清除搜索"
            >
              <X className="h-[14px] w-[14px]" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

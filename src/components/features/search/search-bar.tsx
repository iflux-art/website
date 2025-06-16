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
        className={`relative flex items-center border-b border-border/30 dark:border-border/20 px-3 py-2.5 group hover:bg-accent/5 focus-within:bg-accent/10 transition-colors ${className || ''}`}
      >
        <Search className="h-4 w-4 text-muted-foreground/70 group-hover:text-muted-foreground/90 transition-colors" />
        <Input
          ref={ref}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground/50 px-3 border-0 p-0 focus-visible:ring-0"
          placeholder="搜索或输入命令..."
          value={value}
          aria-label="搜索"
          {...props}
        />
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/70" />}
          {value && !isLoading && onClear && (
            <button
              onClick={onClear}
              className="h-6 w-6 inline-flex items-center justify-center rounded-sm opacity-70 transition-all hover:opacity-100 hover:bg-accent/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              aria-label="清除搜索"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

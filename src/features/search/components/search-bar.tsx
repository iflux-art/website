import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import React, { forwardRef } from "react";

type SearchBarProps = React.ComponentPropsWithoutRef<typeof Input> & {
  isLoading?: boolean;
  onClear?: () => void;
  value?: string;
};

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ isLoading, onClear, className, value, ...props }, ref) => (
    <div
      className={`group relative border-b border-border/30 transition-colors focus-within:bg-accent/15 hover:bg-accent/10 dark:border-border/20 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2">
        <Search className="h-[14px] w-[14px] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground/80" />
      </div>
      <Input
        ref={ref}
        className="w-full rounded-none border-0 bg-transparent px-2.5 py-2 pl-8 text-[15px] shadow-none outline-none placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        placeholder="搜索或输入命令..."
        value={value}
        aria-label="搜索"
        {...props}
      />
      <div className="absolute top-1/2 right-2.5 flex -translate-y-1/2 items-center gap-2">
        {isLoading && (
          <Loader2 className="h-[14px] w-[14px] animate-spin text-muted-foreground/60" />
        )}
        {value && !isLoading && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-5 w-5 items-center justify-center rounded-sm opacity-60 transition-all hover:bg-accent/50 hover:opacity-100 focus:ring-1 focus:ring-ring focus:outline-none"
            aria-label="清除搜索"
          >
            <X className="h-[14px] w-[14px]" />
          </button>
        )}
      </div>
    </div>
  )
);

SearchBar.displayName = "SearchBar";

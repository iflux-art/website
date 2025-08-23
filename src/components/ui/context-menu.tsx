'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

/**
 * 简化的右键菜单实现
 * 基于原生 onContextMenu 事件和定位
 */

interface ContextMenuState {
  isOpen: boolean;
  position: { x: number; y: number };
}

const ContextMenuContext = React.createContext<{
  state: ContextMenuState;
  setState: React.Dispatch<React.SetStateAction<ContextMenuState>>;
} | null>(null);

export const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = React.useState<ContextMenuState>({
    isOpen: false,
    position: { x: 0, y: 0 },
  });

  // 点击外部关闭菜单
  React.useEffect(() => {
    const handleClickOutside = () => {
      setState(prev => ({ ...prev, isOpen: false }));
    };

    if (state.isOpen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('contextmenu', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
        document.removeEventListener('contextmenu', handleClickOutside);
      };
    }
    
    return undefined;
  }, [state.isOpen]);

  return (
    <ContextMenuContext.Provider value={{ state, setState }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export const ContextMenuTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(ContextMenuContext);
  if (!context) throw new Error('ContextMenuTrigger must be used within ContextMenu');

  const { setState } = context;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setState({
      isOpen: true,
      position: { x: e.clientX, y: e.clientY },
    });
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<unknown>,
      {
        onContextMenu: handleContextMenu,
        ...props,
      } as React.HTMLAttributes<HTMLElement>
    );
  }

  return (
    <div ref={ref} className={cn('', className)} onContextMenu={handleContextMenu} {...props}>
      {children}
    </div>
  );
});
ContextMenuTrigger.displayName = 'ContextMenuTrigger';

export const ContextMenuContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(ContextMenuContext);
  if (!context) throw new Error('ContextMenuContent must be used within ContextMenu');

  const { state } = context;

  if (!state.isOpen) return null;

  return createPortal(
    <div
      ref={ref}
      className={cn(
        'animate-in fade-in-80 zoom-in-95 fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        className
      )}
      style={{
        left: Math.min(state.position.x, window.innerWidth - 200),
        top: Math.min(state.position.y, window.innerHeight - 300),
      }}
      {...props}
    >
      {children}
    </div>,
    document.body
  );
});
ContextMenuContent.displayName = 'ContextMenuContent';

export const ContextMenuItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    inset?: boolean;
    disabled?: boolean;
  }
>(({ className, inset, disabled, children, onClick, ...props }, ref) => {
  const context = React.useContext(ContextMenuContext);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onClick?.(e);
    // 点击后关闭菜单
    if (context) {
      context.setState(prev => ({ ...prev, isOpen: false }));
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none',
        inset && 'pl-8',
        disabled && 'pointer-events-none opacity-50',
        !disabled &&
          'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
});
ContextMenuItem.displayName = 'ContextMenuItem';

export const ContextMenuSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
));
ContextMenuSeparator.displayName = 'ContextMenuSeparator';

// 为了保持API兼容性，导出一些占位组件
export const ContextMenuLabel = ContextMenuItem;
export const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
    {...props}
  />
);

// 其他组件的占位导出
export const ContextMenuCheckboxItem = ContextMenuItem;
export const ContextMenuRadioItem = ContextMenuItem;
export const ContextMenuGroup = ({ children }: { children: React.ReactNode }) => children;
export const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => children;
export const ContextMenuSub = ({ children }: { children: React.ReactNode }) => children;
export const ContextMenuSubContent = ContextMenuContent;
export const ContextMenuSubTrigger = ContextMenuItem;
export const ContextMenuRadioGroup = ({ children }: { children: React.ReactNode }) => children;

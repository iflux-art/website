'use client';

import * as React from 'react';
import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

/**
 * Command 组件属性
 */
export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Command 对话框组件属性
 */
export interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {}

/**
 * Command 输入框组件属性
 */
export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Command 列表组件属性
 */
export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Command 空状态组件属性
 */
export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Command 分组组件属性
 */
export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

/**
 * Command 分隔线组件属性
 */
export interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Command 项目组件属性
 */
export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

/**
 * Command 快捷键组件属性
 */
export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Command 组件
 * 命令菜单的主容器
 *
 * 基于 Radix UI Dialog 实现，替代 cmdk
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const Command = React.forwardRef<HTMLDivElement, CommandProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground',
      className
    )}
    {...props}
  />
));
Command.displayName = 'Command';

/**
 * CommandDialog 组件
 * 在对话框中显示命令菜单
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg rounded-xl border-border">
        <DialogTitle className="sr-only">搜索</DialogTitle>
        <Command className="[&_[data-group-heading]]:px-2 [&_[data-group-heading]]:font-medium [&_[data-group-heading]]:text-muted-foreground [&_[data-group]:not([hidden])_~[data-group]]:pt-0 [&_[data-group]]:px-2 [&_[data-input-wrapper]_svg]:h-5 [&_[data-input-wrapper]_svg]:w-5 [&_[data-input]]:h-12 [&_[data-item]]:px-2 [&_[data-item]]:py-3 [&_[data-item]_svg]:h-5 [&_[data-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

/**
 * CommandInput 组件
 * 命令菜单的输入框
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandInput = React.forwardRef<HTMLInputElement, CommandInputProps>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center border-b px-4 py-1" data-input-wrapper="">
      <Search className="mr-2 h-5 w-5 shrink-0 opacity-70 text-muted-foreground" />
      <input
        ref={ref}
        className={cn(
          'flex h-12 w-full rounded-md bg-transparent py-3 text-sm font-medium outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
);

CommandInput.displayName = 'CommandInput';

/**
 * CommandList 组件
 * 命令菜单的选项列表容器
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandList = React.forwardRef<HTMLDivElement, CommandListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('max-h-[350px] overflow-y-auto overflow-x-hidden', className)}
      {...props}
    />
  )
);

CommandList.displayName = 'CommandList';

/**
 * CommandEmpty 组件
 * 当没有匹配结果时显示的内容
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandEmpty = React.forwardRef<HTMLDivElement, CommandEmptyProps>((props, ref) => (
  <div
    ref={ref}
    className="py-8 text-center text-sm font-medium text-muted-foreground"
    {...props}
  />
));

CommandEmpty.displayName = 'CommandEmpty';

/**
 * CommandGroup 组件
 * 命令菜单中的选项分组
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('overflow-hidden p-1 text-foreground', className)}
      data-group=""
      {...props}
    >
      {heading && (
        <div
          className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
          data-group-heading=""
        >
          {heading}
        </div>
      )}
      {props.children}
    </div>
  )
);

CommandGroup.displayName = 'CommandGroup';

/**
 * CommandSeparator 组件
 * 命令菜单中的分隔线
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandSeparator = React.forwardRef<HTMLDivElement, CommandSeparatorProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 h-px bg-border', className)} {...props} />
  )
);
CommandSeparator.displayName = 'CommandSeparator';

/**
 * CommandItem 组件
 * 命令菜单中的单个选项
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, onSelect, ...props }, ref) => (
    <div
      ref={ref}
      role="button"
      className={cn(
        'relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm font-medium outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground transition-colors',
        className
      )}
      onClick={onSelect ? () => onSelect(props['data-value'] || '') : undefined}
      data-item=""
      {...props}
    />
  )
);

CommandItem.displayName = 'CommandItem';

/**
 * CommandShortcut 组件
 * 显示命令的键盘快捷键
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CommandShortcut = ({ className, ...props }: CommandShortcutProps) => {
  return (
    <span
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};

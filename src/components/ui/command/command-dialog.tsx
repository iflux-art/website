"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import {
  CommandDialogProps,
  CommandInputProps,
  CommandListProps,
  CommandEmptyProps,
  CommandGroupProps,
  CommandSeparatorProps,
  CommandItemProps,
  CommandShortcutProps
} from "./command.types"

/**
 * Command 组件
 * 命令菜单的主容器
 * 
 * 基于 Radix UI Dialog 实现，替代 cmdk
 */
const Command = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = "Command"

/**
 * CommandDialog 组件
 * 在对话框中显示命令菜单
 */
const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <DialogTitle className="sr-only">搜索</DialogTitle>
        <Command className="[&_[data-group-heading]]:px-2 [&_[data-group-heading]]:font-medium [&_[data-group-heading]]:text-muted-foreground [&_[data-group]:not([hidden])_~[data-group]]:pt-0 [&_[data-group]]:px-2 [&_[data-input-wrapper]_svg]:h-5 [&_[data-input-wrapper]_svg]:w-5 [&_[data-input]]:h-12 [&_[data-item]]:px-2 [&_[data-item]]:py-3 [&_[data-item]_svg]:h-5 [&_[data-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

/**
 * CommandInput 组件
 * 命令菜单的输入框
 */
const CommandInput = React.forwardRef<
  HTMLInputElement,
  CommandInputProps
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" data-input-wrapper="">
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = "CommandInput"

/**
 * CommandList 组件
 * 命令菜单的选项列表容器
 */
const CommandList = React.forwardRef<
  HTMLDivElement,
  CommandListProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = "CommandList"

/**
 * CommandEmpty 组件
 * 当没有匹配结果时显示的内容
 */
const CommandEmpty = React.forwardRef<
  HTMLDivElement,
  CommandEmptyProps
>((props, ref) => (
  <div
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = "CommandEmpty"

/**
 * CommandGroup 组件
 * 命令菜单中的选项分组
 */
const CommandGroup = React.forwardRef<
  HTMLDivElement,
  CommandGroupProps
>(({ className, heading, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-foreground",
      className
    )}
    data-group=""
    {...props}
  >
    {heading && (
      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground" data-group-heading="">
        {heading}
      </div>
    )}
    {props.children}
  </div>
))

CommandGroup.displayName = "CommandGroup"

/**
 * CommandSeparator 组件
 * 命令菜单中的分隔线
 */
const CommandSeparator = React.forwardRef<
  HTMLDivElement,
  CommandSeparatorProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = "CommandSeparator"

/**
 * CommandItem 组件
 * 命令菜单中的单个选项
 */
const CommandItem = React.forwardRef<
  HTMLDivElement,
  CommandItemProps
>(({ className, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    role="button"
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground",
      className
    )}
    onClick={onSelect ? () => onSelect(props['data-value'] || '') : undefined}
    data-item=""
    {...props}
  />
))

CommandItem.displayName = "CommandItem"

/**
 * CommandShortcut 组件
 * 显示命令的键盘快捷键
 */
const CommandShortcut = ({
  className,
  ...props
}: CommandShortcutProps) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

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
}

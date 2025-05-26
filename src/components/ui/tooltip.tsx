'use client';

import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@/lib/utils';

/**
 * tooltip 组件类型定义
 */
export interface TooltipProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> {}
export interface TooltipTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> {}
export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {}
export interface TooltipProviderProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider> {}

/**
 * Tooltip 组件提供者
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip 组件
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * TooltipTrigger 组件
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent 组件
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

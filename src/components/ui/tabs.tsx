'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

/**
 * Tabs 组件属性
 */
export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

/**
 * TabsList 组件属性
 */
export interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * TabsTrigger 组件属性
 */
export interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}

/**
 * TabsContent 组件属性
 */
export interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
  forceMount?: boolean;
}

/**
 * Tabs 组件
 * 用于在同一区域内切换不同内容
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root
    ref={ref}
    className={cn(
      'data-[orientation=vertical]:flex data-[orientation=vertical]:flex-row',
      className
    )}
    {...props}
  />
));
Tabs.displayName = TabsPrimitive.Root.displayName;

/**
 * TabsList 组件
 * 用于包含所有标签触发器
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1.5 text-muted-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * TabsTrigger 组件
 * 用于切换标签内容的按钮
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-md hover:bg-background/80',
        className
      )}
      {...props}
    />
  )
);
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * TabsContent 组件
 * 用于显示标签内容
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 p-1',
        className
      )}
      {...props}
    />
  )
);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };

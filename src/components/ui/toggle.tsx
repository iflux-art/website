'use client';

import * as React from 'react';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { buttonInteractions } from '@/lib/ui-utils';

/**
 * Toggle 组件变体定义
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const toggleVariants = cva(
  `inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background ${buttonInteractions.base} ${buttonInteractions.focus.ring} disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground shadow-sm hover:shadow-md data-[state=on]:shadow-md`,
  {
    variants: {
      variant: {
        default: 'bg-transparent hover:bg-muted hover:text-muted-foreground',
        outline: `border border-input bg-transparent ${buttonInteractions.hover.outline}`,
      },
      size: {
        default: 'h-11 px-4',
        sm: 'h-10 px-3',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

/**
 * Toggle 组件属性
 */
export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggleVariants> {}

/**
 * Toggle 组件
 * 用于切换开关状态
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 *
 * @example
 * <Toggle>点击切换</Toggle>
 *
 * @example
 * <Toggle variant="outline">轮廓样式</Toggle>
 *
 * @example
 * <Toggle size="sm">小尺寸</Toggle>
 */
const Toggle = React.forwardRef<React.ElementRef<typeof TogglePrimitive.Root>, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <TogglePrimitive.Root
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle, toggleVariants };

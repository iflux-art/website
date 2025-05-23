"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

/**
 * Separator 组件
 * 用于分隔内容
 *
 * 已更新为 Tailwind CSS v4 兼容版本，符合 New York 风格
 * 
 * @example
 * <Separator />
 * 
 * @example
 * <Separator orientation="vertical" />
 * 
 * @example
 * <div>
 *   <h2>Section 1</h2>
 *   <p>Content for section 1</p>
 *   <Separator className="my-4" />
 *   <h2>Section 2</h2>
 *   <p>Content for section 2</p>
 * </div>
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }

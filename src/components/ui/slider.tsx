"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/**
 * Slider 组件
 * 用于在一个范围内选择值
 *
 * 已更新为 Tailwind CSS v4 兼容版本，符合 New York 风格
 * 
 * @example
 * <Slider defaultValue={[33]} max={100} step={1} />
 * 
 * @example
 * <Slider defaultValue={[25, 75]} max={100} step={1} />
 */
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className="relative h-2.5 w-full grow overflow-hidden rounded-full bg-secondary shadow-sm"
    >
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {props.defaultValue?.map((_, i) => (
      <SliderPrimitive.Thumb
        key={i}
        className="block h-6 w-6 rounded-full border-2 border-primary bg-background shadow-md ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110"
      />
    ))}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

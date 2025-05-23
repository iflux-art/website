import { cn } from "@/lib/utils"

/**
 * Skeleton 组件
 * 用于在加载状态下显示内容的骨架屏
 *
 * 已更新为 Tailwind CSS v4 兼容版本，符合 New York 风格
 * 
 * @example
 * <Skeleton className="h-12 w-12 rounded-full" />
 * 
 * @example
 * <div className="space-y-2">
 *   <Skeleton className="h-6 w-1/2" />
 *   <Skeleton className="h-4 w-full" />
 *   <Skeleton className="h-4 w-4/5" />
 * </div>
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted/60", className)}
      {...props}
    />
  )
}

export { Skeleton }

import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image";
import { AvatarProps, AvatarImageProps, AvatarFallbackProps } from "./avatar.types";

const NextImage = Image;

/**
 * Avatar 组件
 * 用于显示用户头像
 *
 * @example
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="用户头像" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 *
 * @example
 * // 简化用法
 * <Avatar src="https://example.com/avatar.jpg" alt="用户头像" />
 */
const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {src ? (
        <NextImage
          src={src}
          alt={alt || "avatar"}
          width={32}
          height={32}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {fallback || (
            <span className="text-xs font-medium uppercase text-muted-foreground">
              {alt ? alt.charAt(0) : "U"}
            </span>
          )}
        </span>
      )}
    </span>
  )
)
Avatar.displayName = "Avatar"

/**
 * AvatarImage 组件
 * 用于显示头像图片
 */
const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, ...props }, ref) => (
    <NextImage
      ref={ref}
      width={32}
      height={32}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
)
AvatarImage.displayName = "AvatarImage"

/**
 * AvatarFallback 组件
 * 当头像图片加载失败或不存在时显示的备用内容
 */
const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
)
AvatarFallback.displayName = "AvatarFallback"

export { Avatar, AvatarImage, AvatarFallback }
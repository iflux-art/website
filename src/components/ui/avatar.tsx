"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Image from "next/image";

const NextImage = Image;

/**
 * 头像组件属性
 */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * 头像图片地址
   */
  src?: string;
  
  /**
   * 头像替代文本
   */
  alt?: string;
  
  /**
   * 当图片加载失败或没有图片时显示的内容
   */
  fallback?: React.ReactNode;
}

/**
 * 头像图片组件属性
 */
export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

/**
 * 头像备用内容组件属性
 */
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Avatar 组件
 * 用于显示用户头像
 *
 * 已更新为 Tailwind CSS v4 兼容版本
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
 *
 * 已更新为 Tailwind CSS v4 兼容版本
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
 *
 * 已更新为 Tailwind CSS v4 兼容版本
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

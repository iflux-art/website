'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * 卡片组件属性
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片头部组件属性
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片标题组件属性
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * 卡片描述组件属性
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * 卡片内容组件属性
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * 卡片底部组件属性
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Card 组件
 * 用于创建卡片容器
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 *
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>标题</CardTitle>
 *     <CardDescription>描述</CardDescription>
 *   </CardHeader>
 *   <CardContent>内容</CardContent>
 *   <CardFooter>底部</CardFooter>
 * </Card>
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl border bg-card text-card-foreground shadow-md transition-all duration-300 hover:shadow-lg',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

/**
 * CardHeader 组件
 * 用于创建卡片的头部区域
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-2 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

/**
 * CardTitle 组件
 * 用于创建卡片的标题
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription 组件
 * 用于创建卡片的描述文本
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

/**
 * CardContent 组件
 * 用于创建卡片的主要内容区域
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

/**
 * CardFooter 组件
 * 用于创建卡片的底部区域
 *
 * 已更新为 Tailwind CSS v4 兼容版本
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };

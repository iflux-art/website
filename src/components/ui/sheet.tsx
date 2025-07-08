"use client";

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Sheet 变体定义
 */
const sheetVariants = cva(
  "fixed z-50 gap-5 bg-background p-8 shadow-xl transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
        fullscreen:
          "inset-0 w-full h-full border-none data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
);

/**
 * Sheet 组件属性
 */
export type SheetProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Root
>;

/**
 * Sheet 触发器组件属性
 */
export type SheetTriggerProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Trigger
>;

/**
 * Sheet 关闭按钮组件属性
 */
export type SheetCloseProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Close
>;

/**
 * Sheet 传送门组件属性
 */
export type SheetPortalProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Portal
>;

/**
 * Sheet 遮罩层组件属性
 */
export type SheetOverlayProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Overlay
>;

/**
 * Sheet 内容组件属性
 */
export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

/**
 * Sheet 头部组件属性
 */
export type SheetHeaderProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Sheet 底部组件属性
 */
export type SheetFooterProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Sheet 标题组件属性
 */
export type SheetTitleProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Title
>;

/**
 * Sheet 描述组件属性
 */
export type SheetDescriptionProps = React.ComponentPropsWithoutRef<
  typeof SheetPrimitive.Description
>;

/**
 * Sheet 组件
 * 用于创建从屏幕边缘滑入的面板
 *
 * @example
 * <Sheet>
 *   <SheetTrigger>打开</SheetTrigger>
 *   <SheetContent>
 *     <SheetHeader>
 *       <SheetTitle>标题</SheetTitle>
 *       <SheetDescription>描述</SheetDescription>
 *     </SheetHeader>
 *     <div>内容</div>
 *     <SheetFooter>
 *       <Button>确认</Button>
 *     </SheetFooter>
 *   </SheetContent>
 * </Sheet>
 */
const Sheet = SheetPrimitive.Root;

/**
 * SheetTrigger 组件
 * 用于触发 Sheet 的打开
 */
const SheetTrigger = SheetPrimitive.Trigger;

/**
 * SheetClose 组件
 * 用于关闭 Sheet
 */
const SheetClose = SheetPrimitive.Close;

/**
 * SheetPortal 组件
 * 用于将 Sheet 内容渲染到 DOM 的其他部分
 */
const SheetPortal = SheetPrimitive.Portal;

/**
 * SheetOverlay 组件
 * Sheet 的背景遮罩层
 */
const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Overlay
      className={cn(
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/80",
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
);
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

/**
 * SheetContent 组件
 * Sheet 的主要内容区域
 */
const SheetContent = React.forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute top-5 right-5 rounded-lg p-2 opacity-70 shadow-sm ring-offset-background transition-all duration-300 hover:bg-muted hover:opacity-100 hover:shadow-md focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-5 w-5" />
          <span className="sr-only">关闭</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  ),
);
SheetContent.displayName = SheetPrimitive.Content.displayName;

/**
 * SheetHeader 组件
 * Sheet 的头部区域
 */
const SheetHeader = ({ className, ...props }: SheetHeaderProps) => (
  <div
    className={cn(
      "mb-3 flex flex-col space-y-3 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

/**
 * SheetFooter 组件
 * Sheet 的底部区域
 */
const SheetFooter = ({ className, ...props }: SheetFooterProps) => (
  <div
    className={cn(
      "mt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3",
      className,
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

/**
 * SheetTitle 组件
 * Sheet 的标题
 */
const SheetTitle = React.forwardRef<HTMLHeadingElement, SheetTitleProps>(
  ({ className, ...props }, ref) => (
    <SheetPrimitive.Title
      ref={ref}
      className={cn(
        "text-xl font-semibold tracking-tight text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
SheetTitle.displayName = SheetPrimitive.Title.displayName;

/**
 * SheetDescription 组件
 * Sheet 的描述文本
 */
const SheetDescription = React.forwardRef<
  HTMLParagraphElement,
  SheetDescriptionProps
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn(
      "mt-1 text-sm leading-relaxed text-muted-foreground",
      className,
    )}
    {...props}
  />
));
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  sheetVariants,
};

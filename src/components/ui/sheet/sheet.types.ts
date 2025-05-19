/**
 * sheet 组件类型定义
 */

import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { VariantProps } from "class-variance-authority";
import { sheetVariants } from "./sheet";

export interface SheetProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Root> {}

export interface SheetTriggerProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Trigger> {}

export interface SheetCloseProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Close> {}

export interface SheetPortalProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Portal> {}

export interface SheetOverlayProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay> {}

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface SheetTitleProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title> {}

export interface SheetDescriptionProps extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description> {}

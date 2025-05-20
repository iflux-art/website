/**
 * command 组件类型定义
 */

import * as React from "react";
import { DialogProps } from "@radix-ui/react-dialog";

export interface CommandProps extends React.HTMLAttributes<HTMLDivElement> {}

export type CommandDialogProps = DialogProps;

export interface CommandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export interface CommandListProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CommandEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: React.ReactNode;
}

export interface CommandSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CommandItemProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

export interface CommandShortcutProps extends React.HTMLAttributes<HTMLSpanElement> {}

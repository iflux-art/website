/**
 * toggle 组件类型定义
 */

import React from "react";
import { VariantProps } from "class-variance-authority";
import { toggleVariants } from "./toggle";

export interface ToggleProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

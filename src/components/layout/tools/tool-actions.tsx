"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import type { ToolActionsProps } from "@/types/layout-tools-types";

export function ToolActions({ actions, className = "" }: ToolActionsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant || "default"}
            disabled={action.disabled}
            className="flex items-center gap-2"
          >
            {Icon && <Icon className="h-4 w-4" />}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

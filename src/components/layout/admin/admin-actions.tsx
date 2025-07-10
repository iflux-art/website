import React from "react";
import { Button } from "@/components/ui/button";
import type { AdminActionsProps } from "@/types/admin-types";

export function AdminActions({ actions, className = "" }: AdminActionsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <Button
            key={index}
            variant={action.variant || "default"}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            className="flex items-center gap-2"
            type="button"
          >
            {action.loading ? (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              IconComponent && <IconComponent className="h-4 w-4" />
            )}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

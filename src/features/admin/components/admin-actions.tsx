"use client";

import { Button } from "@/components/ui/button";
import type { AdminAction } from "@/features/admin/types";
import React from "react";

export const AdminActions = ({
  actions,
  className = "",
}: {
  actions: (Omit<AdminAction, "icon"> & {
    icon?: React.ComponentType<{ className?: string }>;
  })[];
  className?: string;
}) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {actions.map(action => {
      const IconComponent = action.icon;
      return (
        <Button
          key={action.label}
          variant={action.variant ?? "default"}
          onClick={action.onClick}
          disabled={action.disabled ?? action.loading}
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

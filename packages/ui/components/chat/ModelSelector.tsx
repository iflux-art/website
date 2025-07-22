import React from "react";
import { Button } from "packages/ui/components/shared-ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "packages/utils";
import type { AIModel } from "packages/config/chat/ai-models";
export interface ModelSelectorProps {
  selectedModelId: string;
  onSelect: (id: string) => void;
  AI_MODELS: AIModel[];
  className?: string;
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "packages/ui/components/shared-ui/dropdown-menu";

export function ModelSelector({
  selectedModelId,
  onSelect,
  AI_MODELS,
  className,
}: ModelSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex h-8 items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground",
            className,
          )}
        >
          <span className="hidden sm:inline">
            {AI_MODELS.find((m) => m.id === selectedModelId)?.name ||
              "选择模型"}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-96 w-56 overflow-y-auto">
        <div className="px-2 py-1 text-xs font-medium text-muted-foreground">
          选择AI模型
        </div>
        {AI_MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => onSelect(model.id)}
            className={cn(
              "flex flex-col items-start px-2 py-2",
              selectedModelId === model.id && "bg-accent",
            )}
          >
            <div className="w-full font-medium">{model.name}</div>
            <div className="w-full text-xs text-muted-foreground">
              {model.description}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

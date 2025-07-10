import { ToolCard } from "./tool-card";
import type { Tool } from "@/types/tools-types";

export function ToolCardComponent({
  tool,
  onTagClick,
}: {
  tool: Tool;
  onTagClick: (tag: string) => void;
}) {
  return (
    <ToolCard
      title={tool.name}
      description={tool.description}
      href={tool.path}
      tags={tool.tags}
      isExternal={!tool.isInternal}
      onTagClick={onTagClick}
    />
  );
}

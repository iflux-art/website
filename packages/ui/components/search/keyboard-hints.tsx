import React from "react";

export function KeyboardHints() {
  return (
    <div className="flex items-center justify-between border-t p-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>导航:</span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">↑</kbd>
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">↓</kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>选择:</span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">Enter</kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>关闭:</span>
        <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px]">Esc</kbd>
      </div>
    </div>
  );
}

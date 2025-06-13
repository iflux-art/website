
import React from 'react';

export function KeyboardHints() {
  return (
    <div className="border-t p-2 text-xs text-muted-foreground flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>导航:</span>
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>选择:</span>
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd>
      </div>
      <div className="flex items-center gap-2">
        <span>关闭:</span>
        <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd>
      </div>
    </div>
  );
}

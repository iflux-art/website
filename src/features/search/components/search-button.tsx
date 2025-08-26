"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "./search-dialog";

/**
 * 搜索图标组件
 * 点击后打开搜索对话框
 */
export const SearchButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={() => setOpen(true)}
        aria-label="搜索"
        title="搜索（Ctrl + K）"
      >
        <Search className="h-5 w-5" />
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMounted } from "@/hooks";
import { Menu } from "lucide-react";
import { useState } from "react";
import { NavCardMenu } from "./nav-card-menu";

export const HamburgerMenu = () => {
  const isMounted = useMounted();
  const [open, setOpen] = useState(false);

  // 关闭对话框的回调函数
  const handleClose = () => {
    setOpen(false);
  };

  // 在服务器端渲染时，只显示按钮，不显示 Dialog
  if (!isMounted) {
    return (
      <Button variant="ghost" size="icon" aria-label="打开菜单" title="打开菜单" disabled>
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="打开菜单" title="打开菜单">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md p-4 max-h-[85vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="mb-4">
          <DialogTitle className="sr-only">导航菜单</DialogTitle>
        </DialogHeader>
        <NavCardMenu className="p-4" onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

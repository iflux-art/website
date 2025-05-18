"use client"

import * as React from "react";
import { TramFront } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { pulse, iconSpin } from "@/lib/animations";

/**
 * 开往组件，点击跳转到开往友链接力
 */
export function Travelling() {
  return (
    <Button
      variant="ghost"
      size="icon"
      title="开往"
      onClick={() => window.open("https://www.travellings.cn/go.html", "_blank")}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        whileHover={iconSpin}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <TramFront 
          className="h-[1.1rem] w-[1.1rem]"
        />
      </motion.div>
      <span className="sr-only">开往</span>
    </Button>
  )
}
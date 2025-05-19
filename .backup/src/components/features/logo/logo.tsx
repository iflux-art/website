"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { logoAnimation } from "@/lib/animations";

export function Logo() {
  return (
    <Link href="/" className="inline-block">
      <motion.h2 
        className="text-sm sm:text-md md:text-lg font-bold font-code hover:text-primary transition-colors"
        initial="initial"
        animate="animate"
        whileHover="hover"
        variants={logoAnimation}
      >
        iFluxArt
      </motion.h2>
    </Link>
  );
}
  
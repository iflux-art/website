"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
}

export function FeatureCard({ href, title, description }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className="border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50 text-center"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h2 className="text-xl font-semibold mb-2">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </motion.div>
    </Link>
  );
}
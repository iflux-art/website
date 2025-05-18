"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface FeatureCardProps {
  href: string;
  title: {
    zh: string;
    en: string;
  };
  description: {
    zh: string;
    en: string;
  };
  lang: string;
}

export function FeatureCard({ href, title, description, lang }: FeatureCardProps) {
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
          {title[lang as keyof typeof title]}
        </h2>
        <p className="text-muted-foreground">
          {description[lang as keyof typeof description]}
        </p>
      </motion.div>
    </Link>
  );
}
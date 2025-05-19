"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { hoverScale, buttonTap } from "@/lib/animations";

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  index?: number;
}

export function FeatureCard({ href, title, description, index = 0 }: FeatureCardProps) {
  return (
    <ScrollAnimation 
      type="fadeIn"
      delay={index * 0.1}
      className="border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50 text-center"
    >
      <Link href={href}>
        <motion.div
          whileHover={hoverScale}
          whileTap={buttonTap}
        >
          <h2 className="text-xl font-semibold mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground">
            {description}
          </p>
        </motion.div>
      </Link>
    </ScrollAnimation>
  );
}
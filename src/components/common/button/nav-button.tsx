import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface NavButtonProps {
  href: string;
  icon?: LucideIcon;
  variant?: "default" | "secondary" | "ghost" | "outline";
  active?: boolean;
  children?: React.ReactNode;
}

export function NavButton({
  href,
  icon: Icon,
  variant = "default",
  active = false,
  children,
}: NavButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: active ? "default" : variant }),
        "gap-2",
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </Link>
  );
}

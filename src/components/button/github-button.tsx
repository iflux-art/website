"use client";

import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const GITHUB_URL = "https://github.com/iflux-art";

export const GitHubButton = () => {
  const handleClick = () => {
    window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      title="GitHub"
      onClick={handleClick}
      aria-label="GitHub"
    >
      <Github className="h-4 w-4" />
      <span className="sr-only">GitHub</span>
    </Button>
  );
};

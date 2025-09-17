"use client";

import { TramFront } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRAVEL_URL = "https://www.travellings.cn/go.html";

export const TravelButton = () => {
  const handleClick = () => {
    window.open(TRAVEL_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      title="开往"
      onClick={handleClick}
      aria-label="开往"
    >
      <TramFront className="h-4 w-4" />
      <span className="sr-only">开往</span>
    </Button>
  );
};

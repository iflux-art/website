import React from "react";
import { AppGrid } from "@/components/layout/app-grid";
import { LinkCard } from "@/components/card/link-card";
import { LinksItem } from "@/features/links/types";
import profileData from "@/content/links/profile.json";

export default function AboutPage() {
  const profileItems: LinksItem[] = profileData.map((item) => ({
    ...item,
    category: item.category as any,
    iconType: (item as any).iconType || ("image" as const),
  }));

  return (
    <div className="container mx-auto py-8">
      {profileItems.length > 0 && (
        <AppGrid columns={5} className="items-stretch">
          {profileItems.map((item) => (
            <LinkCard
              key={item.id}
              title={item.title}
              description={item.description || item.url}
              href={item.url}
              icon={item.icon}
              iconType={item.iconType as "image" | "text" | undefined}
              isExternal={true}
              className="h-full"
            />
          ))}
        </AppGrid>
      )}
    </div>
  );
}

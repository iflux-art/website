"use client";

import React from "react";
import { Resource, ResourceCard } from "./resource-card";

interface ResourceListProps {
  resources: Resource[];
  emptyMessage?: string;
}

/**
 * 资源列表组件
 * 用于在导航页面中显示资源列表，支持空状态
 */
export function ResourceList({ resources, emptyMessage = "没有找到相关资源" }: ResourceListProps) {
  if (resources.length === 0) {
    return (
      <div className="text-center py-10">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resources.map((resource, index) => (
        <ResourceCard key={index} resource={resource} index={index} />
      ))}
    </div>
  );
}
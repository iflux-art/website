"use client";

import type { LinksItem } from "@/features/links/types";
import type { FriendsPageConfig, FriendLinkRequirement } from "@/features/friends/types";
import { useCallback, useMemo } from "react";
import { useFriendsStore } from "@/stores";
import {
  DEFAULT_FRIENDS_CONFIG,
  FRIEND_LINK_REQUIREMENTS,
  processFriendsData,
} from "@/features/friends/lib";

export interface UseFriendsStateReturn {
  // 数据状态 (来自 Zustand)
  friendsItems: LinksItem[];
  loading: boolean;
  error: string | null;
  config: FriendsPageConfig;
  requirements: FriendLinkRequirement[];
  searchTerm: string;

  // 计算后的数据
  filteredFriendsItems: LinksItem[];

  // Actions (来自 Zustand)
  setFriendsItems: (items: LinksItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConfig: (config: FriendsPageConfig) => void;
  setRequirements: (requirements: FriendLinkRequirement[]) => void;
  setSearchTerm: (term: string) => void;
  resetFriendsState: () => void;

  // 自定义方法
  loadFriendsData: (friendsData: unknown[]) => void;
  updateConfig: (config: Partial<FriendsPageConfig>) => void;
  hasFriendsData: () => boolean;
}

/**
 * Friends状态管理Hook (使用 Zustand)
 * 封装了友链模块的所有状态管理和数据处理逻辑
 */
export function useFriendsState(): UseFriendsStateReturn {
  // 从 Zustand store 获取状态和 actions
  const {
    friendsItems,
    loading,
    error,
    config,
    requirements,
    searchTerm,
    setFriendsItems,
    setLoading,
    setError,
    setConfig,
    setRequirements,
    setSearchTerm,
    resetFriendsState,
  } = useFriendsStore();

  // 加载友链数据
  const loadFriendsData = useCallback(
    (friendsData: unknown[]) => {
      try {
        setLoading(true);
        setError(null);

        // 处理友链数据
        const processedItems: LinksItem[] = processFriendsData(friendsData);

        // 更新 Zustand 状态
        setFriendsItems(processedItems);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to load friends data";
        setError(errorMessage);
        setFriendsItems([]);
      } finally {
        setLoading(false);
      }
    },
    [setFriendsItems, setLoading, setError]
  );

  // 更新配置
  const updateConfig = useCallback(
    (partialConfig: Partial<FriendsPageConfig>) => {
      const newConfig: FriendsPageConfig = {
        ...DEFAULT_FRIENDS_CONFIG,
        ...config,
        ...partialConfig,
        application: {
          ...DEFAULT_FRIENDS_CONFIG.application,
          ...config.application,
          ...partialConfig.application,
        },
      };

      setConfig(newConfig);

      // 如果有新的要求配置，更新要求状态
      if (partialConfig.requirements) {
        setRequirements(partialConfig.requirements);
      } else if (config.requirements.length === 0) {
        // 如果当前没有要求且没有提供新的要求，使用默认要求
        setRequirements(FRIEND_LINK_REQUIREMENTS);
      }
    },
    [config, setConfig, setRequirements]
  );

  // 检查是否有友链数据
  const hasFriendsData = useCallback(() => {
    return friendsItems.length > 0;
  }, [friendsItems]);

  // 过滤友链项目
  const filteredFriendsItems = useMemo(() => {
    if (!searchTerm) {
      return friendsItems;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return friendsItems.filter(
      item =>
        item.title.toLowerCase().includes(lowerSearchTerm) ||
        item.description?.toLowerCase().includes(lowerSearchTerm) ||
        item.url.toLowerCase().includes(lowerSearchTerm)
    );
  }, [friendsItems, searchTerm]);

  return {
    // 数据状态
    friendsItems,
    loading,
    error,
    config,
    requirements,
    searchTerm,

    // 计算后的数据
    filteredFriendsItems,

    // Actions
    setFriendsItems,
    setLoading,
    setError,
    setConfig,
    setRequirements,
    setSearchTerm,
    resetFriendsState,

    // 自定义方法
    loadFriendsData,
    updateConfig,
    hasFriendsData,
  };
}

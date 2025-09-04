"use client";

import type {
  FriendLink,
  FriendsPageConfig,
  FriendLinkRequirement,
} from "@/features/friends/types";
import { useCallback, useMemo } from "react";
import { useFriendsStore } from "@/stores";
import {
  DEFAULT_FRIENDS_CONFIG,
  FRIEND_LINK_REQUIREMENTS,
  processFriendsData,
} from "@/features/friends/lib";
// 导入新的工具函数
import {
  createStandardStateActions,
  createFilteredStateManager,
  createConfigManager,
} from "@/utils/state";
// 导入API服务
import { friendsApi } from "@/lib/api/api-client";

export interface UseFriendsStateV2Return {
  // 数据状态
  friendsItems: FriendLink[];
  loading: boolean;
  error: string | null;
  config: FriendsPageConfig;
  requirements: FriendLinkRequirement[];
  searchTerm: string;

  // 计算后的数据
  filteredFriendsItems: FriendLink[];

  // Actions (来自 Zustand)
  setFriendsItems: (items: FriendLink[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConfig: (config: FriendsPageConfig) => void;
  setRequirements: (requirements: FriendLinkRequirement[]) => void;
  setSearchTerm: (term: string) => void;
  resetState: () => void;

  // 自定义方法
  loadFriendsData: () => void;
  updateConfig: (partialConfig: Partial<FriendsPageConfig>) => void;
  hasFriendsData: () => boolean;
}

/**
 * Friends状态管理Hook V2 (使用 Zustand)
 * 封装了友链模块的所有状态管理和数据处理逻辑
 * 使用了新的工具函数和API客户端
 */
export function useFriendsStateV2(): UseFriendsStateV2Return {
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
    resetState,
  } = useFriendsStore();

  // 创建标准化的状态操作函数
  const stateActions = createStandardStateActions<FriendLink[]>(
    setLoading,
    setError,
    setFriendsItems
  );

  // 创建过滤管理器
  const filterManager = createFilteredStateManager<FriendLink>(friendsItems, (item, searchTerm) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(lowerSearchTerm) ||
      item.description?.toLowerCase().includes(lowerSearchTerm) ||
      item.url.toLowerCase().includes(lowerSearchTerm)
    );
  });

  // 创建配置管理器
  const configManager = createConfigManager<FriendsPageConfig>(
    DEFAULT_FRIENDS_CONFIG,
    config,
    setConfig
  );

  // 加载友链数据
  const loadFriendsData = useCallback(() => {
    void stateActions.loadData(
      async () => {
        // 从API获取数据
        const friendsData = await friendsApi.getFriends();
        if (!friendsData) {
          throw new Error("获取友链数据失败");
        }

        // 处理友链数据
        const processedItems: FriendLink[] = processFriendsData(friendsData);
        return processedItems;
      },
      {
        onError: () => {
          setFriendsItems([]);
        },
        contentType: "links",
      }
    );
  }, [stateActions, setFriendsItems]);

  // 更新配置
  const updateConfig = useCallback(
    (partialConfig: Partial<FriendsPageConfig>) => {
      configManager.updateConfig(partialConfig);

      // 如果有新的要求配置，更新要求状态
      if (partialConfig.requirements) {
        setRequirements(partialConfig.requirements);
      } else if (config.requirements.length === 0) {
        // 如果当前没有要求且没有提供新的要求，使用默认要求
        setRequirements(FRIEND_LINK_REQUIREMENTS);
      }
    },
    [configManager, config, setRequirements]
  );

  // 检查是否有友链数据
  const hasFriendsData = useCallback(() => {
    return filterManager.hasData();
  }, [filterManager]);

  // 过滤友链项目
  const filteredFriendsItems = useMemo(() => {
    return filterManager.filterItems(searchTerm);
  }, [filterManager, searchTerm]);

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
    resetState,

    // 自定义方法
    loadFriendsData,
    updateConfig,
    hasFriendsData,
  };
}

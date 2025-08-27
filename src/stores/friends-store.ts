import { create } from "zustand";
import type { LinksItem } from "@/features/links/types";
import type { FriendsPageConfig, FriendLinkRequirement } from "@/features/friends/types";

interface FriendsState {
  // 数据状态
  friendsItems: LinksItem[];
  loading: boolean;
  error: string | null;

  // 配置状态
  config: FriendsPageConfig;
  requirements: FriendLinkRequirement[];

  // 过滤状态
  searchTerm: string;

  // Actions
  setFriendsItems: (items: LinksItem[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConfig: (config: FriendsPageConfig) => void;
  setRequirements: (requirements: FriendLinkRequirement[]) => void;
  setSearchTerm: (term: string) => void;
  resetFriendsState: () => void;
}

export const useFriendsStore = create<FriendsState>(set => ({
  // 初始状态
  friendsItems: [],
  loading: false,
  error: null,
  config: {
    application: {
      formUrl: "",
      title: "",
      description: "",
    },
    requirements: [],
    showComments: true,
  },
  requirements: [],
  searchTerm: "",

  // Actions
  setFriendsItems: items => set({ friendsItems: items }),
  setLoading: loading => set({ loading }),
  setError: error => set({ error }),
  setConfig: config => set({ config }),
  setRequirements: requirements => set({ requirements }),
  setSearchTerm: term => set({ searchTerm: term }),
  resetFriendsState: () =>
    set({
      friendsItems: [],
      loading: false,
      error: null,
      config: {
        application: {
          formUrl: "",
          title: "",
          description: "",
        },
        requirements: [],
        showComments: true,
      },
      requirements: [],
      searchTerm: "",
    }),
}));

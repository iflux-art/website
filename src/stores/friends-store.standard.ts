import { create } from "zustand";
import type {
  FriendLink,
  FriendsPageConfig,
  FriendLinkRequirement,
} from "@/features/friends/types";

// 状态接口
export interface FriendsState {
  // 数据状态
  friendsItems: FriendLink[];
  loading: boolean;
  error: string | null;

  // 配置状态
  config: FriendsPageConfig;
  requirements: FriendLinkRequirement[];

  // 过滤状态
  searchTerm: string;
}

// 动作接口
export interface FriendsActions {
  setFriendsItems: (items: FriendLink[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConfig: (config: FriendsPageConfig) => void;
  setRequirements: (requirements: FriendLinkRequirement[]) => void;
  setSearchTerm: (term: string) => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type FriendsDerivedState = Record<never, never>;

// 完整的Store接口
export interface FriendsStore extends FriendsState, FriendsActions {}

// 初始状态
export const initialState: FriendsState = {
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
};

// 创建函数
export const createFriendsStore = () => {
  return create<FriendsStore>()((set, _get) => ({
    // ...initialState,
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
    resetState: () => set({ ...initialState }),
  }));
};

// 默认导出store实例
export const useFriendsStore = createFriendsStore();

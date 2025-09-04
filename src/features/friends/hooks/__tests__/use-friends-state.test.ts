import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { FriendLink } from "@/features/friends/types";
import { useFriendsState } from "../use-friends-state";

// Mock 数据
const mockFriendsData = [
  {
    id: "1",
    title: "Friend Site 1",
    description: "A friend's website",
    url: "https://friend1.com",
    icon: "F1",
    iconType: "text",
    category: "friends",
    tags: [],
    featured: false,
  },
  {
    id: "2",
    title: "Friend Site 2",
    description: "Another friend's website",
    url: "https://friend2.com",
    icon: "F2",
    iconType: "text",
    category: "friends",
    tags: [],
    featured: false,
  },
];

const mockFriendsItems: FriendLink[] = [
  {
    id: "1",
    title: "Friend Site 1",
    description: "A friend's website",
    url: "https://friend1.com",
    icon: "F1",
    iconType: "text",
    category: "friends",
    tags: [],
    featured: false,
  },
  {
    id: "2",
    title: "Friend Site 2",
    description: "Another friend's website",
    url: "https://friend2.com",
    icon: "F2",
    iconType: "text",
    category: "friends",
    tags: [],
    featured: false,
  },
];

describe("useFriendsState", () => {
  beforeEach(() => {
    // 重置所有 mocks
    vi.resetAllMocks();
  });

  it("应该返回初始状态", () => {
    const { result } = renderHook(() => useFriendsState());

    expect(result.current.friendsItems).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredFriendsItems).toEqual([]);
  });

  it("应该能够加载友链数据", () => {
    const { result } = renderHook(() => useFriendsState());

    // 加载友链数据
    act(() => {
      result.current.loadFriendsData(mockFriendsData);
    });

    // 验证状态更新
    expect(result.current.friendsItems).toEqual(mockFriendsItems);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("应该能够设置搜索词", () => {
    const { result } = renderHook(() => useFriendsState());

    // 设置搜索词
    act(() => {
      result.current.setSearchTerm("Friend Site 1");
    });

    // 验证状态更新
    expect(result.current.searchTerm).toBe("Friend Site 1");
  });

  it("应该能够根据搜索词过滤友链项目", () => {
    const { result } = renderHook(() => useFriendsState());

    // 加载友链数据
    act(() => {
      result.current.loadFriendsData(mockFriendsData);
    });

    // 设置搜索词
    act(() => {
      result.current.setSearchTerm("Friend Site 1");
    });

    // 验证过滤结果
    expect(result.current.filteredFriendsItems).toEqual([mockFriendsItems[0]]);
  });

  it("应该能够检查是否有友链数据", () => {
    const { result } = renderHook(() => useFriendsState());

    // 初始状态应该没有数据
    expect(result.current.hasFriendsData()).toBe(false);

    // 加载友链数据
    act(() => {
      result.current.loadFriendsData(mockFriendsData);
    });

    // 现在应该有数据
    expect(result.current.hasFriendsData()).toBe(true);
  });

  it("应该能够重置状态", () => {
    const { result } = renderHook(() => useFriendsState());

    // 设置一些状态
    act(() => {
      result.current.loadFriendsData(mockFriendsData);
      result.current.setSearchTerm("test");
    });

    // 重置状态
    act(() => {
      result.current.resetState();
    });

    // 验证状态重置
    expect(result.current.friendsItems).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.searchTerm).toBe("");
    expect(result.current.filteredFriendsItems).toEqual([]);
  });
});

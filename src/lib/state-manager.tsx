'use client';

import React, { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

/**
 * 应用程序状态
 */
export interface AppState {
  /**
   * 主题模式
   */
  theme: 'light' | 'dark' | 'system';

  /**
   * 侧边栏是否展开
   */
  sidebarExpanded: boolean;

  /**
   * 已展开的侧边栏项目 ID
   */
  expandedItems: string[];

  /**
   * 当前活动的标题 ID
   */
  activeHeadingId: string | null;

  /**
   * 是否显示目录
   */
  showTableOfContents: boolean;

  /**
   * 是否显示移动端导航
   */
  showMobileNav: boolean;
}

/**
 * 应用程序操作类型
 */
export type AppAction =
  | { type: 'SET_THEME'; payload: AppState['theme'] }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_EXPANDED'; payload: boolean }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'EXPAND_ITEM'; payload: string }
  | { type: 'COLLAPSE_ITEM'; payload: string }
  | { type: 'SET_ACTIVE_HEADING'; payload: string | null }
  | { type: 'TOGGLE_TABLE_OF_CONTENTS' }
  | { type: 'SET_SHOW_TABLE_OF_CONTENTS'; payload: boolean }
  | { type: 'TOGGLE_MOBILE_NAV' }
  | { type: 'SET_SHOW_MOBILE_NAV'; payload: boolean };

/**
 * 应用程序状态上下文
 */
export interface AppStateContextType {
  /**
   * 应用程序状态
   */
  state: AppState;

  /**
   * 分发操作
   */
  dispatch: React.Dispatch<AppAction>;

  /**
   * 设置主题
   */
  setTheme: (theme: AppState['theme']) => void;

  /**
   * 切换侧边栏
   */
  toggleSidebar: () => void;

  /**
   * 设置侧边栏是否展开
   */
  setSidebarExpanded: (expanded: boolean) => void;

  /**
   * 切换项目
   */
  toggleItem: (id: string) => void;

  /**
   * 展开项目
   */
  expandItem: (id: string) => void;

  /**
   * 折叠项目
   */
  collapseItem: (id: string) => void;

  /**
   * 设置活动标题
   */
  setActiveHeading: (id: string | null) => void;

  /**
   * 切换目录
   */
  toggleTableOfContents: () => void;

  /**
   * 设置是否显示目录
   */
  setShowTableOfContents: (show: boolean) => void;

  /**
   * 切换移动端导航
   */
  toggleMobileNav: () => void;

  /**
   * 设置是否显示移动端导航
   */
  setShowMobileNav: (show: boolean) => void;
}

/**
 * 初始状态
 */
const initialState: AppState = {
  theme: 'system',
  sidebarExpanded: true,
  expandedItems: [],
  activeHeadingId: null,
  showTableOfContents: true,
  showMobileNav: false,
};

/**
 * 状态归约器
 */
function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarExpanded: !state.sidebarExpanded };
    case 'SET_SIDEBAR_EXPANDED':
      return { ...state, sidebarExpanded: action.payload };
    case 'TOGGLE_ITEM':
      return {
        ...state,
        expandedItems: state.expandedItems.includes(action.payload)
          ? state.expandedItems.filter((id) => id !== action.payload)
          : [...state.expandedItems, action.payload],
      };
    case 'EXPAND_ITEM':
      return {
        ...state,
        expandedItems: state.expandedItems.includes(action.payload)
          ? state.expandedItems
          : [...state.expandedItems, action.payload],
      };
    case 'COLLAPSE_ITEM':
      return {
        ...state,
        expandedItems: state.expandedItems.filter((id) => id !== action.payload),
      };
    case 'SET_ACTIVE_HEADING':
      return { ...state, activeHeadingId: action.payload };
    case 'TOGGLE_TABLE_OF_CONTENTS':
      return { ...state, showTableOfContents: !state.showTableOfContents };
    case 'SET_SHOW_TABLE_OF_CONTENTS':
      return { ...state, showTableOfContents: action.payload };
    case 'TOGGLE_MOBILE_NAV':
      return { ...state, showMobileNav: !state.showMobileNav };
    case 'SET_SHOW_MOBILE_NAV':
      return { ...state, showMobileNav: action.payload };
    default:
      return state;
  }
}

/**
 * 创建应用程序状态上下文
 */
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

/**
 * 应用程序状态提供者属性
 */
export interface AppStateProviderProps {
  /**
   * 子元素
   */
  children: React.ReactNode;
}

/**
 * 应用程序状态提供者
 */
export function AppStateProvider({ children }: AppStateProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 创建操作函数
  const setTheme = useCallback(
    (theme: AppState['theme']) => dispatch({ type: 'SET_THEME', payload: theme }),
    []
  );

  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);

  const setSidebarExpanded = useCallback(
    (expanded: boolean) => dispatch({ type: 'SET_SIDEBAR_EXPANDED', payload: expanded }),
    []
  );

  const toggleItem = useCallback(
    (id: string) => dispatch({ type: 'TOGGLE_ITEM', payload: id }),
    []
  );

  const expandItem = useCallback(
    (id: string) => dispatch({ type: 'EXPAND_ITEM', payload: id }),
    []
  );

  const collapseItem = useCallback(
    (id: string) => dispatch({ type: 'COLLAPSE_ITEM', payload: id }),
    []
  );

  const setActiveHeading = useCallback(
    (id: string | null) => dispatch({ type: 'SET_ACTIVE_HEADING', payload: id }),
    []
  );

  const toggleTableOfContents = useCallback(
    () => dispatch({ type: 'TOGGLE_TABLE_OF_CONTENTS' }),
    []
  );

  const setShowTableOfContents = useCallback(
    (show: boolean) => dispatch({ type: 'SET_SHOW_TABLE_OF_CONTENTS', payload: show }),
    []
  );

  const toggleMobileNav = useCallback(() => dispatch({ type: 'TOGGLE_MOBILE_NAV' }), []);

  const setShowMobileNav = useCallback(
    (show: boolean) => dispatch({ type: 'SET_SHOW_MOBILE_NAV', payload: show }),
    []
  );

  // 创建上下文值
  const value = useMemo(
    () => ({
      state,
      dispatch,
      setTheme,
      toggleSidebar,
      setSidebarExpanded,
      toggleItem,
      expandItem,
      collapseItem,
      setActiveHeading,
      toggleTableOfContents,
      setShowTableOfContents,
      toggleMobileNav,
      setShowMobileNav,
    }),
    [
      state,
      setTheme,
      toggleSidebar,
      setSidebarExpanded,
      toggleItem,
      expandItem,
      collapseItem,
      setActiveHeading,
      toggleTableOfContents,
      setShowTableOfContents,
      toggleMobileNav,
      setShowMobileNav,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

/**
 * 使用应用程序状态钩子
 */
export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

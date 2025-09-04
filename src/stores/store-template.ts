import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import type { CustomStorageApi } from "@/lib/storage/index";
import { createResetFunction as sharedCreateResetFunction } from "@/utils/store";

// 状态接口
export interface State {
  // 定义状态属性
  example: string;
}

// 动作接口
export interface Actions {
  // 定义动作方法
  setExample: (value: string) => void;
  resetState: () => void;
}

// 派生状态接口 (空类型)
export type DerivedState = Record<never, never>;

// 完整的Store接口
export interface Store extends State, Actions {}

// 初始状态
export const initialState: State = {
  example: "",
};

// 创建标准化的重置函数
export const createResetFunction = sharedCreateResetFunction;

// 创建函数
export const createStore = (storage?: StateStorage | CustomStorageApi) => {
  const resetState = createResetFunction(initialState);

  return storage
    ? create<Store>()(
        persist(
          (set, _get) => ({
            ...initialState,

            // Actions
            setExample: value => set({ example: value }),
            resetState: () => set(resetState()),

            // 派生状态通过getter函数实现
            // get derivedExample() {
            //   return get().example.toUpperCase();
            // }
          }),
          {
            name: "store-name", // 持久化存储的键名
            storage: createJSONStorage(() => storage as StateStorage),
            // partialize: (state) => ({ example: state.example }), // 选择需要持久化的状态
          }
        )
      )
    : create<Store>()((set, _get) => ({
        ...initialState,

        // Actions
        setExample: value => set({ example: value }),
        resetState: () => set(resetState()),

        // 派生状态通过getter函数实现
        // get derivedExample() {
        //   return get().example.toUpperCase();
        // }
      }));
};

// 默认导出不带持久化的store
export const useStore = createStore();

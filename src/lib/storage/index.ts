// 自定义存储API接口定义
export interface CustomStorageApi {
  getItem: (name: string) => string | null | Promise<string | null>;
  setItem: (name: string, value: string) => void | Promise<void>;
  removeItem: (name: string) => void | Promise<void>;
}

// 导出类型
export type { StateStorage } from "zustand/middleware";

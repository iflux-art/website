/**
 * Comment 功能模块统一导出
 */

// 组件导出
export { Greeting, TwikooComment } from "./components";

// 类型导出
export type { GreetingProps, TimeSlot } from "./types";

// 工具函数导出
export {
  GREETINGS_BY_TIME,
  getCurrentTimeSlot,
  getRandomGreeting,
} from "./lib";

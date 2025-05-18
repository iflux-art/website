/**
 * Jest测试环境设置文件
 * 用于配置Jest测试环境，添加必要的全局设置和模拟
 */

// 导入测试库
import '@testing-library/jest-dom';

// 模拟matchMedia，解决JSDOM环境中缺少此API的问题
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// 模拟IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// 抑制控制台错误，使测试输出更清晰
console.error = jest.fn();
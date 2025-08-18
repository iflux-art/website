/**
 * 响应式配置测试
 */

import { vi } from "vitest";
import {
  BREAKPOINTS,
  DEVICE_QUERIES,
  RESPONSIVE_SPACING,
  RESPONSIVE_CONFIG,
  getBreakpointConfig,
  getSpacingConfig,
  getDeviceTypeFromWidth,
  isTouchDevice,
  supportsHover,
} from "../responsive";

describe("响应式配置测试", () => {
  describe("BREAKPOINTS", () => {
    it("应该定义四个标准断点", () => {
      expect(BREAKPOINTS).toHaveProperty("mobile");
      expect(BREAKPOINTS).toHaveProperty("tablet");
      expect(BREAKPOINTS).toHaveProperty("desktop");
      expect(BREAKPOINTS).toHaveProperty("large");
    });

    it("移动端断点应该正确配置", () => {
      expect(BREAKPOINTS.mobile).toEqual({
        min: 0,
        max: 768,
        mediaQuery: "(max-width: 768px)",
      });
    });

    it("平板端断点应该正确配置", () => {
      expect(BREAKPOINTS.tablet).toEqual({
        min: 769,
        max: 1024,
        mediaQuery: "(min-width: 769px) and (max-width: 1024px)",
      });
    });

    it("桌面端断点应该正确配置", () => {
      expect(BREAKPOINTS.desktop).toEqual({
        min: 1025,
        max: 1440,
        mediaQuery: "(min-width: 1025px) and (max-width: 1440px)",
      });
    });

    it("大屏断点应该正确配置", () => {
      expect(BREAKPOINTS.large).toEqual({
        min: 1441,
        max: Infinity,
        mediaQuery: "(min-width: 1441px)",
      });
    });
  });

  describe("DEVICE_QUERIES", () => {
    it("应该包含所有必要的设备查询", () => {
      expect(DEVICE_QUERIES).toHaveProperty("mobile");
      expect(DEVICE_QUERIES).toHaveProperty("tablet");
      expect(DEVICE_QUERIES).toHaveProperty("desktop");
      expect(DEVICE_QUERIES).toHaveProperty("large");
      expect(DEVICE_QUERIES).toHaveProperty("touch");
      expect(DEVICE_QUERIES).toHaveProperty("mouse");
    });

    it("触摸设备查询应该正确", () => {
      expect(DEVICE_QUERIES.touch).toBe("(hover: none) and (pointer: coarse)");
    });

    it("鼠标设备查询应该正确", () => {
      expect(DEVICE_QUERIES.mouse).toBe("(hover: hover) and (pointer: fine)");
    });
  });

  describe("RESPONSIVE_SPACING", () => {
    it("应该为每个设备类型定义间距", () => {
      expect(RESPONSIVE_SPACING).toHaveProperty("mobile");
      expect(RESPONSIVE_SPACING).toHaveProperty("tablet");
      expect(RESPONSIVE_SPACING).toHaveProperty("desktop");
      expect(RESPONSIVE_SPACING).toHaveProperty("large");
    });

    it("移动端间距应该最小", () => {
      const mobile = RESPONSIVE_SPACING.mobile;
      const tablet = RESPONSIVE_SPACING.tablet;

      expect(parseFloat(mobile.xs)).toBeLessThan(parseFloat(tablet.xs));
      expect(parseFloat(mobile.sm)).toBeLessThan(parseFloat(tablet.sm));
      expect(parseFloat(mobile.md)).toBeLessThan(parseFloat(tablet.md));
    });

    it("大屏间距应该最大", () => {
      const desktop = RESPONSIVE_SPACING.desktop;
      const large = RESPONSIVE_SPACING.large;

      expect(parseFloat(large.xs)).toBeGreaterThan(parseFloat(desktop.xs));
      expect(parseFloat(large.sm)).toBeGreaterThan(parseFloat(desktop.sm));
      expect(parseFloat(large.md)).toBeGreaterThan(parseFloat(desktop.md));
    });
  });

  describe("工具函数", () => {
    describe("getBreakpointConfig", () => {
      it("应该返回正确的断点配置", () => {
        const mobileConfig = getBreakpointConfig("mobile");
        expect(mobileConfig).toEqual(BREAKPOINTS.mobile);

        const desktopConfig = getBreakpointConfig("desktop");
        expect(desktopConfig).toEqual(BREAKPOINTS.desktop);
      });
    });

    describe("getSpacingConfig", () => {
      it("应该返回正确的间距配置", () => {
        const mobileSpacing = getSpacingConfig("mobile");
        expect(mobileSpacing).toEqual(RESPONSIVE_SPACING.mobile);

        const largeSpacing = getSpacingConfig("large");
        expect(largeSpacing).toEqual(RESPONSIVE_SPACING.large);
      });
    });

    describe("getDeviceTypeFromWidth", () => {
      it("应该根据宽度正确判断设备类型", () => {
        expect(getDeviceTypeFromWidth(320)).toBe("mobile");
        expect(getDeviceTypeFromWidth(768)).toBe("mobile");
        expect(getDeviceTypeFromWidth(800)).toBe("tablet");
        expect(getDeviceTypeFromWidth(1024)).toBe("tablet");
        expect(getDeviceTypeFromWidth(1200)).toBe("desktop");
        expect(getDeviceTypeFromWidth(1440)).toBe("desktop");
        expect(getDeviceTypeFromWidth(1600)).toBe("large");
      });
    });

    describe("isTouchDevice", () => {
      it("在没有window对象时应该返回false", () => {
        // Mock window.matchMedia
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: vi.fn().mockImplementation((query) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        });

        expect(isTouchDevice()).toBe(false);
      });
    });

    describe("supportsHover", () => {
      it("在没有window对象时应该返回true", () => {
        // Mock window.matchMedia
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: vi.fn().mockImplementation((query) => ({
            matches: true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          })),
        });

        expect(supportsHover()).toBe(true);
      });
    });
  });

  describe("RESPONSIVE_CONFIG", () => {
    it("应该包含所有配置项", () => {
      expect(RESPONSIVE_CONFIG).toHaveProperty("breakpoints");
      expect(RESPONSIVE_CONFIG).toHaveProperty("spacing");
      expect(RESPONSIVE_CONFIG).toHaveProperty("deviceQueries");
    });

    it("配置项应该与单独导出的配置一致", () => {
      expect(RESPONSIVE_CONFIG.breakpoints).toEqual(BREAKPOINTS);
      expect(RESPONSIVE_CONFIG.spacing).toEqual(RESPONSIVE_SPACING);
      expect(RESPONSIVE_CONFIG.deviceQueries).toEqual(DEVICE_QUERIES);
    });
  });
});

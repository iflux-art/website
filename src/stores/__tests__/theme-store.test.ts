import { useThemeStore } from "../theme-store";

// Reset all stores before each test
beforeEach(() => {
  useThemeStore.getState().resetThemeState();
});

describe("useThemeStore", () => {
  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const state = useThemeStore.getState();

      expect(state.theme).toBe("system");
      expect(state.resolvedTheme).toBe("light");
      expect(state.config).toEqual({
        attribute: "class",
        defaultTheme: "system",
        enableSystem: true,
        disableTransitionOnChange: false,
      });
      expect(state.mounted).toBe(false);
    });
  });

  describe("Actions", () => {
    it("should set theme", () => {
      const { setTheme } = useThemeStore.getState();

      setTheme("dark");
      expect(useThemeStore.getState().theme).toBe("dark");
    });

    it("should set resolved theme", () => {
      const { setResolvedTheme } = useThemeStore.getState();

      setResolvedTheme("dark");
      expect(useThemeStore.getState().resolvedTheme).toBe("dark");
    });

    it("should set config", () => {
      const { setConfig } = useThemeStore.getState();
      const newConfig = {
        attribute: "data-theme" as const,
        defaultTheme: "light" as const,
        enableSystem: false,
        disableTransitionOnChange: true,
      };

      setConfig(newConfig);
      expect(useThemeStore.getState().config).toEqual(newConfig);
    });

    it("should set mounted", () => {
      const { setMounted } = useThemeStore.getState();

      setMounted(true);
      expect(useThemeStore.getState().mounted).toBe(true);
    });

    it("should toggle theme", () => {
      const { toggleTheme, setResolvedTheme } = useThemeStore.getState();

      // Initially light, should toggle to dark
      setResolvedTheme("light");
      toggleTheme();
      expect(useThemeStore.getState().theme).toBe("dark");

      // Now dark, should toggle to light
      toggleTheme();
      expect(useThemeStore.getState().theme).toBe("light");
    });

    it("should reset theme state", () => {
      const state = useThemeStore.getState();

      // Change states
      state.setTheme("dark");
      state.setMounted(true);

      // Reset
      state.resetThemeState();

      // Check reset state
      expect(useThemeStore.getState().theme).toBe("system");
      expect(useThemeStore.getState().mounted).toBe(false);
    });
  });
});

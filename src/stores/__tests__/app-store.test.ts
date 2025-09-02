import { useAppStore } from "../app-store.standard";

// Reset all stores before each test
beforeEach(() => {
  useAppStore.getState().resetState();
});

describe("useAppStore", () => {
  describe("UI State", () => {
    it("should toggle sidebar state", () => {
      const { setIsSidebarOpen, toggleSidebar } = useAppStore.getState();

      // Initially false
      expect(useAppStore.getState().isSidebarOpen).toBe(false);

      // Set to true
      setIsSidebarOpen(true);
      expect(useAppStore.getState().isSidebarOpen).toBe(true);

      // Toggle back to false
      toggleSidebar();
      expect(useAppStore.getState().isSidebarOpen).toBe(false);

      // Toggle to true again
      toggleSidebar();
      expect(useAppStore.getState().isSidebarOpen).toBe(true);
    });

    it("should toggle search state", () => {
      const { setIsSearchOpen, toggleSearch } = useAppStore.getState();

      // Initially false
      expect(useAppStore.getState().isSearchOpen).toBe(false);

      // Set to true
      setIsSearchOpen(true);
      expect(useAppStore.getState().isSearchOpen).toBe(true);

      // Toggle back to false
      toggleSearch();
      expect(useAppStore.getState().isSearchOpen).toBe(false);
    });

    it("should set mobile state", () => {
      const { setIsMobile } = useAppStore.getState();

      // Initially false
      expect(useAppStore.getState().isMobile).toBe(false);

      // Set to true
      setIsMobile(true);
      expect(useAppStore.getState().isMobile).toBe(true);
    });
  });

  describe("Theme and Language", () => {
    it("should set theme", () => {
      const { setTheme } = useAppStore.getState();

      // Initially system
      expect(useAppStore.getState().theme).toBe("system");

      // Change to dark
      setTheme("dark");
      expect(useAppStore.getState().theme).toBe("dark");

      // Change to light
      setTheme("light");
      expect(useAppStore.getState().theme).toBe("light");
    });

    it("should set language", () => {
      const { setLanguage } = useAppStore.getState();

      // Initially zh-CN
      expect(useAppStore.getState().language).toBe("zh-CN");

      // Change to en-US
      setLanguage("en-US");
      expect(useAppStore.getState().language).toBe("en-US");
    });
  });

  describe("Notifications", () => {
    it("should set notifications", () => {
      const { setNotifications } = useAppStore.getState();
      const notifications = { hasUnread: true, count: 5 };

      setNotifications(notifications);
      expect(useAppStore.getState().notifications).toEqual(notifications);
    });

    it("should show notification badge", () => {
      const { showNotificationBadge } = useAppStore.getState();

      showNotificationBadge();
      expect(useAppStore.getState().notifications.hasUnread).toBe(true);
      expect(useAppStore.getState().notifications.count).toBe(1);
    });

    it("should hide notification badge", () => {
      const { showNotificationBadge, hideNotificationBadge } = useAppStore.getState();

      // Show badge first
      showNotificationBadge();
      expect(useAppStore.getState().notifications.hasUnread).toBe(true);
      expect(useAppStore.getState().notifications.count).toBe(1);

      // Hide badge
      hideNotificationBadge();
      expect(useAppStore.getState().notifications.hasUnread).toBe(false);
      expect(useAppStore.getState().notifications.count).toBe(0);
    });

    it("should increment notification count", () => {
      const { incrementNotificationCount } = useAppStore.getState();

      // Initial state
      expect(useAppStore.getState().notifications.count).toBe(0);
      expect(useAppStore.getState().notifications.hasUnread).toBe(false);

      // Increment
      incrementNotificationCount();
      expect(useAppStore.getState().notifications.count).toBe(1);
      expect(useAppStore.getState().notifications.hasUnread).toBe(true);

      // Increment again
      incrementNotificationCount();
      expect(useAppStore.getState().notifications.count).toBe(2);
    });
  });

  describe("Loading and Errors", () => {
    it("should set loading state", () => {
      const { setLoading } = useAppStore.getState();

      // Initially not loading
      expect(useAppStore.getState().isLoading).toBe(false);
      expect(useAppStore.getState().loadingMessage).toBe("");

      // Set loading with message
      setLoading(true, "Loading data...");
      expect(useAppStore.getState().isLoading).toBe(true);
      expect(useAppStore.getState().loadingMessage).toBe("Loading data...");

      // Set not loading
      setLoading(false);
      expect(useAppStore.getState().isLoading).toBe(false);
      expect(useAppStore.getState().loadingMessage).toBe("");
    });

    it("should show and clear errors", () => {
      const { showError, clearError } = useAppStore.getState();

      // Initially no error
      expect(useAppStore.getState().error).toBeNull();

      // Show error
      showError("Something went wrong");
      expect(useAppStore.getState().error).toBe("Something went wrong");

      // Clear error
      clearError();
      expect(useAppStore.getState().error).toBeNull();
    });
  });

  describe("Reset Functions", () => {
    it("should reset app state", () => {
      const state = useAppStore.getState();

      // Change multiple states
      state.setIsSidebarOpen(true);
      state.setIsSearchOpen(true);
      state.setTheme("dark");
      state.setLanguage("en-US");
      state.showNotificationBadge();
      state.setLoading(true, "Loading");
      state.showError("Error");

      // Verify states are changed
      expect(useAppStore.getState().isSidebarOpen).toBe(true);
      expect(useAppStore.getState().isSearchOpen).toBe(true);
      expect(useAppStore.getState().theme).toBe("dark");
      expect(useAppStore.getState().language).toBe("en-US");
      expect(useAppStore.getState().notifications.hasUnread).toBe(true);
      expect(useAppStore.getState().isLoading).toBe(true);
      expect(useAppStore.getState().error).toBe("Error");

      // Reset and verify initial state
      state.resetState();
      expect(useAppStore.getState().isSidebarOpen).toBe(false);
      expect(useAppStore.getState().isSearchOpen).toBe(false);
      expect(useAppStore.getState().theme).toBe("system");
      expect(useAppStore.getState().language).toBe("zh-CN");
      expect(useAppStore.getState().notifications.hasUnread).toBe(false);
      expect(useAppStore.getState().notifications.count).toBe(0);
      expect(useAppStore.getState().isLoading).toBe(false);
      expect(useAppStore.getState().loadingMessage).toBe("");
      expect(useAppStore.getState().error).toBeNull();
    });

    it("should reset UI state", () => {
      const state = useAppStore.getState();

      // Change UI states
      state.setIsSidebarOpen(true);
      state.setIsSearchOpen(true);
      state.showError("Error");

      // Verify states are changed
      expect(useAppStore.getState().isSidebarOpen).toBe(true);
      expect(useAppStore.getState().isSearchOpen).toBe(true);
      expect(useAppStore.getState().error).toBe("Error");

      // Reset UI state
      state.resetUIState();
      expect(useAppStore.getState().isSidebarOpen).toBe(false);
      expect(useAppStore.getState().isSearchOpen).toBe(false);
      expect(useAppStore.getState().error).toBe("Error"); // Error should not be cleared by resetUIState
    });
  });
});

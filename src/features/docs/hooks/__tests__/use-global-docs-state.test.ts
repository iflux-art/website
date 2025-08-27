/**
 * @vitest-environment jsdom
 */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGlobalDocsState } from "../use-global-docs-state";

// Mock the store
const mockSetStructure = vi.fn();
const mockSetLoading = vi.fn();
const mockSetError = vi.fn();
const mockSetTimestamp = vi.fn();
const mockResetDocsGlobalStructureState = vi.fn();

const mockStore = {
  structure: null,
  loading: true,
  error: null,
  timestamp: 0,
  setStructure: mockSetStructure,
  setLoading: mockSetLoading,
  setError: mockSetError,
  setTimestamp: mockSetTimestamp,
  resetDocsGlobalStructureState: mockResetDocsGlobalStructureState,
};

vi.mock("@/stores", () => ({
  useDocsGlobalStructureStore: () => mockStore,
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useGlobalDocsState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useGlobalDocsState());

    // 使用 result 变量来避免 TS6133 错误
    expect(result.current.structure).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should fetch global docs on mount", async () => {
    const mockData = {
      categories: [],
      firstDocPath: "/docs",
      totalDocs: 0,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useGlobalDocsState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/docs/global-structure");
    expect(mockSetStructure).toHaveBeenCalledWith(mockData);
    expect(mockSetTimestamp).toHaveBeenCalled();
  });

  it("should handle fetch error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
    });

    const { result } = renderHook(() => useGlobalDocsState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    // Wait for useEffect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(mockSetError).toHaveBeenCalledWith("Failed to fetch global docs structure: Not Found");
  });

  it("should refetch data", async () => {
    const mockData = {
      categories: [],
      firstDocPath: "/docs",
      totalDocs: 0,
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const { result } = renderHook(() => useGlobalDocsState());

    // 使用 result 变量来避免 TS6133 错误
    void result;

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/docs/global-structure");
    expect(mockSetStructure).toHaveBeenCalledWith(mockData);
  });
});

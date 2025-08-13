import { renderHook } from "@testing-library/react";
import { useModalErrorHandler } from "../use-modal-error-handler";

describe("useModalErrorHandler", () => {
  it("should create error with correct properties", () => {
    const { result } = renderHook(() => useModalErrorHandler());

    const networkError = result.current.createError(
      "network",
      "Connection failed",
    );
    expect(networkError).toEqual({
      type: "network",
      message: "Connection failed",
      details: undefined,
      retryable: true,
    });

    const filterError = result.current.createError(
      "filter",
      "Filter failed",
      "Invalid category",
    );
    expect(filterError).toEqual({
      type: "filter",
      message: "Filter failed",
      details: "Invalid category",
      retryable: false,
    });
  });

  it("should generate correct error messages", () => {
    const { result } = renderHook(() => useModalErrorHandler());

    const networkError = result.current.createError(
      "network",
      "Connection timeout",
    );
    expect(result.current.getErrorMessage(networkError)).toBe(
      "网络连接失败，请检查网络后重试: Connection timeout",
    );

    const unknownError = result.current.createError("unknown", "");
    expect(result.current.getErrorMessage(unknownError)).toBe("发生未知错误");
  });

  it("should generate correct retry messages", () => {
    const { result } = renderHook(() => useModalErrorHandler());

    const networkError = result.current.createError(
      "network",
      "Connection failed",
    );
    expect(result.current.getRetryMessage(networkError)).toBe(
      "点击重试重新加载",
    );

    const filterError = result.current.createError("filter", "Filter failed");
    expect(result.current.getRetryMessage(filterError)).toBe("");
  });

  it("should correctly identify retryable errors", () => {
    const { result } = renderHook(() => useModalErrorHandler());

    const networkError = result.current.createError(
      "network",
      "Connection failed",
    );
    expect(result.current.isRetryable(networkError)).toBe(true);

    const timeoutError = result.current.createError(
      "timeout",
      "Request timeout",
    );
    expect(result.current.isRetryable(timeoutError)).toBe(true);

    const filterError = result.current.createError("filter", "Filter failed");
    expect(result.current.isRetryable(filterError)).toBe(false);

    const dataError = result.current.createError("data", "Data invalid");
    expect(result.current.isRetryable(dataError)).toBe(false);
  });

  it("should handle all error types correctly", () => {
    const { result } = renderHook(() => useModalErrorHandler());

    const errorTypes = [
      "network",
      "filter",
      "data",
      "timeout",
      "unknown",
    ] as const;

    errorTypes.forEach((type) => {
      const error = result.current.createError(type, `${type} error`);
      expect(error.type).toBe(type);

      const message = result.current.getErrorMessage(error);
      expect(message).toBeTruthy();
      expect(typeof message).toBe("string");

      const retryMessage = result.current.getRetryMessage(error);
      expect(typeof retryMessage).toBe("string");

      const isRetryable = result.current.isRetryable(error);
      expect(typeof isRetryable).toBe("boolean");
    });
  });
});

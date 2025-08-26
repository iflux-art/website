/**
 * 统一错误处理和日志记录工具
 * 提供统一的错误处理、日志记录和错误报告机制
 *
 * 环境变量配置：
 * - SHOW_CONTENT_NOT_FOUND_STACK=true 显示 ContentNotFound 错误的完整堆栈跟踪
 */

export interface ErrorInfo {
  /** 错误类型 */
  type: "ContentNotFound" | "NetworkError" | "ValidationError" | "UnknownError";
  /** 错误消息 */
  message: string;
  /** 错误代码 */
  code?: string;
  /** 上下文信息 */
  context?: Record<string, unknown>;
  /** 原始错误对象 */
  originalError?: unknown;
  /** 发生时间 */
  timestamp?: Date;
}

export interface LogOptions {
  /** 是否在开发环境下输出到控制台 */
  logToConsole?: boolean;
  /** 是否记录到外部日志服务 */
  logToService?: boolean;
  /** 是否包含堆栈信息 */
  includeStack?: boolean;
}

/**
 * 错误分类器 - 根据错误内容自动分类
 */
export function classifyError(error: unknown): ErrorInfo["type"] {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    if (message.includes("not found") || message.includes("404")) {
      return "ContentNotFound";
    }

    if (message.includes("network") || message.includes("fetch") || message.includes("timeout")) {
      return "NetworkError";
    }

    if (message.includes("validation") || message.includes("invalid")) {
      return "ValidationError";
    }
  }

  return "UnknownError";
}

/**
 * 构建基础日志消息
 */
function buildLogMessage(errorInfo: ErrorInfo) {
  return {
    ...errorInfo,
    timestamp: errorInfo.timestamp || new Date(),
    environment: process.env.NODE_ENV,
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "server",
  };
}

/**
 * 输出开发环境的基础错误信息
 */
function logDevelopmentError(errorInfo: ErrorInfo): void {
  // 为 ContentNotFound 提供更友好的输出格式
  if (errorInfo.type === "ContentNotFound") {
    console.warn(`📝 ${errorInfo.type}: ${errorInfo.message}`);
    console.warn("ℹ️ 这是一个预期的错误，用户访问了不存在的内容");
  } else {
    console.error(`🚨 ${errorInfo.type}: ${errorInfo.message}`);
  }

  // 输出详细信息
  console.error("ℹ️ Error Details:", {
    type: errorInfo.type,
    message: errorInfo.message,
    code: errorInfo.code,
    timestamp: errorInfo.timestamp || new Date(),
    environment: process.env.NODE_ENV,
  });
}

/**
 * 输出上下文信息
 */
function logContextInfo(errorInfo: ErrorInfo): void {
  if (errorInfo.context && Object.keys(errorInfo.context).length > 0) {
    console.error("🔍 Context:", errorInfo.context);
  }
}

/**
 * 输出ContentNotFound错误的堆栈信息
 */
function logContentNotFoundStack(errorInfo: ErrorInfo): void {
  if (!(errorInfo.originalError instanceof Error)) {
    return;
  }

  // 为 ContentNotFound 提供更有用的调试信息
  console.error("📚 错误来源:", {
    message: errorInfo.originalError.message,
    requestedContent: errorInfo.context?.contentId,
    contentType: errorInfo.context?.contentType,
  });

  // 可选显示堆栈（通常不需要）
  if (process.env.SHOW_CONTENT_NOT_FOUND_STACK === "true") {
    console.error("📚 Stack Trace (Info):", errorInfo.originalError.stack);
  }
}

/**
 * 输出其他错误类型的堆栈信息
 */
function logOtherErrorStack(errorInfo: ErrorInfo): void {
  if (errorInfo.originalError instanceof Error) {
    console.error("📚 Stack Trace:", errorInfo.originalError.stack);
  }
}

/**
 * 处理开发环境堆栈信息输出
 */
function logDevelopmentStack(errorInfo: ErrorInfo, includeStack: boolean): void {
  if (!(includeStack && errorInfo.originalError instanceof Error)) {
    return;
  }

  if (errorInfo.type === "ContentNotFound") {
    logContentNotFoundStack(errorInfo);
  } else {
    logOtherErrorStack(errorInfo);
  }
}

/**
 * 处理开发环境日志输出
 */
function logDevelopmentOutput(errorInfo: ErrorInfo, includeStack: boolean): void {
  logDevelopmentError(errorInfo);
  logContextInfo(errorInfo);
  logDevelopmentStack(errorInfo, includeStack);
}

/**
 * 处理生产环境日志输出
 */
function logProductionOutput(
  errorInfo: ErrorInfo,
  logMessage: ReturnType<typeof buildLogMessage>
): void {
  console.error(`[${errorInfo.type}] ${errorInfo.message}`, {
    code: errorInfo.code,
    timestamp: logMessage.timestamp,
  });
}

/**
 * 处理外部日志服务
 */
function logToExternalService(_errorInfo: ErrorInfo): void {
  // TODO: 未来可以集成外部日志服务如 Sentry、LogRocket 等
  // 例如: Sentry.captureException(_errorInfo.originalError, { extra: _errorInfo });
}

/**
 * 统一错误日志记录
 */
export function logError(errorInfo: ErrorInfo, options: LogOptions = {}): void {
  const {
    logToConsole = true,
    logToService = false,
    includeStack = process.env.NODE_ENV === "development",
  } = options;

  // 构建日志消息
  const logMessage = buildLogMessage(errorInfo);

  // 开发环境控制台输出
  if (logToConsole && process.env.NODE_ENV === "development") {
    logDevelopmentOutput(errorInfo, includeStack);
  }

  // 生产环境简化日志
  if (logToConsole && process.env.NODE_ENV === "production") {
    logProductionOutput(errorInfo, logMessage);
  }

  // 记录到外部服务
  if (logToService) {
    logToExternalService(errorInfo);
  }
}

/**
 * 内容加载错误处理器
 * 专门处理博客、文档等内容加载错误
 */
export function handleContentError(
  error: unknown,
  contentType: "blog" | "docs" | "links",
  contentId?: string
): ErrorInfo {
  // 获取更多上下文信息
  const context: Record<string, unknown> = {
    contentType,
    contentId,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
  };

  // 在客户端添加更多信息
  if (typeof window !== "undefined") {
    context.url = window.location.href;
    context.userAgent = window.navigator.userAgent;
  } else {
    context.runtime = "server";
  }

  const errorInfo: ErrorInfo = {
    type: classifyError(error),
    message: error instanceof Error ? error.message : "Unknown content loading error",
    context,
    originalError: error,
    timestamp: new Date(),
  };

  // 根据内容类型添加特定的错误代码
  if (errorInfo.type === "ContentNotFound") {
    errorInfo.code = `${contentType.toUpperCase()}_NOT_FOUND`;
  }

  // 记录错误日志
  logError(errorInfo, {
    logToConsole: true,
    includeStack: true,
  });

  return errorInfo;
}

/**
 * 网络请求错误处理器
 */
export function handleNetworkError(error: unknown, endpoint?: string): ErrorInfo {
  const errorInfo: ErrorInfo = {
    type: "NetworkError",
    message: error instanceof Error ? error.message : "Network request failed",
    context: {
      endpoint,
      timestamp: new Date().toISOString(),
    },
    originalError: error,
    timestamp: new Date(),
  };

  logError(errorInfo);
  return errorInfo;
}

/**
 * 用户友好的错误消息生成器
 */
export function getUserFriendlyMessage(errorInfo: ErrorInfo): string {
  const messages = {
    ContentNotFound: "抱歉，您访问的内容不存在或已被移除。",
    NetworkError: "网络连接出现问题，请检查您的网络连接后重试。",
    ValidationError: "输入的数据格式不正确，请检查后重新提交。",
    UnknownError: "出现了未知错误，请稍后重试或联系管理员。",
  };

  return messages[errorInfo.type] || messages.UnknownError;
}

/**
 * 错误边界组件的错误处理
 */
export function handleComponentError(error: Error, errorInfo: { componentStack: string }): void {
  const errorDetails: ErrorInfo = {
    type: "UnknownError",
    message: error.message,
    context: {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    },
    originalError: error,
    timestamp: new Date(),
  };

  logError(errorDetails, {
    logToConsole: true,
    includeStack: true,
  });
}

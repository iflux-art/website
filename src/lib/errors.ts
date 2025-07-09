/**
 * 定义应用中的错误类型
 */

export class ChatError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "ChatError";
  }
}

export class ModelNotFoundError extends ChatError {
  constructor(modelId: string) {
    super(`Model not found: ${modelId}`, 400);
    this.name = "ModelNotFoundError";
  }
}

export class ApiKeyNotConfiguredError extends ChatError {
  constructor(modelName: string) {
    super(`${modelName} API key not configured`, 400);
    this.name = "ApiKeyNotConfiguredError";
  }
}

export class InsufficientBalanceError extends ChatError {
  constructor(modelName: string) {
    super(`${modelName} API insufficient balance`, 402);
    this.name = "InsufficientBalanceError";
  }
}

export class ApiRequestError extends ChatError {
  constructor(
    modelName: string,
    public status: number,
    public apiError?: unknown,
  ) {
    super(`${modelName} API request failed with status ${status}`, 502);
    this.name = "ApiRequestError";
  }
}

/**
 * 标准化错误响应格式
 */
export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

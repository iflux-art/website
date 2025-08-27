/**
 * WebSocket服务 - 链接数据实时更新
 *
 * 该模块实现了链接数据的WebSocket通信，支持实时数据更新
 */

// WebSocket连接URL，开发环境和生产环境区分
const WS_URL =
  process.env.NODE_ENV === "production"
    ? `wss://${process.env.NEXT_PUBLIC_VERCEL_URL || window.location.host}/ws/links`
    : `ws://${window.location.host}/ws/links`;

// 消息类型
export enum LinkDataMessageType {
  Connect = "connect",
  Sync = "sync",
  Update = "update",
  Error = "error",
}

// WebSocket消息接口
export interface LinkDataMessage {
  type: LinkDataMessageType;
  payload?: unknown;
  timestamp: number;
  version?: string;
}

// 连接状态
export enum ConnectionState {
  Disconnected = "disconnected",
  Connecting = "connecting",
  Connected = "connected",
  Error = "error",
}

// 重连配置
const RECONNECT_INTERVAL = 3000; // 3秒
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * 链接数据WebSocket客户端
 * 负责与WebSocket服务器建立连接并处理数据更新
 */
class LinkDataSocketClient {
  private socket: WebSocket | null = null;
  private connectionState: ConnectionState = ConnectionState.Disconnected;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private messageHandlers: ((message: LinkDataMessage) => void)[] = [];
  private connectionStateHandlers: ((state: ConnectionState) => void)[] = [];
  private clientVersion: string = localStorage.getItem("links_data_version") || "0";

  /**
   * 初始化WebSocket连接
   */
  connect() {
    if (
      this.connectionState === ConnectionState.Connecting ||
      this.connectionState === ConnectionState.Connected
    ) {
      return;
    }

    this.updateConnectionState(ConnectionState.Connecting);

    try {
      this.socket = new WebSocket(WS_URL);

      // 处理连接打开
      this.socket.onopen = this.handleOpen.bind(this);

      // 处理接收消息
      this.socket.onmessage = this.handleMessage.bind(this);

      // 处理错误
      this.socket.onerror = this.handleError.bind(this);

      // 处理连接关闭
      this.socket.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error("Failed to connect to WebSocket server:", error);
      this.updateConnectionState(ConnectionState.Error);
      this.scheduleReconnect();
    }
  }

  /**
   * 断开WebSocket连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.updateConnectionState(ConnectionState.Disconnected);
    this.reconnectAttempts = 0;
  }

  /**
   * 发送数据同步请求
   */
  requestSync() {
    this.sendMessage({
      type: LinkDataMessageType.Sync,
      timestamp: Date.now(),
      version: this.clientVersion,
    });
  }

  /**
   * 添加消息处理器
   * @param handler 消息处理函数
   */
  addMessageHandler(handler: (message: LinkDataMessage) => void) {
    this.messageHandlers.push(handler);
  }

  /**
   * 移除消息处理器
   * @param handler 要移除的消息处理函数
   */
  removeMessageHandler(handler: (message: LinkDataMessage) => void) {
    this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
  }

  /**
   * 添加连接状态处理器
   * @param handler 连接状态处理函数
   */
  addConnectionStateHandler(handler: (state: ConnectionState) => void) {
    this.connectionStateHandlers.push(handler);
    // 立即调用处理器以通知当前状态
    handler(this.connectionState);
  }

  /**
   * 移除连接状态处理器
   * @param handler 要移除的连接状态处理函数
   */
  removeConnectionStateHandler(handler: (state: ConnectionState) => void) {
    this.connectionStateHandlers = this.connectionStateHandlers.filter(h => h !== handler);
  }

  /**
   * 获取当前连接状态
   */
  getConnectionState(): ConnectionState {
    return this.connectionState;
  }

  /**
   * 获取当前客户端数据版本
   */
  getClientVersion(): string {
    return this.clientVersion;
  }

  /**
   * 更新客户端数据版本
   * @param version 新的版本号
   */
  updateClientVersion(version: string) {
    this.clientVersion = version;
    localStorage.setItem("links_data_version", version);
  }

  // 私有方法

  /**
   * 发送WebSocket消息
   * @param message 要发送的消息
   */
  private sendMessage(message: LinkDataMessage) {
    if (this.socket && this.connectionState === ConnectionState.Connected) {
      try {
        this.socket.send(JSON.stringify(message));
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }

  /**
   * 处理WebSocket连接打开事件
   */
  private handleOpen() {
    this.updateConnectionState(ConnectionState.Connected);
    this.reconnectAttempts = 0;

    // 连接后发送同步请求，包含当前数据版本
    this.requestSync();
  }

  /**
   * 处理WebSocket接收消息事件
   * @param event WebSocket消息事件
   */
  private handleMessage(event: MessageEvent) {
    try {
      const message = JSON.parse(event.data) as LinkDataMessage;

      // 如果收到更新消息，更新客户端版本
      if (message.type === LinkDataMessageType.Update && message.version) {
        this.updateClientVersion(message.version);
      }

      // 通知所有消息处理器
      for (const handler of this.messageHandlers) {
        handler(message);
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }

  /**
   * 处理WebSocket错误事件
   * @param event WebSocket错误事件
   */
  private handleError(event: Event) {
    console.error("WebSocket error:", event);
    this.updateConnectionState(ConnectionState.Error);
  }

  /**
   * 处理WebSocket连接关闭事件
   */
  private handleClose() {
    if (this.connectionState !== ConnectionState.Disconnected) {
      this.updateConnectionState(ConnectionState.Disconnected);
      this.scheduleReconnect();
    }
  }

  /**
   * 安排重新连接
   */
  private scheduleReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.warn(`Maximum reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached.`);
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempts++;
    this.reconnectTimer = setTimeout(() => {
      console.log(
        `Attempting to reconnect (${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`
      );
      this.connect();
    }, RECONNECT_INTERVAL);
  }

  /**
   * 更新连接状态并通知处理器
   * @param state 新的连接状态
   */
  private updateConnectionState(state: ConnectionState) {
    this.connectionState = state;
    for (const handler of this.connectionStateHandlers) {
      handler(state);
    }
  }
}

// 导出单例实例
export const linkDataSocket = new LinkDataSocketClient();

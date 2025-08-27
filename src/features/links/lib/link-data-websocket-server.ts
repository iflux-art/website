import { Server as HttpServer } from "node:http";
import { WebSocketServer } from "ws";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { loadAllLinksData } from "@/features/links/lib";
import type { LinksItem } from "@/features/links/types";
import type { WebSocket } from "ws";

// 消息类型接口
interface WebSocketMessage {
  type: string;
  payload?: unknown;
  timestamp: number;
  version?: string;
}

// 客户端消息接口
interface ClientMessage {
  type: string;
  version?: string;
}

// 版本数据接口
interface VersionData {
  currentVersion?: string;
  versions?: Record<string, string[]>;
}

/**
 * 链接数据WebSocket服务器
 *
 * 用于实时推送链接数据更新
 */
export class LinkDataWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private dataVersion = "1.0.0";
  private data: LinksItem[] = [];
  private versionMap: Map<string, string> = new Map();

  constructor(server: HttpServer) {
    // 创建WebSocket服务器
    this.wss = new WebSocketServer({
      server,
      path: "/ws/links",
    });

    // 初始化数据和版本信息
    this.initializeData().catch(err => {
      console.error("Failed to initialize link data:", err);
    });

    // 设置连接处理程序
    this.wss.on("connection", this.handleConnection.bind(this));

    console.log("LinkDataWebSocketServer initialized");
  }

  /**
   * 初始化数据
   */
  private async initializeData() {
    try {
      // 加载链接数据
      this.data = await loadAllLinksData();

      // 从版本文件加载版本映射
      try {
        const versionFile = await readFile(
          join(process.cwd(), "src/content/links/versions.json"),
          "utf-8"
        );
        const versionData: VersionData = JSON.parse(versionFile);
        this.dataVersion = versionData.currentVersion || "1.0.0";

        // 构建版本映射
        if (versionData.versions) {
          Object.entries(versionData.versions).forEach(([version, files]) => {
            this.versionMap.set(version, JSON.stringify(files));
          });
        }
      } catch (error) {
        console.warn("Failed to load version file, using default version:", error);
      }

      console.log(`LinkDataWebSocketServer initialized with version ${this.dataVersion}`);
    } catch (error) {
      console.error("Failed to initialize data:", error);
      throw error;
    }
  }

  /**
   * 处理新的WebSocket连接
   */
  private handleConnection(ws: WebSocket) {
    // 为新客户端生成ID
    const clientId = randomUUID();
    this.clients.set(clientId, ws);

    console.log(`New client connected: ${clientId}, total clients: ${this.clients.size}`);

    // 设置消息处理程序
    ws.on("message", (message: string) => {
      try {
        const data: ClientMessage = JSON.parse(message);
        this.handleClientMessage(clientId, ws, data);
      } catch (error) {
        console.error("Failed to parse client message:", error);
        this.sendError(ws, "Invalid message format");
      }
    });

    // 设置关闭处理程序
    ws.on("close", () => {
      console.log(`Client disconnected: ${clientId}`);
      this.clients.delete(clientId);
    });

    // 设置错误处理程序
    ws.on("error", (error: Error) => {
      console.error(`WebSocket error for client ${clientId}:`, error);
      this.clients.delete(clientId);
    });

    // 发送连接成功消息
    this.sendMessage(ws, {
      type: "connect",
      timestamp: Date.now(),
      payload: {
        clientId,
        message: "Connected to links data WebSocket server",
      },
    });
  }

  /**
   * 处理来自客户端的消息
   */
  private handleClientMessage(clientId: string, ws: WebSocket, message: ClientMessage) {
    // 确保消息有有效的类型
    if (!message.type) {
      this.sendError(ws, "Missing message type");
      return;
    }

    switch (message.type) {
      case "sync":
        this.handleSyncRequest(ws, message);
        break;

      default:
        console.warn(`Unknown message type from client ${clientId}:`, message.type);
        this.sendError(ws, `Unknown message type: ${message.type}`);
    }
  }

  /**
   * 处理同步请求
   */
  private handleSyncRequest(ws: WebSocket, message: ClientMessage) {
    const clientVersion = message.version || "0";

    // 检查客户端版本是否需要更新
    if (clientVersion !== this.dataVersion) {
      console.log(
        `Client version (${clientVersion}) differs from server version (${this.dataVersion})`
      );

      // 如果有增量更新数据，发送增量更新
      if (this.versionMap.has(clientVersion)) {
        const changedFiles = JSON.parse(this.versionMap.get(clientVersion) || "[]");
        const changedItems = this.data.filter(
          item => changedFiles.includes(item.category) || changedFiles.includes(item.id)
        );

        this.sendMessage(ws, {
          type: "sync",
          timestamp: Date.now(),
          version: this.dataVersion,
          payload: {
            needsUpdate: true,
            isIncremental: true,
            items: changedItems,
          },
        });
      }
      // 否则发送全量更新
      else {
        this.sendMessage(ws, {
          type: "sync",
          timestamp: Date.now(),
          version: this.dataVersion,
          payload: {
            needsUpdate: true,
            isIncremental: false,
            items: this.data,
          },
        });
      }
    }
    // 客户端版本是最新的
    else {
      this.sendMessage(ws, {
        type: "sync",
        timestamp: Date.now(),
        version: this.dataVersion,
        payload: {
          needsUpdate: false,
          message: "Client is up to date",
        },
      });
    }
  }

  /**
   * 向单个客户端发送消息
   */
  private sendMessage(ws: WebSocket, message: WebSocketMessage) {
    if (ws.readyState === 1) {
      // WebSocket.OPEN
      ws.send(JSON.stringify(message));
    }
  }

  /**
   * 向所有连接的客户端广播消息
   */
  public broadcastMessage(message: WebSocketMessage) {
    this.clients.forEach(client => {
      this.sendMessage(client, message);
    });
  }

  /**
   * 向单个客户端发送错误消息
   */
  private sendError(ws: WebSocket, errorMessage: string) {
    this.sendMessage(ws, {
      type: "error",
      timestamp: Date.now(),
      payload: {
        message: errorMessage,
      },
    });
  }

  /**
   * 广播链接数据更新
   */
  public broadcastUpdate(items: LinksItem[], incrementalUpdate = true) {
    // 更新数据版本
    this.dataVersion = new Date().toISOString();

    // 更新内存中的数据
    if (incrementalUpdate) {
      // 增量更新：仅更新指定项
      items.forEach(updatedItem => {
        const index = this.data.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          this.data[index] = { ...this.data[index], ...updatedItem };
        } else {
          this.data.push(updatedItem);
        }
      });
    } else {
      // 全量更新
      this.data = [...items];
    }

    // 广播更新消息
    this.broadcastMessage({
      type: "update",
      timestamp: Date.now(),
      version: this.dataVersion,
      payload: {
        items: items,
        isIncremental: incrementalUpdate,
        fullData: incrementalUpdate ? null : this.data,
      },
    });
  }

  /**
   * 获取连接的客户端数量
   */
  public getClientCount(): number {
    return this.clients.size;
  }

  /**
   * 获取当前数据版本
   */
  public getDataVersion(): string {
    return this.dataVersion;
  }
}

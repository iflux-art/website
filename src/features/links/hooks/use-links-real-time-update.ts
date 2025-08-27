"use client";

import { useCallback, useEffect, useState } from "react";
import {
  linkDataSocket,
  ConnectionState,
  LinkDataMessageType,
  type LinkDataMessage,
} from "../lib/link-data-socket";
import { useLinksDataStore } from "@/stores";
import type { LinksItem } from "@/features/links/types";

// 定义消息负载接口
interface UpdatePayload {
  items?: LinksItem[];
  fullData?: LinksItem[];
}

interface SyncPayload {
  needsUpdate?: boolean;
  items?: LinksItem[];
}

/**
 * 使用链接数据实时更新的Hook
 *
 * 处理WebSocket连接和实时数据更新
 */
export function useLinksRealTimeUpdate() {
  // 连接状态
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    linkDataSocket.getConnectionState()
  );

  // 最近更新的数据项
  const [lastUpdated, setLastUpdated] = useState<LinksItem[]>([]);

  // 最近接收到的消息
  const [lastMessage, setLastMessage] = useState<LinkDataMessage | null>(null);

  // 从Zustand获取更新数据的方法
  const { setItems } = useLinksDataStore();

  // 处理收到的WebSocket消息
  const handleMessage = useCallback(
    (message: LinkDataMessage) => {
      setLastMessage(message);

      // 处理更新消息
      if (message.type === LinkDataMessageType.Update && message.payload) {
        const payload = message.payload as UpdatePayload;
        // 设置最近更新的数据项
        if (Array.isArray(payload.items)) {
          setLastUpdated(payload.items);

          // 如果包含完整数据，则更新存储
          if (payload.fullData && Array.isArray(payload.fullData)) {
            setItems(payload.fullData);
          }
        }
      }

      // 处理同步响应消息
      else if (message.type === LinkDataMessageType.Sync && message.payload) {
        const payload = message.payload as SyncPayload;
        // 检查是否需要更新
        if (payload.needsUpdate && Array.isArray(payload.items)) {
          setItems(payload.items);
          setLastUpdated(payload.items);
        }
      }
    },
    [setItems]
  );

  // 连接WebSocket并设置事件处理器
  useEffect(() => {
    // 处理连接状态变更
    const handleConnectionState = (state: ConnectionState) => {
      setConnectionState(state);
    };

    // 添加事件处理器
    linkDataSocket.addMessageHandler(handleMessage);
    linkDataSocket.addConnectionStateHandler(handleConnectionState);

    // 连接WebSocket
    linkDataSocket.connect();

    // 清理函数：移除事件处理器并断开连接
    return () => {
      linkDataSocket.removeMessageHandler(handleMessage);
      linkDataSocket.removeConnectionStateHandler(handleConnectionState);
    };
  }, [handleMessage]); // 只在handleMessage变化时重新运行

  // 请求数据同步
  const requestSync = () => {
    linkDataSocket.requestSync();
  };

  // 返回Hook状态和方法
  return {
    connectionState,
    lastUpdated,
    lastMessage,
    requestSync,
    connect: linkDataSocket.connect.bind(linkDataSocket),
    disconnect: linkDataSocket.disconnect.bind(linkDataSocket),
    clientVersion: linkDataSocket.getClientVersion(),
  };
}

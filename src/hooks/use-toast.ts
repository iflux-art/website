'use client';

import * as React from 'react';

import type { ToastProps } from '@/components/ui/toast';

/**
 * Toast 操作类型
 */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * Toast 操作类型
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

/**
 * Toast 状态
 */
const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

/**
 * Toast 操作类型
 */
let count = 0;

/**
 * 生成唯一的 Toast ID
 */
function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

/**
 * Toast 上下文
 */
type ActionType = typeof actionTypes;

/**
 * Toast 操作
 */
type Action =
  | {
      type: ActionType['ADD_TOAST'];
      toast: ToasterToast;
    }
  | {
      type: ActionType['UPDATE_TOAST'];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType['DISMISS_TOAST'];
      toastId?: ToasterToast['id'];
    }
  | {
      type: ActionType['REMOVE_TOAST'];
      toastId?: ToasterToast['id'];
    };

/**
 * Toast 状态
 */
interface State {
  toasts: ToasterToast[];
}

/**
 * Toast 上下文
 */
const ToastContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: { toasts: [] },
  dispatch: () => null,
});

/**
 * Toast reducer
 */
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.toast],
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // 如果没有指定 toastId，则关闭所有 toast
      if (toastId === undefined) {
        return {
          ...state,
          toasts: state.toasts.map(t => ({
            ...t,
            open: false,
          })),
        };
      }

      // 关闭指定的 toast
      return {
        ...state,
        toasts: state.toasts.map(t => (t.id === toastId ? { ...t, open: false } : t)),
      };
    }

    case actionTypes.REMOVE_TOAST: {
      const { toastId } = action;

      // 如果没有指定 toastId，则移除所有 toast
      if (toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }

      // 移除指定的 toast
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== toastId),
      };
    }
  }
}

/**
 * Toast 提供者
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  return <ToastContext.Provider value={{ state, dispatch }}>{children}</ToastContext.Provider>;
}

/**
 * 使用 Toast 的 Hook
 */
export function useToast() {
  const { state, dispatch } = React.useContext(ToastContext);

  const toast = React.useMemo(
    () => ({
      /**
       * 显示 Toast
       */
      toast: (props: Omit<ToasterToast, 'id'>) => {
        const id = genId();

        const update = (props: Partial<ToasterToast>) =>
          dispatch({
            type: actionTypes.UPDATE_TOAST,
            toast: { ...props, id },
          });

        const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });

        dispatch({
          type: actionTypes.ADD_TOAST,
          toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open: boolean) => {
              if (!open) dismiss();
            },
          },
        });

        return {
          id,
          dismiss,
          update,
        };
      },
      /**
       * 关闭 Toast
       */
      dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
      /**
       * 获取所有 Toast
       */
      toasts: state.toasts,
    }),
    [state, dispatch]
  );

  return toast;
}

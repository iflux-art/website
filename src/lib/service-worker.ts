'use client';

/**
 * 注册 Service Worker
 * 
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    process.env.NODE_ENV !== 'production'
  ) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    
    console.log('Service Worker 注册成功:', registration.scope);
    
    return registration;
  } catch (error) {
    console.error('Service Worker 注册失败:', error);
    return null;
  }
}

/**
 * 更新 Service Worker
 * 
 * @returns Promise<ServiceWorkerRegistration | null>
 */
export async function updateServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    process.env.NODE_ENV !== 'production'
  ) {
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    await registration.update();
    
    console.log('Service Worker 更新成功');
    
    return registration;
  } catch (error) {
    console.error('Service Worker 更新失败:', error);
    return null;
  }
}

/**
 * 卸载 Service Worker
 * 
 * @returns Promise<boolean>
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    process.env.NODE_ENV !== 'production'
  ) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    
    const result = await registration.unregister();
    
    console.log('Service Worker 卸载成功:', result);
    
    return result;
  } catch (error) {
    console.error('Service Worker 卸载失败:', error);
    return false;
  }
}

/**
 * 检查 Service Worker 更新
 * 
 * @param callback 更新回调函数
 * @returns 清理函数
 */
export function checkForServiceWorkerUpdates(
  callback: (registration: ServiceWorkerRegistration) => void
): () => void {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    process.env.NODE_ENV !== 'production'
  ) {
    return () => {};
  }
  
  const handleUpdate = (registration: ServiceWorkerRegistration) => {
    if (registration.waiting) {
      callback(registration);
    }
  };
  
  // 检查当前注册
  navigator.serviceWorker.ready.then(handleUpdate);
  
  // 监听更新
  const updateListener = () => {
    navigator.serviceWorker.ready.then(handleUpdate);
  };
  
  // 添加监听器
  navigator.serviceWorker.addEventListener('controllerchange', updateListener);
  
  // 返回清理函数
  return () => {
    navigator.serviceWorker.removeEventListener('controllerchange', updateListener);
  };
}

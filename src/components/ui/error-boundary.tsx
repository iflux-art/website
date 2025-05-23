'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  message?: string;
  title?: string;
}

/**
 * 错误边界组件
 * 
 * 用于捕获和显示错误
 */
export function ErrorBoundary({ 
  children, 
  message = "发生了错误，请检查配置或联系管理员。",
  title = "注意"
}: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    // 检查是否有错误信息
    const checkForErrors = () => {
      const errorElements = document.querySelectorAll('.text-destructive');
      if (errorElements.length > 0) {
        setHasError(true);
      }
    };
    
    // 初始检查
    checkForErrors();
    
    // 设置定时器定期检查
    const timer = setInterval(checkForErrors, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div>
      {hasError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Alert>
      )}
      {children}
    </div>
  );
}

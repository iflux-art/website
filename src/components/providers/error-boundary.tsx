"use client";

import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <h1 className="mb-4 text-2xl font-bold">Something went wrong</h1>
            <p className="mb-6 text-destructive">{this.state.error?.message}</p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
              <Button onClick={this.handleReset}>Try Again</Button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export function GlobalErrorHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Unhandled error:", event.error);
      // 可以在这里发送错误日志
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, [router]);

  return null;
}

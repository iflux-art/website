export interface MDXRenderOptions {
  components?: Record<string, React.ComponentType | React.ReactElement>;
}

export interface MDXContentProps {
  content: string;
  options?: MDXRenderOptions;
}

export interface ProcessingState {
  readonly isProcessing: boolean;
  readonly error: Error | null;
  readonly processedCount: number;
  readonly totalCount: number;
  readonly remainingTasks: number;
  readonly failedTasks: number;
  readonly averageProcessingTime: number;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  tags: string[];
  isInternal?: boolean;
  category?: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
}

export interface ToolTag {
  name: string;
  count: number;
}

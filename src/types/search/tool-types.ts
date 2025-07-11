export interface Tool {
  id: string;
  name: string;
  description: string;
  path: string;
  tags: string[];
}

export interface NavigationSite {
  name: string;
  description: string;
  url: string;
  category: string;
}

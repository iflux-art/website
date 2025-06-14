import React from 'react';

export type MDXComponents = Record<string, React.ComponentType | React.ReactElement>;

export interface MDXRenderOptions {
  components?: MDXComponents;
  remarkPlugins?: Array<unknown>;
  rehypePlugins?: Array<unknown>;
}

export interface MDXOptions extends MDXRenderOptions {
  [key: string]: unknown;
}

export interface MDXContentProps {
  content: string;
  options?: MDXOptions;
}

export interface MDXRemoteProps extends MDXContentProps {
  compiledSource?: string;
}
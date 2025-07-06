'use client';

import { MDXCodeBlock } from './mdx-code-block';
import { MDXCallout } from './mdx-callout';
import { MDXTable } from './mdx-table';
import { MDXVideo } from './mdx-video';
import { MDXTabs } from './mdx-tabs';
import { MDXAccordion } from './mdx-accordion';
import { MDXCodeInline } from './mdx-codeInline';

export const MDXInteractiveComponents = {
  pre: MDXCodeBlock,
  Callout: MDXCallout,
  table: MDXTable,
  video: MDXVideo,
  Tabs: MDXTabs,
  Accordion: MDXAccordion,
  code: MDXCodeInline,
};

export type MDXInteractiveComponentsType = typeof MDXInteractiveComponents;

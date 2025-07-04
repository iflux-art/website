'use client';

import { MDXImage } from './mdx-image';
import { MDXLink } from './mdx-link';
import { MDXCodeBlock } from './mdx-code-block';
import { MDXCallout } from './mdx-callout';
import { MDXTable } from './mdx-table';
import { MDXVideo } from './mdx-video';
import { MDXFigure } from './mdx-figure';
import { MDXCard } from './mdx-card';
import { MDXTabs } from './mdx-tabs';
import { MDXAccordion } from './mdx-accordion';
import { MDXBlockquote } from './mdx-blockquote';
import { MDXCodeInline } from './mdx-codeInline';

export const MDXComponents = {
  img: MDXImage,
  a: MDXLink,
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  pre: MDXCodeBlock,
  Callout: MDXCallout,
  table: MDXTable,
  video: MDXVideo,
  Figure: MDXFigure,
  Card: MDXCard,
  Tabs: MDXTabs,
  Accordion: MDXAccordion,
  blockquote: MDXBlockquote,
  code: MDXCodeInline,
};

export type MDXComponentsType = typeof MDXComponents;

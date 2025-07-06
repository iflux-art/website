import { MDXImage } from "./mdx-image";
import { MDXLink } from "./mdx-link";
import { MDXFigure } from "./mdx-figure";
import { MDXCard } from "./mdx-card";
import { MDXBlockquote } from "./mdx-blockquote";

export const MDXStaticComponents = {
  img: MDXImage,
  a: MDXLink,
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  Figure: MDXFigure,
  Card: MDXCard,
  blockquote: MDXBlockquote,
};

export type MDXStaticComponentsType = typeof MDXStaticComponents;

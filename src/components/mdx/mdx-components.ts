import { MDXStaticComponents } from "./mdx-static-components";
import { MDXInteractiveComponents } from "./mdx-interactive-components";

export const MDXComponents = {
  ...MDXStaticComponents,
  ...MDXInteractiveComponents,
};

export type MDXComponentsType = typeof MDXComponents;

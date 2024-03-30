import type { MDXComponents } from 'mdx/types';
import { toSlug } from './lib/helpers/toSlug';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1
        data-mdx-heading
        data-heading={children}
        data-order={1}
        id={toSlug(String(children))}
        style={{
          scrollMarginTop: '150px',
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        data-mdx-heading
        data-heading={children}
        data-order={2}
        id={toSlug(String(children))}
        style={{
          scrollMarginTop: '150px',
        }}
      >
        {children}
      </h2>
    ),
    ...components,
  };
}

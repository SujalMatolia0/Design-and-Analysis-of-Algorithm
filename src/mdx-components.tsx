import type { MDXComponents } from 'mdx/types';
import { toSlug } from './lib/helpers/toSlug';
import { useRouter } from 'next/router';
import { CodeHighlight, CodeHighlightTabs } from '@mantine/code-highlight';
import { Children, useMemo } from 'react';
import { Mermaid } from './components/mermaid';
import { z } from 'zod';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const codeBlockSchema = z.object({
  type: z.literal('pre'),
  props: z.object({
    children: z.object({
      type: z.literal('code'),
      props: z.object({
        className: z
          .string()
          .startsWith('language-')
          .transform((className, ctx) => {
            const lang = className.replace('language-', '');

            if (lang.length === 0) {
              ctx.addIssue({
                code: 'custom',
                message: 'Invalid language',
                path: ['className'],
                params: { lang: className },
              });
            }

            return lang;
          }),
        children: z.string(),
      }),
    }),
  }),
});

const codeBlockArraySchema = z.array(codeBlockSchema).min(1);

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const router = useRouter();

  return {
    h1: ({ children }) => (
      <h1
        data-mdx-heading
        data-heading={children}
        data-order={1}
        id={toSlug(String(children))}
        style={{
          scrollMarginTop: '150px',
          cursor: 'pointer',
        }}
        onClick={() => {
          router.push(`#${toSlug(String(children))}`);
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
          cursor: 'pointer',
        }}
        onClick={() => {
          router.push(`#${toSlug(String(children))}`);
        }}
      >
        {children}
      </h2>
    ),

    /**
     * Single code black
     */
    CodeS: ({ children }: { children: React.ReactNode }) => {
      const parseResult = useMemo(() => {
        return codeBlockSchema.safeParse(children);
      }, [children]);

      if (!parseResult.success) {
        return (
          <CodeHighlight
            language="json"
            code={JSON.stringify(parseResult.error, null, 2)}
          />
        );
      }

      return (
        <>
          <CodeHighlight
            language={parseResult.data.props.children.props.className}
            code={parseResult.data.props.children.props.children}
          />
        </>
      );
    },

    /**
     * Single mermaid
     */
    Mer: ({ children }: { children: React.ReactNode }) => {
      const parseResult = useMemo(() => {
        return codeBlockSchema.safeParse(children);
      }, [children]);

      if (!parseResult.success) {
        return (
          <CodeHighlight
            language="json"
            code={JSON.stringify(parseResult.error, null, 2)}
          />
        );
      }

      // language should be mermaid
      if (parseResult.data.props.children.props.className !== 'mermaid') {
        return (
          <CodeHighlight
            language="json"
            code={JSON.stringify(
              {
                message: 'Invalid language, it should be mermaid',
                language: parseResult.data.props.children.props.className,
              },
              null,
              2
            )}
          />
        );
      }

      return (
        <>
          <Mermaid chart={parseResult.data.props.children.props.children} />
        </>
      );
    },

    /**
     * Multiple code black
     */
    CodeM: ({
      children,
      fileNames,
      exp,
    }: {
      children: React.ReactNode;
      fileNames: string[];
      exp?: boolean;
    }) => {
      const parseResult = useMemo(() => {
        const childArray = Children.toArray(children);

        return codeBlockArraySchema.safeParse(childArray);
      }, [children]);

      if (!parseResult.success) {
        return (
          <CodeHighlight
            language="json"
            code={JSON.stringify(parseResult.error, null, 2)}
          />
        );
      }

      if (!fileNames || fileNames.length === 0) {
        return (
          <CodeHighlight
            language="json"
            code={JSON.stringify(
              {
                message: 'File names are missing',
                fileNames,
              },
              null,
              2
            )}
          />
        );
      }

      if (parseResult.data?.length !== fileNames.length) {
        return (
          <CodeHighlight
            language="json"
            code={JSON.stringify(
              {
                message: 'Code blocks and file names count mismatch',
                codeBlocksCount: parseResult.data.length,
                fileNamesCount: fileNames.length,
              },
              null,
              2
            )}
          />
        );
      }

      return (
        <>
          <CodeHighlightTabs
            {...(exp && {
              withExpandButton: true,
              defaultExpanded: false,
              expandCodeLabel: 'Show full code',
              collapseCodeLabel: 'Show less',
            })}
            code={parseResult.data.map((item, index) => {
              return {
                fileName: `${fileNames[index]}.${item.props.children.props.className}`,
                code: item.props.children.props.children,
                language: item.props.children.props.className,
              };
            })}
          />
        </>
      );
    },

    Hi: ({ children }) => (
      <span style={{ backgroundColor: 'yellow' }}>{children}</span>
    ),
    ...components,
  };
}

import type { MDXComponents } from 'mdx/types';
import { toSlug } from './lib/helpers/toSlug';
import { useRouter } from 'next/router';
import { CodeHighlight, CodeHighlightTabs } from '@mantine/code-highlight';
import { Children, useMemo, useState } from 'react';
import { Mermaid } from './components/mermaid';
import { z } from 'zod';
import {
  Anchor,
  Box,
  Card,
  Code,
  Collapse,
  Group,
  Paper,
  Stack,
  alpha,
  useMantineColorScheme,
} from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { ICON_SIZE } from './lib/const';

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including inline styles,
// components from other libraries, and more.

const codeBlockSchema = z.object({
  type: z.literal('pre'),
  props: z.object({
    children: z.object({
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

const ErrBlock = ({ error }: { error: object }) => {
  return (
    <CodeHighlight language="json" code={JSON.stringify(error, null, 2)} />
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const router = useRouter();

  const { colorScheme } = useMantineColorScheme();

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
          <ErrBlock
            error={{
              message: 'Invalid code block',
              component: 'CodeS',
              error: parseResult.error,
            }}
          />
        );
      }

      return (
        <>
          <CodeHighlight
            style={{
              borderRadius: 'var(--mantine-radius-md)',
            }}
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
          <ErrBlock
            error={{
              message: 'Invalid code block',
              component: 'Mer',
              error: parseResult.error,
            }}
          />
        );
      }

      // language should be mermaid
      if (parseResult.data.props.children.props.className !== 'mermaid') {
        return (
          <ErrBlock
            error={{
              message: 'Invalid language, it should be mermaid',
              language: parseResult.data.props.children.props.className,
            }}
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
          <ErrBlock
            error={{
              message: 'Invalid code block',
              component: 'CodeM',
              error: parseResult.error,
            }}
          />
        );
      }

      if (!fileNames || fileNames.length === 0) {
        return (
          <ErrBlock
            error={{
              message: 'File names are missing',
              component: 'CodeM',
            }}
          />
        );
      }

      if (parseResult.data?.length !== fileNames.length) {
        return (
          <ErrBlock
            error={{
              message: 'Code blocks and file names count mismatch',
              codeBlocksCount: parseResult.data.length,
              fileNamesCount: fileNames.length,
            }}
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
            style={{
              borderRadius: 'var(--mantine-radius-md)',
            }}
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

    code: (props) => {
      return (
        <Code
          {...props}
          color={alpha(
            `var(--mantine-color-brown-${colorScheme === 'dark' ? 9 : 7})`,
            0.2
          )}
          c={`brown.${colorScheme === 'dark' ? 4 : 9}`}
          fw="bold"
        />
      );
    },

    a: (props) => {
      return <Anchor href={props.href}>{props.children}</Anchor>;
    },

    Cola: ({
      children,
      title,
    }: {
      children: React.ReactNode;
      title: string;
    }) => {
      const [Open, setOpen] = useState(false);

      if (!title) {
        return (
          <ErrBlock
            error={{
              message: 'Title is missing',
              component: 'Cola',
            }}
          />
        );
      }

      return (
        <Paper withBorder>
          <Card
            py="md"
            px="xl"
            style={{
              cursor: 'pointer',

              borderBottomLeftRadius: Open ? 0 : 'var(--mantine-radius-md)',
              borderBottomRightRadius: Open ? 0 : 'var(--mantine-radius-md)',

              borderBottom: !Open
                ? 'none'
                : '1px solid var(--mantine-color-dark-4)',
            }}
            onClick={() => setOpen(!Open)}
          >
            <Group justify="space-between">
              {title}

              {Open ? (
                <IconChevronUp size={ICON_SIZE.SM} />
              ) : (
                <IconChevronDown size={ICON_SIZE.SM} />
              )}
            </Group>
          </Card>

          <Collapse in={Open} p="xl">
            <Stack>{children}</Stack>
          </Collapse>
        </Paper>
      );
    },

    ...components,
  };
}

import dynamic from 'next/dynamic';
import { CenterLoading } from './components/indie/center-loading';

import type { MDXComponents } from 'mdx/types';
import { toSlug } from './lib/helpers/toSlug';
import { useRouter } from 'next/router';
import { Children, useMemo } from 'react';
import { z } from 'zod';
import { type MermaidProps } from './components/mermaid';
import {
  Accordion,
  Alert,
  Anchor,
  Badge,
  Center,
  Code,
  Divider,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  alpha,
  useMantineColorScheme,
} from '@mantine/core';

const Mermaid = dynamic(
  () => import('./components/mermaid').then((mod) => mod.Mermaid),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const CodeHighlightTabs = dynamic(
  () => import('@mantine/code-highlight').then((mod) => mod.CodeHighlightTabs),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const CodeHighlight = dynamic(
  () => import('@mantine/code-highlight').then((mod) => mod.CodeHighlight),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const MDXErrorBlock = dynamic(
  () => import('./components/mdx/error-block').then((mod) => mod.MDXErrorBlock),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const MDXComparison = dynamic(
  () => import('./components/mdx/comparison').then((mod) => mod.MDXComparison),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const AreaChart = dynamic(
  () => import('@mantine/charts').then((mod) => mod.AreaChart),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const MDXHoverCard = dynamic(
  () => import('./components/mdx/hover-card').then((mod) => mod.MDXHoverCard),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const MDXTab = dynamic(
  () => import('./components/mdx/tabs').then((mod) => mod.MDXTab),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

const MDXMermaidMultiple = dynamic(
  () =>
    import('./components/mdx/mermaid-multiple').then(
      (mod) => mod.MDXMermaidMultiple
    ),
  {
    ssr: false,
    loading: () => <CenterLoading height="50px" />,
  }
);

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

const Alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const router = useRouter();

  const { colorScheme } = useMantineColorScheme();

  return {
    SimpleGrid: SimpleGrid,
    Group: Group,
    Text: Text,
    Center: Center,
    Grid: Grid,
    Paper: Paper,
    Stack: Stack,
    AreaChart: AreaChart,
    Alert: Alert,
    Divider: Divider,
    Comparison: MDXComparison,
    HoverCard: MDXHoverCard,
    Tab: MDXTab,
    MerM: MDXMermaidMultiple,

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
    h3: ({ children }) => (
      <h3
        data-mdx-heading
        data-heading={children}
        data-order={3}
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
      </h3>
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
          <MDXErrorBlock
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
    Mer: ({
      children,
      wrapper,
    }: {
      children: React.ReactNode;
      wrapper: MermaidProps['wrapper'];
    }) => {
      const parseResult = useMemo(() => {
        return codeBlockSchema.safeParse(children);
      }, [children]);

      if (!parseResult.success) {
        return (
          <MDXErrorBlock
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
          <MDXErrorBlock
            error={{
              message: 'Invalid language, it should be mermaid',
              language: parseResult.data.props.children.props.className,
            }}
          />
        );
      }

      return (
        <>
          <Mermaid
            chart={parseResult.data.props.children.props.children}
            wrapper={wrapper}
          />
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
          <MDXErrorBlock
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
          <MDXErrorBlock
            error={{
              message: 'File names are missing',
              component: 'CodeM',
            }}
          />
        );
      }

      if (parseResult.data?.length !== fileNames.length) {
        return (
          <MDXErrorBlock
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
      if (!title) {
        return (
          <MDXErrorBlock
            error={{
              message: 'Title is missing',
              component: 'Cola',
            }}
          />
        );
      }

      return (
        <>
          <Accordion variant="contained">
            <Accordion.Item value={title} key={title}>
              <Accordion.Control>{title}</Accordion.Control>
              <Accordion.Panel px="xl" py="xs">
                <Stack>{children}</Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </>
      );
    },

    Tag: ({ data }: { data: string[] }) => {
      if (!data || data.length === 0) {
        return (
          <MDXErrorBlock
            error={{
              message: 'Data is missing',
              component: 'Tag',
            }}
          />
        );
      }

      return (
        <Group>
          {Children.toArray(data).map((item) => (
            <>
              <Badge>{item}</Badge>
            </>
          ))}
        </Group>
      );
    },

    ChessBoard: ({ data }: { data: string[][] }) => {
      return (
        <Stack>
          {Children.toArray(
            data.map((item, index) => (
              <SimpleGrid cols={item.length + 1}>
                <Center h="100%">
                  <Text ta="center" fw="bold">
                    {index + 1}
                  </Text>
                </Center>

                {item.map((subItem) => (
                  <>
                    <Paper withBorder radius={0} h={45} px={5}>
                      <Center h="100%">
                        <Text fw="bold">{subItem}</Text>
                      </Center>
                    </Paper>
                  </>
                ))}
              </SimpleGrid>
            ))
          )}

          <SimpleGrid cols={data[0].length + 1}>
            {Children.toArray(
              Array.from({ length: data[0].length + 1 }).map((_, index) => (
                <Text ta="center" fw="bold">
                  {Alphabet[index]}
                </Text>
              ))
            )}
          </SimpleGrid>
        </Stack>
      );
    },

    ...components,
  };
}

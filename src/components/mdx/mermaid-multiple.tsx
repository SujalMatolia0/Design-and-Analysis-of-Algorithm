import { Children, useMemo, useState } from 'react';
import { z } from 'zod';
import { MDXErrorBlock } from './error-block';
import { Stack, Tabs } from '@mantine/core';
import { toSlug } from '@/lib/helpers/toSlug';
import { Mermaid } from '../mermaid';

interface MermaidMultipleProps {
  children: React.ReactNode;
  title: string[];
}

const childZod = z.array(
  z.object({
    type: z.literal('pre'),
    props: z.object({
      children: z.object({
        props: z.object({
          className: z.literal('language-mermaid'),
          children: z.string(),
        }),
      }),
    }),
  })
);

export const MDXMermaidMultiple = ({
  children,
  title,
}: MermaidMultipleProps) => {
  const [ActiveTab, setActiveTab] = useState(String(0));

  const parseResult = useMemo(() => {
    return childZod.safeParse(Children.toArray(children));
  }, [children]);

  if (!parseResult.success) {
    console.log('MDXMermaidMultiple', children);

    return (
      <MDXErrorBlock
        error={{
          message: 'Invalid mermaid block',
          error: parseResult.error,
        }}
      />
    );
  }

  if (parseResult.data.length !== title.length) {
    console.log('MDXMermaidMultiple', children, title);

    return (
      <MDXErrorBlock
        error={{
          message: 'Invalid mermaid block',
          error: new Error('Number of tabs and titles do not match'),
        }}
      />
    );
  }

  return (
    <Stack>
      <Tabs
        defaultValue={ActiveTab}
        onChange={(value) => {
          setActiveTab(value ?? toSlug(title[0]));
        }}
      >
        <Tabs.List>
          {Children.toArray(
            title.map((tab, index) => (
              <Tabs.Tab value={String(index)}>{tab}</Tabs.Tab>
            ))
          )}
        </Tabs.List>
      </Tabs>

      <Mermaid
        chart={
          parseResult.data[Number(ActiveTab)].props.children.props.children
        }
      />
    </Stack>
  );
};

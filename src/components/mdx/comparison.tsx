import { Children, useMemo } from 'react';
import { z } from 'zod';
import { MDXErrorBlock } from './error-block';
import {
  Divider,
  Grid,
  Paper,
  Stack,
} from '@mantine/core';

interface ComparisonProps {
  children: React.ReactNode;
  title: [string, string];
}

const childZod = z.array(
  z.object({
    type: z.literal('div'),
    props: z.object({
      children: z
        .array(
          z.object({
            type: z.literal('div'),
            props: z.object({
              children: z.any(),
            }),
          })
        )
        .max(2)
        .min(2),
    }),
  })
);

export const MDXComparison = ({ children, title }: ComparisonProps) => {
  const parseResult = useMemo(() => {
    return childZod.safeParse(Children.toArray(children));
  }, [children]);

  if (!parseResult.success) {
    console.log('MDXComparison', children);

    return (
      <MDXErrorBlock
        error={{
          message: 'Invalid comparison block',
          error: parseResult.error,
        }}
      />
    );
  }

  return (
    <>
      <Stack gap={0}>
        <Grid columns={2} mb="md">
          <Grid.Col span={1}>
            <Paper fw="bold">{title[0]}</Paper>
          </Grid.Col>
          <Grid.Col span={1}>
            <Paper fw="bold">{title[1]}</Paper>
          </Grid.Col>
        </Grid>

        {Children.toArray(
          parseResult.data.map((child, index) => {
            const [first, second] = child.props.children;

            console.log({
              first,
              second,
            });

            return (
              <>
                <Grid columns={2}>
                  <Grid.Col span={1}>
                    <Stack gap={0}>
                      <Divider label={index + 1} labelPosition="left" />

                      <Paper py="md">{first.props.children}</Paper>
                    </Stack>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <Stack gap={0}>
                      <Divider label={index + 1} labelPosition="right" />

                      <Paper py="md">{second.props.children}</Paper>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </>
            );
          })
        )}
      </Stack>
    </>
  );
};

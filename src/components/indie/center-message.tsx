import { Center, Stack, Text, Title } from '@mantine/core';

interface CenterMessageProps {
  height?: string;
  title: string;
  description: string;
}

export const CenterMessage = (props: CenterMessageProps) => (
  <>
    <Center h={props.height}>
      <Stack>
        <Title ta="center">{props.title}</Title>

        <Text c="dimmed" ta="center">
          {props.description}
        </Text>
      </Stack>
    </Center>
  </>
);

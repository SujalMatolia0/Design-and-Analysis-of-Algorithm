import { NavNestedLinks } from '@/lib/data';
import { Button, Center, Stack, Title } from '@mantine/core';
import Link from 'next/link';

export default function Home() {
  return (
    <Center h="100vh">
      <Stack>
        <Title>Design and Analysis of Algorithms</Title>

        <Button
          variant="transparent"
          component={Link}
          href={NavNestedLinks[0].links[0].href}
        >
          Start
        </Button>
      </Stack>
    </Center>
  );
}

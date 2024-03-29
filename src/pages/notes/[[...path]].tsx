import { ICON_SIZE } from '@/lib/const';
import { NavSectionLinks, getNestedLink } from '@/lib/data';
import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSun } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Children, useEffect, useState } from 'react';
import { NestedLink } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { marked } from 'marked';
import { CenterMessage } from '@/components/indie/center-message';
import { CenterLoading } from '@/components/indie/center-loading';

export default function Notes() {
  const [ActivePage, setActivePage] = useState<NestedLink | null>(null);

  const GetApi = useQuery({
    queryKey: ['markdown', ActivePage?.markdown],
    queryFn: async () => {
      console.log('ActivePage', ActivePage);

      if (!ActivePage) {
        return null;
      }

      const response = await fetch(ActivePage.markdown);

      if (!response.ok) {
        return null;
      }

      const rawMarkdown = await response.text();

      const parsedMarkdown = await marked.parse(rawMarkdown);

      return parsedMarkdown;
    },
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !!ActivePage,
  });

  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();

  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  useEffect(() => {
    setActivePage(getNestedLink(router.asPath));
  }, [router.asPath, router.isReady]);

  return (
    <AppShell
      header={{ height: 80 }}
      navbar={{ width: 350, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group
          h="100%"
          px="md"
          justify="space-between"
          bg={colorScheme === 'light' ? 'brown.1' : 'transparent'}
        >
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title maw={230} order={3} lh={1.1}>
              Design and Analysis of Algorithms
            </Title>
          </Group>

          <Group>
            <ActionIcon
              size="xl"
              variant="transparent"
              {...(colorScheme === 'light' ? { color: 'dark.9' } : {})}
            >
              <Box w={ICON_SIZE.LG + 5}>
                <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </Box>
            </ActionIcon>
            <ActionIcon
              size="xl"
              variant="transparent"
              onClick={toggleColorScheme}
              {...(colorScheme === 'light' ? { color: 'dark.9' } : {})}
            >
              {colorScheme === 'light' ? (
                <IconMoon size={ICON_SIZE.LG} />
              ) : (
                <IconSun size={ICON_SIZE.LG} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Stack mt="lg" gap="xs">
          {Children.toArray(
            NavSectionLinks.map((link) => (
              <>
                <Title px={23} order={4}>
                  {link.category}
                </Title>
                <Stack gap={5}>
                  {Children.toArray(
                    link.links.map((nestedLink) => (
                      <Button
                        size="md"
                        variant={
                          ActivePage?.href === nestedLink.href
                            ? 'filled'
                            : `subtle-${colorScheme}`
                        }
                        justify="left"
                        fw="normal"
                        component={Link}
                        href={nestedLink.href}
                      >
                        {nestedLink.title}
                      </Button>
                    ))
                  )}
                </Stack>
              </>
            ))
          )}
        </Stack>
      </AppShell.Navbar>
      <AppShell.Main>
        <Container>
          <Stack>
            {(() => {
              if (GetApi.isLoading) {
                return <CenterLoading height="calc(100vh - 140px)" />;
              }

              if (GetApi.isError) {
                return (
                  <CenterMessage
                    height="calc(100vh - 140px)"
                    title="Failed to load content"
                    description="Please try again later"
                  />
                );
              }

              if (!GetApi.data) {
                return (
                  <CenterMessage
                    height="calc(100vh - 140px)"
                    title="No content found"
                    description="Please try again later"
                  />
                );
              }

              return (
                <TypographyStylesProvider>
                  <div dangerouslySetInnerHTML={{ __html: GetApi.data }} />
                </TypographyStylesProvider>
              );
            })()}

            <Divider />

            <Group justify="space-between">
              <Text>Design and Analysis of Algorithms</Text>

              <Button
                variant="transparent"
                color="dark"
                style={{
                  pointerEvents: GetApi.data ? 'auto' : 'none',
                }}
              >
                {GetApi.data ? 'Edit this page on GitHub' : '404'}
              </Button>
            </Group>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

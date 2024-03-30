import { ICON_SIZE } from '@/lib/const';
import { NavNestedLinks, NavLinks } from '@/lib/data';
import {
  ActionIcon,
  AppShell,
  Box,
  Burger,
  Button,
  Container,
  Divider,
  Group,
  NavLink,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconMoon, IconSearch, IconSun } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Children, useMemo } from 'react';
import { TableOfContents } from '../table-of-contents';
import { Spotlight, SpotlightActionData, spotlight } from '@mantine/spotlight';

export const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();

  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  const spotlightActions: SpotlightActionData[] = useMemo(() => {
    return NavLinks.map((link) => ({
      id: link.href,
      label: link.label,
      description: link.description,
      onClick: () => {
        router.push(link.href);
        spotlight.close();
      },
    }));
  }, [router]);

  return (
    <>
      <Spotlight
        actions={spotlightActions}
        nothingFound="Nothing found..."
        searchProps={{
          placeholder: 'Search...',
        }}
      />
      <AppShell
        header={{ height: 80, offset: true }}
        navbar={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        aside={{
          width: 300,
          breakpoint: 'md',
          collapsed: { desktop: false, mobile: true },
        }}
        padding="xl"
      >
        <AppShell.Header zIndex={1000}>
          <Group
            h="100%"
            px="md"
            justify="space-between"
            bg={colorScheme === 'light' ? 'brown.0' : 'transparent'}
          >
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
              />
              <Text
                maw={210}
                size="xl"
                lh={1.1}
                fw="bold"
                component={Link}
                href="/"
              >
                Design and Analysis of Algorithms
              </Text>
            </Group>

            <Group>
              <ActionIcon
                size="xl"
                variant="transparent"
                onClick={spotlight.open}
                {...(colorScheme === 'light' ? { color: 'dark.9' } : {})}
              >
                <IconSearch size={ICON_SIZE.LG} />
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

              <ActionIcon
                size="xl"
                variant="transparent"
                {...(colorScheme === 'light' ? { color: 'dark.9' } : {})}
                component={Link}
                href="https://github.com/mohitxskull/Design-and-Analysis-of-Algorithm"
              >
                <Box w={ICON_SIZE.LG + 5}>
                  <svg
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
                  </svg>
                </Box>
              </ActionIcon>
            </Group>
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md" zIndex={1000}>
          <Stack mt="lg" gap="xs">
            {Children.toArray(
              NavNestedLinks.map((link) => (
                <>
                  <Title pl="lg" order={4}>
                    {link.category}
                  </Title>
                  <Stack gap={5}>
                    {Children.toArray(
                      link.links.map((nestedLink) => (
                        <NavLink
                          style={{
                            borderRadius: 'var(--mantine-radius-md)',
                          }}
                          href={nestedLink.href}
                          label={nestedLink.label}
                          active={router.pathname === nestedLink.href}
                          pl="lg"
                          onClick={toggle}
                        />
                      ))
                    )}
                  </Stack>
                </>
              ))
            )}
          </Stack>
        </AppShell.Navbar>
        <AppShell.Aside withBorder={false} p="md">
          <TableOfContents />
        </AppShell.Aside>
        <AppShell.Main>
          <Container>
            <Stack id="mdx">
              {children}

              <Divider />

              <Group justify="space-between">
                <Text>Design and Analysis of Algorithms</Text>

                <Button
                  variant="transparent"
                  component={Link}
                  href={`https://github.com/mohitxskull/Design-and-Analysis-of-Algorithm/blob/main/src/pages${router.pathname}.mdx`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Edit this page on GitHub
                </Button>
              </Group>
            </Stack>
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
};

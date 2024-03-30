import React, { Children, useEffect, useRef, useState } from 'react';

import {
  NavLink,
  Stack,
  Text,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { Heading, getHeadings } from '../../lib/helpers/getHeadings';

function getActiveElement(rects: DOMRect[]) {
  if (rects.length === 0) {
    return -1;
  }

  const closest = rects.reduce(
    (acc, item, index) => {
      if (Math.abs(acc.position - 200) < Math.abs(item.y)) {
        return acc;
      }

      return {
        index,
        position: item.y,
      };
    },
    { index: 0, position: rects[0].y }
  );

  return closest.index;
}

export function TableOfContents() {
  const [active, setActive] = useState(0);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const headingsRef = useRef<Heading[]>([]);

  const { colorScheme } = useMantineColorScheme();

  const filteredHeadings = headings.filter((heading) => heading.depth > 0);

  const handleScroll = () => {
    setActive(
      getActiveElement(
        headingsRef.current.map((d) => d.getNode()?.getBoundingClientRect())
      )
    );
  };

  useEffect(() => {
    const _headings = getHeadings();

    headingsRef.current = _headings;

    setHeadings(_headings);

    setActive(
      getActiveElement(
        _headings.map((d: any) => d.getNode().getBoundingClientRect())
      )
    );

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (filteredHeadings.length === 0) {
    return null;
  }

  return (
    <Stack mt="lg" gap="xs">
      <Title order={4}>Table of contents</Title>

      <Stack gap={0}>
        {Children.toArray(
          filteredHeadings.map((heading, index) => (
            <NavLink
              styles={{
                root: {
                  backgroundColor: 'transparent',
                },
              }}
              href={`#${heading.id}`}
              active={active === index}
              pl={(heading.depth - 1) * 15}
              label={heading.content}
            />
          ))
        )}
      </Stack>
    </Stack>
  );
}

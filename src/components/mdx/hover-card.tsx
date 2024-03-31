import { HoverCard } from '@mantine/core';
import { MDXErrorBlock } from './error-block';

interface HoverCardProps {
  children: React.ReactNode;
  data: React.ReactNode;
  width?: number;
}

export const MDXHoverCard = ({ children, data, width }: HoverCardProps) => {
  if (!children || !data) {
    console.log('MDXHoverCard', children, data);

    return (
      <MDXErrorBlock
        error={{
          message: 'Invalid hover card block',
          error: 'Children and data are required',
        }}
      />
    );
  }

  return (
    <>
      <HoverCard width={width ?? 280} withArrow position="top-start" shadow="xl">
        <HoverCard.Target>{children}</HoverCard.Target>
        <HoverCard.Dropdown>{data}</HoverCard.Dropdown>
      </HoverCard>
    </>
  );
};

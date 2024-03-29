import { Center, Loader } from '@mantine/core';

interface CenterLoadingProps {
  height?: string;
}

export const CenterLoading = (props: CenterLoadingProps) => (
  <>
    <Center h={props.height}>
      <Loader />
    </Center>
  </>
);

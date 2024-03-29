import { Text, type TextProps } from '@mantine/core';
import { useClipboard } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { type ReactNode } from 'react';

interface TextWithClipboardProps {
  children: ReactNode;
  data: string;
  dataName: string;
  props?: TextProps;
}

export const TextWithClipboard = (props: TextWithClipboardProps) => {
  const clipboard = useClipboard({ timeout: 500 });

  return (
    <>
      <Text
        style={{ cursor: clipboard.copied ? 'not-allowed' : 'pointer' }}
        onClick={() => {
          if (clipboard.copied) {
            return;
          }

          clipboard.copy(props.data);

          notifications.show({
            title: 'Copied',
            message: `Copied ${props.dataName} to clipboard`,
          });
        }}
        {...props.props}
      >
        {props.children}
      </Text>
    </>
  );
};

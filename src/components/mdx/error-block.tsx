import { CodeHighlight } from '@mantine/code-highlight';

interface ErrorBlockProps {
  error: object;
}

export const MDXErrorBlock = ({ error }: ErrorBlockProps) => (
  <CodeHighlight language="json" code={JSON.stringify(error, null, 2)} />
);

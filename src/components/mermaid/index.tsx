import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useMantineColorScheme } from '@mantine/core';
import { instrumentSans } from '@/lib/font';

export type MermaidProps = {
  chart: string;
};

export const Mermaid = ({ chart }: MermaidProps) => {
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: colorScheme === 'dark' ? 'dark' : 'light',
      fontFamily: instrumentSans.style.fontFamily,
      altFontFamily: instrumentSans.style.fontFamily,
      flowchart: {
        htmlLabels: true,
      }
    });

    document
      .querySelectorAll('div.mermaid[data-processed="true"]')
      .forEach((v) => {
        v.removeAttribute('data-processed');
        v.innerHTML = v.getAttribute('data-mermaid-src') as string;
      });

    mermaid.contentLoaded();
  }, [colorScheme]);

  useEffect(() => {
    setTimeout(mermaid.contentLoaded, 0);
  }, [chart]);

  return (
    <div className="mermaid" data-mermaid-src={chart}>
      {chart}
    </div>
  );
};

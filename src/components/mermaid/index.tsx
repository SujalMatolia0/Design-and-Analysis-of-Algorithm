import { useEffect } from 'react';
import mermaid from 'mermaid';
import { useMantineColorScheme } from '@mantine/core';
import { instrumentSans } from '@/lib/font';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

export type MermaidProps = {
  chart: string;
  wrapper?: {
    height?: string;
    initialScale?: number;
    initialPositionX?: number;
    initialPositionY?: number;
  };
};

export const Mermaid = ({ chart, wrapper }: MermaidProps) => {
  const { colorScheme } = useMantineColorScheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: colorScheme === 'dark' ? 'dark' : 'light',
      fontFamily: instrumentSans.style.fontFamily,
      altFontFamily: instrumentSans.style.fontFamily,
      htmlLabels: true,
    });

    document
      .querySelectorAll('div.mermaid[data-processed="true"]')
      .forEach((v) => {
        v.removeAttribute('data-processed');
        v.innerHTML = v.getAttribute('data-mermaid-src') as string;
      });

    mermaid.contentLoaded();
  }, [colorScheme, chart]);

  useEffect(() => {
    setTimeout(mermaid.contentLoaded, 0);
  }, [chart]);

  if (wrapper) {
    return (
      <TransformWrapper
        initialScale={wrapper.initialScale || 1}
        initialPositionX={wrapper.initialPositionX}
        initialPositionY={wrapper.initialPositionY}
        doubleClick={{
          step: 1.5,
        }}
        wheel={{
          step: 1800,
        }}
        minScale={2}
      >
        <TransformComponent
          wrapperStyle={{
            width: '100%',
            height: wrapper.height,
          }}
        >
          <div className="mermaid" data-mermaid-src={chart}>
            {chart}
          </div>
        </TransformComponent>
      </TransformWrapper>
    );
  }

  return (
    <>
      <div className="mermaid" data-mermaid-src={chart}>
        {chart}
      </div>
    </>
  );
};

import '@/styles/globals.css';

import '@mantine/core/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/notifications/styles.css';

import type { AppProps } from 'next/app';
import {
  createTheme,
  defaultVariantColorsResolver,
  MantineProvider,
  VariantColorsResolver,
} from '@mantine/core';
import { NavigationProgress } from '@mantine/nprogress';
import { Notifications } from '@mantine/notifications';
import { Instrument_Sans } from 'next/font/google';
import Head from 'next/head';
import { MetaTagsComp } from '@/components/indie/meta-tags';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotesLayout } from '@/components/layout/notes';
import { useEffect, useState } from 'react';
import Script from 'next/script';

const instrumentSans = Instrument_Sans({ subsets: ['latin'] });

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  if (input.variant === 'subtle-light') {
    return {
      ...defaultResolvedColors,
      background: 'transparent',
      hover: 'var(--mantine-color-gray-1)',
      color: 'var(--mantine-color-dark-9)',
    };
  }

  if (input.variant === 'subtle-dark') {
    return {
      ...defaultResolvedColors,
      background: 'transparent',
      hover: 'rgba(255, 255, 255, 0.1)',
      color: `var(--mantine-color-${input.theme.primaryColor}-${input.theme.primaryShade})`,
    };
  }

  if (input.variant === 'filled') {
    return {
      ...defaultResolvedColors,
      color: 'var(--mantine-color-dark-9)',
      hover: `var(--mantine-color-${input.theme.primaryColor}-${input.theme.primaryShade})`,
    };
  }

  return defaultResolvedColors;
};

const theme = createTheme({
  variantColorResolver,

  fontFamily: instrumentSans.style.fontFamily,
  fontFamilyMonospace: 'Space Mono, monospace',
  headings: {
    fontFamily: instrumentSans.style.fontFamily,
  },

  colors: {
    brown: [
      '#fefdfc',
      '#fcf9f6',
      '#f6eee7',
      '#f0e4d9',
      '#ebdaca',
      '#e4cdb7',
      '#dcbc9f',
      '#cea37e',
      '#ad7f58',
      '#a07553',
      '#815e46',
      '#3e332e',
    ],
  },

  defaultRadius: 'md',

  primaryColor: 'brown',
  primaryShade: 4,
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps, router }: AppProps) {
  const [isClient, setIsClient] = useState(false);

  const renderNotesShell = router.pathname.includes('/notes');

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG}`}
      />

      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GTAG}');
        `}
      </Script>
      <Head>
        <title>Design and Analysis of Algorithms</title>

        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <MetaTagsComp
          title="Design and Analysis of Algorithms"
          description="Notes of Design and Analysis of Algorithms"
          siteName="D.A.A"
          url="https://daa.mohitxskull.dev/"
          twitterHandle="mohitxskull"
          image="https://daa.mohitxskull.dev/og-banner.png"
        />

        <link rel="icon" href="/favi.png" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme}>
          <NavigationProgress />
          <Notifications />

          {renderNotesShell ? (
            <NotesLayout>
              <Component {...pageProps} />
            </NotesLayout>
          ) : (
            <Component {...pageProps} />
          )}
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}

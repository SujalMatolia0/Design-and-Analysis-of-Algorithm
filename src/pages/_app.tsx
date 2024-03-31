import '@/styles/globals.css';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/charts/styles.css';

import dynamic from 'next/dynamic';

import type { AppProps } from 'next/app';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Head from 'next/head';
import { MetaTagsComp } from '@/components/indie/meta-tags';
import Script from 'next/script';
import { instrumentSans } from '@/lib/font';
import { CenterLoading } from '@/components/indie/center-loading';

const NotesLayout = dynamic(
  () => import('@/components/layout/notes').then((mod) => mod.NotesLayout),
  {
    ssr: false,
    loading: () => <CenterLoading height="100vh" />,
  }
);

const theme = createTheme({
  fontFamily: instrumentSans.style.fontFamily,
  fontFamilyMonospace: 'Space Mono, monospace',
  headings: {
    fontFamily: instrumentSans.style.fontFamily,
  },

  colors: {
    brown: [
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
    ],
  },

  black: '#111110',

  defaultRadius: 'md',

  primaryColor: 'brown',
  primaryShade: 9,
});

export default function App({ Component, pageProps, router }: AppProps) {
  const renderNotesShell = router.pathname.includes('/notes');

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

        <MetaTagsComp
          title="Design and Analysis of Algorithms"
          description="Notes of Design and Analysis of Algorithms"
          siteName="D.A.A"
          url="https://daa.mohitxskull.dev/"
          twitterHandle="mohitxskull"
          image="https://daa.mohitxskull.dev/og-banner.png"
        />

        <link rel="icon" href="/favicon.png" />
      </Head>

      <MantineProvider theme={theme}>
        <Notifications />

        {renderNotesShell ? (
          <NotesLayout>
            <Component {...pageProps} />
          </NotesLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </MantineProvider>
    </>
  );
}

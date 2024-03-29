import React from 'react';

export const MetaTagsComp = (props: {
  title: string;
  description: string;
  url: string;
  image: string;
  twitterHandle: string;
  siteName: string;
}) => (
  <>
    <meta property="og:title" content={props.title} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={props.url} />
    <meta property="og:image" content={props.image} />
    <meta property="og:description" content={props.description} />
    <meta property="og:site_name" content={props.siteName} />

    <meta name="description" content={props.description} />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content={props.twitterHandle} />
    <meta name="twitter:creator" content={props.twitterHandle} />
    <meta name="twitter:title" content={props.title} />
    <meta name="twitter:description" content={props.description} />
    <meta name="twitter:image" content={props.image} />
  </>
);

import type {EntryContext} from '@netlify/remix-runtime';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const localDirectives =
    process.env.NODE_ENV === 'development'
      ? ['localhost:*', 'ws://localhost:*', 'ws://127.0.0.1:*']
      : [];

  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    defaultSrc: [
      "'self'",
      'cdn.shopify.com',
      'shopify.com',
      '*.youtube.com',
      '*.google.com',
      'fonts.gstatic.com',
      'https://cdn-cookieyes.com',
      'https://log.cookieyes.com',
      ...localDirectives,
    ],
    imgSrc: [
      "'self'",
      'data:',
      'cdn.shopify.com',
      'https://cdn-cookieyes.com',
      'https://log.cookieyes.com',
      ...localDirectives,
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      'fonts.googleapis.com',
      'cdn.shopify.com',
      'https://cdn-cookieyes.com',
      'https://log.cookieyes.com',
      ...localDirectives,
    ],
    connectSrc: [
      "'self'",
      'https://monorail-edge.shopifysvc.com',
      'https://cdn-cookieyes.com',
      'https://log.cookieyes.com',
      ...localDirectives,
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

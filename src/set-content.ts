import { E2EPageInternal } from '@stencil/core/testing/puppeteer/puppeteer-declarations';
import * as puppeteer from 'puppeteer';

// Stupid StencilJS decided to mock setContent to be their own dumb thing so that addScript and similar calls don't work
// This is our own override of their override. This allows us to add the mock manifest client.
// The code in master on their repo has some differences in the scripts it includes from env vars than what is currently available
// so I added some condition garbage that should gracefully handle it so that it doesn't blow up when we update stencil/core
// don't use the html constructor property for newE2EPage() because that will break this and you will have a bad time.
//https://github.com/ionic-team/stencil/blob/master/src/testing/puppeteer/puppeteer-page.ts
export async function e2eSetContent(
  page: E2EPageInternal,
  html: string,
  options: puppeteer.NavigationOptions = {}
) {
  const mockManifestClientUrl =
    'https://mi-mock-clients.s3-eu-west-1.amazonaws.com/miManifestClientV1.js';
  const STENCIL_TIMEOUT = 4500;

  if (page.isClosed()) {
    throw new Error('e2eSetContent unavailable: page already closed');
  }
  if (typeof html !== 'string') {
    throw new Error('invalid e2eSetContent() html');
  }

  const output: string[] = [];

  const appUrl = process.env.__STENCIL_APP_URL__; // this is the existing url that combines css and js
  const appScriptUrl = process.env.__STENCIL_APP_SCRIPT_URL__; // this is part of the unreleased update
  const appStyleUrl = process.env.__STENCIL_APP_STYLE_URL__; // this is part of the unreleased update

  output.push(`<!doctype html>`);
  output.push(`<html>`);
  output.push(`<head>`);
  output.push(`<script src="${mockManifestClientUrl}"></script>`);

  if (typeof appUrl === 'string') {
    output.push(`<script type="module" src="${appUrl}"></script>`);
  } else if (typeof appScriptUrl === 'string') {
    output.push(`<script type="module" src="${appScriptUrl}"></script>`);
  }

  if (typeof appStyleUrl === 'string') {
    output.push(`<link rel="stylesheet" href="${appStyleUrl}">`);
  }

  output.push(`</head>`);
  output.push(`<body>`);
  output.push(html);
  output.push(`</body>`);
  output.push(`</html>`);

  const pageUrl = process.env.__STENCIL_BROWSER_URL__; // this should always be here

  await page.setRequestInterception(true);
  page.on('request', interceptedRequest => {
    if (pageUrl === interceptedRequest.url()) {
      interceptedRequest.respond({
        status: 200,
        contentType: 'text/html',
        body: output.join('\n')
      });
    } else {
      interceptedRequest.continue();
    }
  });

  if (!options.waitUntil) {
    options.waitUntil = process.env.__STENCIL_BROWSER_WAIT_UNTIL as any;
  }
  const rsp = await page._e2eGoto(pageUrl, options);

  if (!rsp.ok()) {
    throw new Error(`Testing unable to load content`);
  }

  // This waits for stencil
  try {
    await page.waitForFunction('window.stencilAppLoaded', {
      timeout: STENCIL_TIMEOUT
    });
  } catch (e) {
    throw new Error(
      `App did not load in allowed time. Please ensure the content loads a stencil application.`
    );
  }

  return rsp;
}
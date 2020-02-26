import { E2EPageInternal } from "@stencil/core/testing/puppeteer/puppeteer-declarations";
import * as puppeteer from "puppeteer";

import { AddTagOptions } from './interfaces/add-tag-options';

export async function e2eSetContent(
  page: E2EPageInternal,
  html: string,
  navigationOptions?: puppeteer.NavigationOptions,
  moreOptions?: AddTagOptions
): Promise<puppeteer.Response> {
  const STENCIL_TIMEOUT = 4500;

  navigationOptions = navigationOptions ? navigationOptions : {};
  moreOptions = moreOptions ? moreOptions : {};

  if (page.isClosed()) {
    throw new Error("e2eSetContent unavailable: page already closed");
  }
  if (typeof html !== "string") {
    throw new Error("invalid e2eSetContent() html");
  }

  const output: string[] = [];

  const appUrl = process.env.__STENCIL_APP_URL__; // this is the existing url that combines css and js
  const appScriptUrl = process.env.__STENCIL_APP_SCRIPT_URL__; // this is part of the unreleased update
  const appStyleUrl = process.env.__STENCIL_APP_STYLE_URL__; // this is part of the unreleased update

  output.push(`<!doctype html>`);
  output.push(`<html>`);
  output.push(`<head>`);

  moreOptions?.script?.forEach(scriptSrc => {
    output.push(`<script src="${scriptSrc}"></script>`);
  });

  if (typeof appUrl === "string") {
    output.push(`<script type="module" src="${appUrl}"></script>`);
  } else if (typeof appScriptUrl === "string") {
    output.push(`<script type="module" src="${appScriptUrl}"></script>`);
  }

  moreOptions?.style?.forEach(styleTag => {
    output.push(`<link rel="stylesheet" href="${styleTag}">`);
  });

  if (typeof appStyleUrl === "string") {
    output.push(`<link rel="stylesheet" href="${appStyleUrl}">`);
  }

  output.push(`</head>`);
  output.push(`<body>`);
  output.push(html);
  output.push(`</body>`);
  output.push(`</html>`);

  const pageUrl: string = process.env.__STENCIL_BROWSER_URL__; // this should always be here

  await page.setRequestInterception(true);
  page.on("request", interceptedRequest => {
    if (pageUrl === interceptedRequest.url()) {
      interceptedRequest.respond({
        status: 200,
        contentType: "text/html",
        body: output.join("\n"),
      });
    } else {
      interceptedRequest.continue();
    }
  });

  if (!navigationOptions.waitUntil) {
    navigationOptions.waitUntil = process.env.__STENCIL_BROWSER_WAIT_UNTIL as any;
  }
  const rsp = await page._e2eGoto(pageUrl, navigationOptions);

  if (!rsp.ok()) {
    throw new Error(`Testing unable to load content`);
  }

  // This waits for stencil
  try {
    await page.waitForFunction("window.stencilAppLoaded", {
      timeout: STENCIL_TIMEOUT,
    });
  } catch (e) {
    throw new Error(
      `App did not load in allowed time. Please ensure the content loads a stencil application.`
    );
  }

  return rsp;
}

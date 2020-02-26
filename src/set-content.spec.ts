import { e2eSetContent } from './set-content';

import { E2EPageInternal } from "@stencil/core/testing/puppeteer/puppeteer-declarations";
import { createJestPuppeteerEnvironment } from '@stencil/core/testing/jest/jest-environment';
import * as puppeteer from "puppeteer";

//import { AddTagOptions } from './interfaces/add-tag-options';

describe('e2eSetContent', () => {
  test('it should pass', () => {
    expect(true).toBe(true);
  })
  test('it should return a puppeteer Response object', async () => {
    // let browser = await createJestPuppeteerEnvironment();
    // let b = new browser({});
    // let page = await b.newPuppeteerPage();


    // const result = e2eSetContent(page, '<tomato-soup></tomato-soup>');
  });
});
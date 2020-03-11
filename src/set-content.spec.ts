import { e2eSetContent } from './set-content';

import { E2EPageInternal } from "@stencil/core/testing/puppeteer/puppeteer-declarations";
import { createJestPuppeteerEnvironment } from '@stencil/core/testing'; //jest-environment
import * as puppeteer from "puppeteer";

//import { AddTagOptions } from './interfaces/add-tag-options';

describe('e2eSetContent', () => {
  test('shall pass', () => {
    expect(true).toBe(true);
  })
  test('shall return a puppeteer Response object', async () => {
    let browser = createJestPuppeteerEnvironment();
    console.log(browser);
    //newPuppeteerPage();
    // let b = new browser({});
    // let page = await b.newPuppeteerPage();


    // const result = e2eSetContent(page, '<tomato-soup></tomato-soup>');
  });

  test('shall inject script and style tags when supplied', () => {

  });

  test('shall accept and inject only script tags', () => {

  });

  test('shall accept and inject only style tags', () => {
    
  });

  test('shall succeed when optional parameters are omitted', () => {

  });
});
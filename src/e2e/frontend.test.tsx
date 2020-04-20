import React from 'react';
import puppeteer from 'puppeteer';

const iPhone = puppeteer.devices['iPhone 6'];
const timeout = process.env.SLOWMO ? 30000 : 10000;
describe('Test home page', () => {
  test(
    'Title of the page',
    async () => {
      let browser = await puppeteer.launch({
        headless: false,
      });
      let page = await browser.newPage();
      await page.goto('http://localhost:3000');
      const title = await page.title();
      expect(title).toBe('Elephant Vending Machine');
      //browser.close();
    },
    timeout
  );

  test('test mobile version', async () => {
    let browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('http://localhost:3000');
    // other actions...
    //await browser.close();
  });

  test('capture screenshot of home page', async () => {
    let browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.screenshot({ path: 'home_page.png' });
    //await browser.close();
  });
});

import React from 'react';
import puppeteer from 'puppeteer';

const iPhone = puppeteer.devices['iPhone 6'];
const timeout = process.env.SLOWMO ? 30000 : 10000;
describe('Test run_experiments page', () => {
  test(
    'Header of the page',
    async () => {
      let browser = await puppeteer.launch({
        headless: false,
      });
      let page = await browser.newPage();
      await page.goto('http://localhost:3000/experimentRunner');
      const titleText = await page.$eval('h1', node => node.innerText);
      expect(titleText).toEqual('Please select a file to run:');
    },
    timeout
  );

  test('test mobile version', async () => {
    let browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('http://localhost:3000/experimentRunner');
    // other actions...
  });

  test('capture screenshot of experiment_run page', async () => {
    let browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/experimentRunner');
    await page.screenshot({ path: 'run_experiment.png' });
  });
});

import React from 'react';
import puppeteer from 'puppeteer';

const iPhone = puppeteer.devices['iPhone 6'];
const timeout = process.env.SLOWMO ? 30000 : 10000;
describe('Test log files page', () => {
  test('test mobile version', async () => {
    let browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.emulate(iPhone);
    await page.goto('http://localhost:3000/logs');
    // other actions...
    //await browser.close();
  });

  test('capture screenshot of experiment_run page', async () => {
    let browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/logs');
    await page.screenshot({ path: 'experiment_page.png' });
    //await browser.close();
  });

  // test('download file',async () => {
  //     let browser = await puppeteer.launch({
  //       headless: false,
  //     });
  //     const page = await browser.newPage();
  //     await page.goto('http://localhost:3000/logs');
  //     // get the selector input type=file (for upload file)
  //     await page.waitForSelector('input[type=file]');
  //     await page.waitFor(1000);

  //     // get the ElementHandle of the selector above
  //     const inputUploadHandle = await page.$('input[type=file]');

  //     let fileToUpload = 'example_experiment_copy.py';
  //     inputUploadHandle.uploadFile(fileToUpload);

  //     // doing click on button to trigger upload file
  //     await page.waitForSelector('#upload');
  //     await page.evaluate(() => document.getElementById('upload').click());

  //     // wait for selector that contains the uploaded file URL
  //     await page.waitForSelector('#upload-link');
  //     await page.waitFor(5000);
  //   })
});

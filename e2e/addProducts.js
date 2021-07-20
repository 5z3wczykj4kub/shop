const path = require('path');

const puppeteer = require('puppeteer');

const products = require('./utils/products');

async function addProduct() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
    args: ['--window-size=1920,1080'],
  });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1440,
    height: 810,
    deviceScaleFactor: 1,
  });

  for await (product of products) {
    await page.goto('http://localhost:3000/add-product');
    await page.type('#product-name', product.name);
    await page.type('#product-description', product.description);
    await page.type('#product-price', product.price.toString());

    if (product.imageName) {
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('.product-image__label'),
      ]);
      await fileChooser.accept([
        path.join(
          __dirname,
          '..',
          '..',
          'samples',
          'images',
          product.imageName
        ),
      ]);
    }
    await page.click('button.add-product-form__buttons__submit');
  }
  await browser.close();
}
addProduct();

const puppeteer = require('puppeteer');
// const numbers = [];

async function parseAutoRia(url = "https://auto.ria.com/uk/auto_volvo_xc90_34163215.html") {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // const url = 'https://auto.ria.com/uk/auto_volvo_xc90_34163215.html';
    await page.goto(url);

    const phoneElement = await page.$('.phone');
    if (phoneElement) {
        const number = await page.$eval('.phone', element => element.textContent.trim());
        await phoneElement.click();
        await page.waitForTimeout(3000);
        const phoneNumber = await page.$eval('.phone', element => element.textContent.trim());
        console.log(phoneNumber);
    }

    await browser.close();
}

function getJson(data) {
    console.log(data);
}

// parseAutoRia()

module.exports = {
  getJson,
};

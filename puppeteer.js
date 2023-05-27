const puppeteer = require('puppeteer');
// const numbers = [];

async function parseAutoRia(url = "/auto_volvo_xc90_34163215.html") {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const phoneElement = await page.$('.phone');
    if (phoneElement) {
        const number = await page.$eval('.phone', element => element.textContent.trim());
        await phoneElement.click();
        await page.waitForTimeout(3000);
        const phoneNumber = await page.$eval('.phone', element => element.textContent.trim());
        if (phoneNumber !== undefined && phoneNumber !== null) {
            console.log(phoneNumber);
            return phoneNumber;
        }
    }

    await browser.close();
}

function getJson(data) {
    const autoria_url = 'https://auto.ria.com/uk'
    let phones = [];
    const promises = data.map((e) => {
        return parseAutoRia(autoria_url + e);
    });

    Promise.all(promises)
    .then((phoneNumbers) => {

        const url = 'http://127.0.0.1:8000/get_phones/';

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(phoneNumbers),
        };

        console.log(JSON.stringify(phoneNumbers));

        fetch(url, requestOptions)
          .then(response => response.json())
          .then(data => {
            console.log(data);
          })
          .catch(error => {
            console.error('Ошибка при выполнении POST-запроса:', error);
          });
    });
}

// parseAutoRia()

module.exports = {
  getJson,
};

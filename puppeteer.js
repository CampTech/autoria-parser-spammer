const puppeteer = require('puppeteer');

async function isValidPhoneNumber(number) {
    const pattern = /^[\d()]+$/;
    return pattern.test(number);
}

async function parseAutoRia(urls, browser) {
    // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox'], timeout: 0});
    const page = await browser.newPage();
    const phones = [];

    let index = 0;

    for (let url of urls) {
        index++;
        if (index < 3) {
            await page.goto(url, {waitUntil: 'networkidle0', timeout: 0});
            const phoneElement = await page.$('.phone');
            if (phoneElement) {
                await phoneElement.click();
                await page.waitForTimeout(4000);
                let phoneNumber = await page.$eval('.phone', element => element.textContent.trim());
                phoneNumber = phoneNumber.replace(/\s/g, "");
                if (phoneNumber !== undefined && phoneNumber !== null) {
                    if (await isValidPhoneNumber(phoneNumber)) {
                        console.log(phoneNumber);
                        phones.push(phoneNumber);
                    } else {
                        console.log('По идеи не правильный ' + phoneNumber)
                    }
                }
            }
        }
    }
    return phones;
}


function parseSearch(data, url = "https://auto.ria.com/uk/advanced-search/") {
    return new Promise(async (resolve, reject) => {
        console.log('start');
        const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
        const page = await browser.newPage();
        await page.goto(url, {waitUntil: 'networkidle0', timeout: 0});

        const cookie = await page.$('label.js-close.c-notifier-btn');
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        if (data.select.length !== 0) {
            for (let select of data.select) {
                const selectElement = await page.$(select.element);
                await selectElement.focus();
                await page.keyboard.press('ArrowDown');
                await selectElement.select(select.value);
            }
        }

        if (data.search.length !== 0) {
            for (let el of data.search) {
                const label = await page.$(el.label);
                const input = await page.$(el.element);
                await label.click();
                await page.evaluate((e) => e.click(), label);
                await label.focus();
                await input.type(el.value, {delay: 100});
                const liElement = await input.evaluateHandle((e) => {
                    return e.parentElement.querySelector('ul li')
                });
                await page.waitForTimeout(5000);

                await liElement.click();
            }
        }

        if (data.radio.length !== 0) {
            for (let radio of data.radio) {
                await page.waitForTimeout(1000);
                const radioElement = await page.$(radio.label);
                if (radioElement !== null) {
                    await radioElement.click();
                }
            }
        }

        const submit = await page.$('button.button.small');
        await page.waitForTimeout(5000);
        await submit.click();
        await page.evaluate((e) => e.click(), submit);
        await page.waitForTimeout(10000);
        console.log('end');


        if (await page.$('.item.ticket-title a')) {
            const hrefs = await page.$$eval('.item.ticket-title a', links => links.map(link => link.href));

            const phoneNumbers = await parseAutoRia(hrefs, browser);
            await browser.close();
            if (phoneNumbers.length > 0) {
                const url = 'http://127.0.0.1:3000/set_number';
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(phoneNumbers),
                };

                fetch(url, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        resolve();
                    })
                    .catch(error => {
                        console.error('Ошибка при выполнении POST-запроса:', error);
                        reject(error);
                    });
            }
        }
    })
}

module.exports = {
    parseSearch
};

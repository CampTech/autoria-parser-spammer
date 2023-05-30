const puppeteer = require('puppeteer');

// const numbers = [];

async function parseAutoRia(url = "/auto_volvo_xc90_34163215.html") {
    const browser = await puppeteer.launch({timeout: 0});
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
            await browser.close();
            return phoneNumber;
        }
    }
}

function getJson(data) {
    const autoria_url = 'https://auto.ria.com/uk'
    let phones = [];
    const promises = data.pages.map((e) => {
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

async function parseSearch(data, url = "https://auto.ria.com/uk/advanced-search/") {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage();
    await page.goto(url, {waitUntil: 'networkidle0', timeout: 0});

    const cookie = await page.$('label.js-close.c-notifier-btn');
    // await cookie.click();
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await page.screenshot({path: 'screenshot0.png', fullPage: true});

    if (data.select.length !== 0) {
        for (let select of data.select) {
            console.log(select);
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

            await page.screenshot({path: 'screenshot5.png', fullPage: true});

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

    await page.screenshot({path: 'screenshot1.png', fullPage: true});
    const submit = await page.$('button.button.small');
    await page.screenshot({path: 'screenshot10.png', fullPage: true});
    await page.waitForTimeout(5000);
    await submit.click();
    await page.evaluate((e) => e.click(), submit);
    await page.waitForTimeout(10000);
    await page.screenshot({path: 'screenshot2.png', fullPage: true});
    console.log('212');


    if (await page.$('.item.ticket-title a')) {
        const hrefs = await page.$$eval('.item.ticket-title a', links => links.map(link => link.href));
        await browser.close();
        let phones = [];
        const promises = hrefs.map((e, index) => {
            return new Promise(resolve => {
                setTimeout(async () => {
                    const result = await parseAutoRia(e);
                    resolve(result);
                }, index * 10000);
            });
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


    await page.waitForTimeout(2000);

}

module.exports = {
    getJson,
    parseSearch
};

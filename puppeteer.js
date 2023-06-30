const puppeteer = require('puppeteer');
const fs = require('fs');
const { getFileData, setFileData } = require('./functions.js');

async function isValidPhoneNumber(number) {
    const pattern = /^[\d()]+$/;
    return pattern.test(number);
}

async function parseAutoRia(urls, browser, filterId) {
    const page = await browser.newPage();
    const phones = [];

    let index = 0;

    mainLoop: for (let url of urls) {
        index++;
        // if (index < 2) {
            console.log(url);
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });
            const phoneElement = await page.$('.phone');
            if (phoneElement) {
                const client_name = await page.evaluate(element => element.textContent, await page.$('#userInfoBlock .seller_info_name'));
                const client_car = await page.evaluate(element => element.textContent, await page.$('.heading-cars h1.head'));
                await phoneElement.click();
                await page.waitForTimeout(4000);
                let phoneNumber = await page.$eval('.phone', element => element.textContent.trim());
                phoneNumber = phoneNumber.replace(/\s/g, "");
                if (phoneNumber !== undefined && phoneNumber !== null) {
                    if (await isValidPhoneNumber(phoneNumber)) {
                        console.log(phoneNumber);
                        phones.push(phoneNumber);

                        path = './assets/clients.json';
                        await getFileData(path, async (clients) => {
                            clients = JSON.parse(clients);
                            let foundMath = false;
                            for (const el of clients) {
                                for (const client of el.clients) {
                                    if (client.number === phoneNumber) {
                                        console.log('Номер совпал :)');
                                        foundMath = true;
                                    }
                                }
                            }
                            if (!foundMath) {
                                const maxId = clients.reduce((max, item) => {
                                    const clients = item.clients;
                                    const clientIds = clients.map(client => parseInt(client.id));
                                    const currentMax = Math.max(...clientIds);
                                    return Math.max(max, currentMax);
                                }, 0);

                                const client = {
                                    'id': maxId + 1,
                                    'number': phoneNumber,
                                    'name': client_name ? client_name : null,
                                    'car': client_car ? client_car : null,
                                    'interested': 'No',
                                    'messanger': 'None'
                                };

                                const element = clients.find(client => client.filter_id === filterId);

                                if (element) {
                                    element.clients.push(client);
                                } else {
                                    clients.push({
                                        'filter_id': filterId,
                                        'clients': [client],
                                        'status': 'sending'
                                    });
                                }
                                setFileData(path, clients);
                                console.log('Номер записан');
                            }
                        });
                    }
                }
            }
        // }
    }
    return phones;
}


function parseSearch(data = [], url = "https://auto.ria.com/uk/advanced-search/") {
    return new Promise(async (resolve, reject) => {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

        const cookie = await page.$('label.js-close.c-notifier-btn');
        // await page.evaluate(() => {
        //     window.scrollTo(0, document.body.scrollHeight);
        // });
        // await page.evaluate(() => {
        //     window.scrollTo(0, '20px');
        // });
        if (data.select.length !== 0) {
            for (let select of data.select) {
                const selectElement = await page.$(select.element);
                await page.waitForTimeout(1000);
                await selectElement.focus();
                await page.waitForTimeout(1000);
                await page.screenshot({ path: 'screenshot.png', fullPage: true });
                await page.waitForTimeout(1000);
                await page.keyboard.press('ArrowDown');
                await page.waitForTimeout(1000);
                await selectElement.select(select.value);
            }
        }

        if (data.search.length !== 0) {
            for (let el of data.search) {
                const label = await page.$(el.label);
                await page.waitForTimeout(1000);
                const input = await page.$(el.element);
                await page.waitForTimeout(1000);
                await label.click();
                await page.waitForTimeout(1000);
                await page.evaluate((e) => e.click(), label);
                await page.waitForTimeout(1000);
                await label.focus();
                await page.waitForTimeout(1000);
                await input.type(el.value, { delay: 100 });
                await page.waitForTimeout(1000);
                const liElement = await input.evaluateHandle((e) => {
                    return e.parentElement.querySelector('ul li')
                });
                await page.waitForTimeout(10000);
                await liElement.click();
            }
        }

        if (data.radio.length !== 0) {
            for (let radio of data.radio) {
                await page.waitForTimeout(1000);
                const radioElement = await page.$(radio.label);
                await page.waitForTimeout(5000);
                if (radioElement !== null) {
                    await radioElement.click();
                }
            }
        }
        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'screenshot.png' });

        const submit = await page.$('button.button.small');
        await page.waitForTimeout(10000);
        await submit.click();
        await page.evaluate((e) => e.click(), submit);
        await page.waitForTimeout(10000);


        if (await page.$('.item.ticket-title a')) {
            const hrefs = await page.$$eval('.item.ticket-title a', links => links.map(link => link.href));

            const phoneNumbers = await parseAutoRia(hrefs, browser, data.id);
            await browser.close();

            console.log('chrome close');
            resolve();
        }
    })
}

module.exports = {
    parseSearch
};

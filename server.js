const http = require('http');
const {getJson, parseSearch} = require('./puppeteer.js');
const requestQueue = [];
let isProcessing = false;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();



app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.post('/parse', async (req, res) => {
    let data = '';

    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', async () => {
        const jsonData = JSON.parse(data);
        await addToQueue(jsonData);

        async function addToQueue(data) {
            requestQueue.push(data);
            if (!isProcessing) {
                isProcessing = true;
                await processQueue();
            }
        }

        async function processQueue() {
            if (requestQueue.length > 0) {
                const requestData = requestQueue.shift();
                try {
                    await parseSearch(requestData).then(() => {
                        processQueue();
                    });
                } catch (error) {
                    console.error('Ошибка при выполнении запроса:', error);
                }
                res.statusCode = 200;
                res.end(JSON.stringify(true));
            } else {
                isProcessing = false;
            }
        }
    });
});

app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/clients', (req, res) => {
    res.render('clients');
});

app.get('/processing', (req, res) => {
    res.render('processing');
});

app.post('/set_number', (req, res) => {
    let data = '';

    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', async () => {
        await fs.readFile('./assets/numbers.json', 'utf8', (err, numbers) => {
            data = JSON.parse(data);
            let dataArray = JSON.parse(JSON.parse(numbers));
            data.forEach(e => {
                dataArray.push(e);
            });

            dataArray = JSON.stringify(dataArray);
            fs.writeFile('./assets/numbers.json', dataArray, 'utf8', (error) => {});
        });

        res.statusCode = 200;
        res.end(JSON.stringify(true));
    })

});

app.listen(3000, () => {
    console.log('Сервер запущен');
});
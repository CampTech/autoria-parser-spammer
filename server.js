const { parseSearch } = require('./puppeteer.js');
const { runWhatsappSpammer } = require('./emulator/appium.js');
const { getFileData, setFileData } = require('./functions');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

let isProcessing = false;
const processing_path = './assets/processing.json';
const processStatus = [
    'error',
    'parsing',
    'sending',
    'complete'
];

const message = 'test';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/clients', (req, res) => {
    res.render('clients');
});

app.get('/client/:id', (req, res) => {
    const id = res.params.id;
    res.render('client');
});

app.get('/processing', (req, res) => {
    res.render('processing');
});

app.get('/processing/get', (req, res) => {
    fs.readFile(processing_path, 'utf8', (err, processing_data) => {
        res.json(processing_data);
    });
});

app.post('/processing/add', (req, res) => {
    let data = '';

    req.on('data', (chunk) => {
        data += chunk;
    });

    req.on('end', () => {
        let jsonData = JSON.parse(data);
        getFileData(processing_path, (processing_data) => {
            if (processing_data) {
                processing_data = JSON.parse(processing_data);
                const id = processing_data[processing_data.length - 1].id;
                jsonData.id = id + 1;
                jsonData.status = 'parsing'
                processing_data.push(jsonData);
                setFileData(processing_path, processing_data);
            } else {
                arr = [];
                arr.push({
                    ...JSON.parse(data),
                    id: 1,
                    status: 'parsing'
                });
                setFileData(processing_path, arr);
            }

            if (!isProcessing) {
                isProcessing = true;
                processQueue();
            }
        });

        res.statusCode = 200;
        res.end(JSON.stringify(true));

        function processQueue() {
            getFileData(processing_path, async (json) => {
                if (json.indexOf('parsing') !== -1) {
                    const data = JSON.parse(json);

                    for (const el of data) {
                        if (el.status == 'parsing') {
                            try {
                                await parseSearch(el);
                                const index = data.indexOf(el);
                                data[index].status = 'sending';
                                setFileData(processing_path, data);
                            } catch (error) {
                                console.error('Ошибка при выполнении запроса:', error);
                            }
                        }
                    }
                    processQueue();
                    isProcessing = false;
                } else {
                    getFileData('./assets/clients.json', (json) => {
                        const data = JSON.parse(json);
                        const filteredData = data.filter(process => process.status === 'sending');
                        isProcessing = true;
                        runWhatsappSpammer(filteredData, message);
                    });
                }
            });
        }
    })

});

app.listen(3000, () => {
    console.log('Сервер запущений');
});
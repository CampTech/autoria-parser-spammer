const http = require('http');
const {getJson, parseSearch} = require('./puppeteer.js');
const requestQueue = [];
let isProcessing = false;

const server = http.createServer(async (req, res) => {
    if (req.method === 'POST' && req.url === '/') {
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
                        console.log('Запрос выполнен:', requestData);
                    } catch (error) {
                        console.error('Ошибка при выполнении запроса:', error);
                    }
                } else {
                    isProcessing = false;
                }
            }

            res.statusCode = 200;
            res.end('OK');
        });
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
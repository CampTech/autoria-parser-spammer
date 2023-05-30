const http = require('http');
const {getJson, parseSearch} = require('./puppeteer.js');

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/data') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const jsonData = JSON.parse(data);

            getJson(jsonData)

            res.statusCode = 200;
            res.end('OK');
        });
    } else {
        res.statusCode = 404;
        res.end('Not Found');
    }
    if (req.method === 'POST' && req.url === '/') {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        });

        req.on('end', () => {
            const jsonData = JSON.parse(data);

            parseSearch(jsonData);

            res.statusCode = 200;
            res.end('OK');
        });
    }
});

server.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
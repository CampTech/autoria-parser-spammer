const { parseSearch } = require('./puppeteer.js');
const { runWhatsappSpammer, checkInterestedStatus, auth, authNextStep, checkAuth, getRemote, executeADBCommand } = require('./emulator/appium.js');
const { getFileData, setFileData } = require('./functions');
const fs = require('fs');
const { exec, spawn } = require('child_process');
const path = require('path');
const express = require('express');
const app = express();

let isProcessing = false;
const processing_path = './assets/processing.json';

let message = '';


let driver;

(async () => {
    driver = await getRemote();

    getFileData('./assets/message.json', (data) => {
        message = data;
    });
})();

app.get('/login', (req, res) => {
    res.render('login');
})

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.render('dashboard');
});

app.get('/clients', async (req, res) => {
    res.render('clients');

    const interested = await checkInterestedStatus(driver);

    if (interested) {
        getFileData('./assets/clients.json', (json) => {
            const data = JSON.parse(json);

            for (const interes of interested) {
                data.forEach(el => {
                    const number = el.clients.find(filter => filter.number === interes.number);
                    if (number) {
                        number.interested = 'Yes';
                        number.message_from = interes.message;
                    }
                });
            }
            setFileData('./assets/clients.json', data);
        });
    }
});

app.get('/client/:id', async (req, res) => {
    const id = parseInt(req.params.id);

    getFileData('./assets/clients.json', async (json) => {
        const data = JSON.parse(json);
        const client = data.map(el => el.clients.find(filter => filter.id == id));
        res.render('client', client[0]);
    });
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
                } else {
                    getFileData('./assets/clients.json', async (json) => {
                        const data = JSON.parse(json);
                        const filteredData = data.filter(process => process.status === 'sending');
                        isProcessing = true;
                        await runWhatsappSpammer(driver, filteredData, message);
                        isProcessing = false;
                    });
                }
            });
        }
    })

});

app.get('/config', async (req, res) => {
    res.render('config');

    // if (!isProcessing) {
    //     isProcessing = true;
    //     const check = await checkAuth(driver);
    //     isProcessing = false;

    //     const data = {
    //         'auth': check
    //     }

    //     setFileData('./assets/config.json', data);
    // }

});

app.get('/config/auth/qr', async (req, res) => {
    const authQrCode = await auth(driver);

    if (await authQrCode) {
        res.statusCode = 200;
        res.end(JSON.stringify(true));
        setFileData('./assets/config.json', { 'auth': true });
    } else {
        res.statusCode = 500;
        res.end(JSON.stringify(false));
        setFileData('./assets/config.json', { 'auth': false });
    }

});

// app.get('/config/check', async (req, res) => {
//     const check = await checkAuth(driver);

//     res.statusCode = 200;
//     res.end(JSON.stringify(check));
// })

app.post('/config/auth', (req, res) => {
    let json = '';

    req.on('data', (chunk) => {
        json += chunk;
    });

    req.on('end', () => {
        const data = JSON.parse(json);




        // console.log(data);
        // if (data.message === null) {
        //     if (data.code === null) {
        //         auth(driver, data.number);
        //     } else {
        //         authNextStep(driver, data.bot_name, data.code);
        //     }
        // } else {
        //     message = data.message;
        //     setFileData('./assets/message.json', data.message);
        // }

        setFileData('./assets/config.json', { 'auth': true });
        res.statusCode = 200;
        res.end(JSON.stringify(true));
    });
});

app.get('/config/logout', async (req, res) => {
    await spawn('docker', ['exec', '--privileged', 'androidContainer', 'adb', 'shell', 'pm', 'clear', 'com.whatsapp']);
    const data = {
        'auth': false
    }
    setFileData('./assets/config.json', data);

});

app.post('/config/message', (req, res) => {
    let json = '';
    req.on('data', (chunk) => {
        json += chunk;
    });

    req.on('end', () => {
        const data = JSON.parse(json);
        message = data.message;
        setFileData('./assets/message.json', data.message);
        res.statusCode = 200;
        res.end(JSON.stringify(true));
    })
})

app.get('/screenshot', (req, res) => {
    executeADBCommand(`exec-out screencap -p > ./assets/screenshotStep.png`);
    new Promise((resolve) => setTimeout(resolve, 5000));
    res.render('screenshot');
});


app.listen(3000, () => {
    console.log('Сервер запущений');
    // runEmulator();
});



function runEmulator() {
    const docker = 'docker';
    const emulatorArgs = ['exec', '--privileged', 'androidContainer', 'emulator', '@nexus', '-no-window', '-no-snapshot', '-noaudio', '-no-boot-anim', '-memory', '648', '-accel', 'on', '-gpu', 'swiftshader_indirect', '-camera-back', 'none', '-cores', '4'];
    const emulatorProcess = spawn(docker, emulatorArgs, { stdio: 'inherit' });
    new Promise((resolve) => setTimeout(resolve, 5000));
    // const appiumProcess = spawn(docker, ['exec', '--privileged', 'androidContainer', 'bash', '-c', 'appium -p 5900'])
    new Promise((resolve) => setTimeout(resolve, 5000));

    emulatorProcess.on('exit', async (code) => {
        if (code !== 0) {
            await spawn(docker, ['restart', 'androidContainer']);
            console.log('restart');
            console.log('Command exited with non-zero status, restarting...');
            await runEmulator();
        }
    });
}
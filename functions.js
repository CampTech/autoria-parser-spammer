const fs = require('fs');

function getFileData(path, callback) {
    if (fs.existsSync(path)) {
        fs.readFile(path, 'utf-8', (err, data) => {
            callback(data, err);
        });
    }
}

function setFileData(path, data) {
    fs.writeFileSync(path, JSON.stringify(data), 'utf8', (error) => { });
}

module.exports = {
    getFileData,
    setFileData
}
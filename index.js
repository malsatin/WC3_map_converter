"use strict";

const fs = require('fs');
const path = require('path');
const argv = process.argv;

if(argv.length > 3) {
    throw new Error("Maximum 1 arguments supported");
}

const Constants = require('./src/constants');
const Reader = require('./src/reader');
const Writer = require('./src/writer');
const WcMap = require('./src/class/WcMap');
const RawMap = require('./src/class/RawMap');

async function mainLoop() {
    let input = Reader.readRaw(Constants.INPUT_FILE);
    let rawMap = new RawMap(Constants.MAP_NAME);
    rawMap.parseObjects(input);

    let wcMap = new WcMap(Constants.MAP_NAME);
    wcMap.parse(rawMap);

    let resultPath = Writer.saveMap(wcMap);
    console.log('-----------------');

    if(argv.length > 2) {
        let filename = path.basename(resultPath);
        let newPath = path.resolve(argv[2], filename);

        fs.renameSync(resultPath, newPath);

        return `Map saved to ${newPath}`;
    }

    return `Map saved to ${resultPath}`;
}

mainLoop()
    .then(r => console.log(r))
    .catch(e => console.log(e));

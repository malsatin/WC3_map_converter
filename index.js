"use strict";

const Constants = require('./src/constants');
const LandGenerator = require('./src/land_generator');
const Reader = require('./src/reader');
const Writer = require('./src/writer');
const WcMap = require('./src/class/WcMap');
const RawMap = require('./src/class/RawMap');

//const sjs = require('@wowserhq/stormjs');
//const StormLib = require('./src/stormlib/stormlib');

async function mainLoop() {
    let input = Reader.readRaw(Constants.INPUT_FILE);
    let rawMap = new RawMap(Constants.MAP_NAME);
    rawMap.parseObjects(input);

    let wcMap = new WcMap(Constants.MAP_NAME);
    wcMap.parse(rawMap);

    Writer.saveMap(wcMap);
}

mainLoop()
    .then(r => console.log(r))
    .catch(e => console.log(e));

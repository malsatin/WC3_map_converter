"use strict";

const Translator = require('wc3maptranslator');

const Constants = require('./constants');
const WcMap = require('./class/WcMap');
const MPQ = require('./class/MPQ');
const MapDump = require('./class/MapDump');
const WarFile = require('./write_helper').WarFile;

module.exports = {
    saveMap,
    saveDump,
    dumpMap,
};

/**
 * @param {WcMap} mapObj
 */
function saveMap(mapObj) {
    let dump = dumpMap(mapObj);

    saveDump(dump, mapObj.name);
}

/**
 * @param {MapDump} dump
 * @param {String} mapName
 */
function saveDump(dump, mapName) {
    let mpq = MPQ.create(_outputPath(`${mapName}.${Constants.WC_EXT}`));

    dump.dumpFiles();
    mpq.addDirectory(_outputPath(mapName));
    dump.clear();
}

/**
 * @param {WcMap} map
 * @return {MapDump}
 */
function dumpMap(map) {
    let dump = new MapDump(_outputPath(map.name));

    let configs = {};
    configs[WarFile.Entity.Doodad] = map.doodads;
    configs[WarFile.Entity.Terrain] = map.terrain;
    configs[WarFile.Entity.Unit] = map.units;

    let parsers = {};
    parsers[WarFile.Entity.Doodad] = Translator.Doodads.jsonToWar;
    parsers[WarFile.Entity.Terrain] = Translator.Terrain.jsonToWar;
    parsers[WarFile.Entity.Unit] = Translator.Units.jsonToWar;

    for(let name in configs) {
        if(configs[name]) {
            console.log(configs[name]);
            dump.addFile(name, _getBuffer(parsers[name](configs[name])));
        }
    }

    return dump;
}

function _getBuffer(translatorProto) {

}

/**
 * @param {String} path
 * @return {String}
 * @private
 */
function _outputPath(path) {
    return './data/output/' + path;
}

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
 * @returns {String} - filename
 */
function saveMap(mapObj) {
    let dump = dumpMap(mapObj);

    return saveDump(dump, mapObj.name);
}

/**
 * @param {MapDump} dump
 * @param {String} mapName
 * @returns {String} - filename
 */
function saveDump(dump, mapName) {
    dump.init();
    dump.copySample(_samplePath());
    dump.dumpFiles();

    let mpq = MPQ.create(_outputPath(`${mapName}.${Constants.WC_EXT}`));
    mpq.addDirectory(_outputPath(mapName));
    mpq.flush();

    dump.clear();

    return mpq._path;
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
    configs[WarFile.Other.Info] = map.info;
    configs[WarFile.Other.String] = map.strings;

    let parsers = {};
    parsers[WarFile.Entity.Doodad] = Translator.Doodads.jsonToWar;
    parsers[WarFile.Entity.Terrain] = Translator.Terrain.jsonToWar;
    parsers[WarFile.Entity.Unit] = Translator.Units.jsonToWar;
    parsers[WarFile.Other.Info] = Translator.Info.jsonToWar;
    parsers[WarFile.Other.String] = Translator.Strings.jsonToWar;

    for(let name in configs) {
        var obj = configs[name];

        if(obj && !_isEmptyArray(obj) && !_isEmptyObject(obj)) {
            console.log(`${name} added to dump`);

            dump.addFile(name, _getBuffer(parsers[name](configs[name])));
        }
    }

    console.log('-----------------');

    return dump;
}

function _getBuffer(translatorProto) {
    let resp = translatorProto;

    if(resp.errors && resp.errors.length) {
        throw new Error('Translation error: ' + resp.errors.join('; '));
    }

    return resp.buffer;
}

function _isEmptyArray(o) {
    return Array.isArray(o) && o.length === 0;
}

function _isEmptyObject(o) {
    return Object.keys(o).length === 0;
}

/**
 * @param {String} path
 * @return {String}
 * @private
 */
function _outputPath(path) {
    return './data/output/' + path;
}

function _samplePath() {
    return './data/sample';
}

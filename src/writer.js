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
    dump.copyPlaceholders(_placeholderPath());
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
    configs[WarFile.Other.Jass] = map.jass;

    let generators = {};
    generators[WarFile.Entity.Doodad] = Translator.Doodads.jsonToWar;
    generators[WarFile.Entity.Terrain] = Translator.Terrain.jsonToWar;
    generators[WarFile.Entity.Unit] = Translator.Units.jsonToWar;
    generators[WarFile.Other.Info] = Translator.Info.jsonToWar;
    generators[WarFile.Other.String] = Translator.Strings.jsonToWar;
    generators[WarFile.Other.Jass] = _generateJass;

    for(let name in configs) {
        let obj = configs[name];

        if(obj && !_isEmptyArray(obj) && !_isEmptyObject(obj)) {
            let generator = generators[name];

            dump.addFile(name, _getBuffer(generator(obj)));

            console.log(`${name} added to dump`);
        }
    }

    console.log('-----------------');

    return dump;
}

function _generateJass(jObj) {
    return jObj.render();
}

function _getBuffer(translatorProto) {
    let resp = translatorProto;

    if(resp.errors && resp.errors.length) {
        throw new Error('Translation error: ' + resp.errors.join('; '));
    }

    if(resp.buffer) {
        return resp.buffer;
    }

    return resp;
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

function _placeholderPath() {
    return './data/placeholder';
}

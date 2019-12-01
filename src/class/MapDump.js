"use strict";

const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const WriteHelper = require('../write_helper');

module.exports = MapDump;

/**
 * Handles output from wc3maptranslator
 * @param {String} path_
 * @constructor
 */
function MapDump(path_) {
    this._path = path.resolve(path_);
    this._files = {};
}

/**
 */
MapDump.prototype.init = function() {
    this.clear();
    fs.mkdirSync(this._path);
};

MapDump.prototype.copyPlaceholders = function(path_) {
    for(let f of fs.readdirSync(path_)) {
        if(!fs.existsSync(path.resolve(this._path, f))) {
            console.log(`Copied ${f} into tmp folder`);
        }
    }

    fse.copySync(path_, this._path, {
        overwrite: false,
    });
};

/**
 */
MapDump.prototype.clear = function() {
    if(fs.existsSync(this._path)) {
        fse.removeSync(this._path);
    }
};

/**
 * @param {String} path_
 */
MapDump.prototype.setPath = function(path_) {
    this._path = path_;
};

/**
 * @param {String} name
 * @param {Buffer} buffer
 */
MapDump.prototype.addFile = function(name, buffer) {
    this._files[name] = buffer;
};

/**
 */
MapDump.prototype.dumpFiles = function() {
    for(let name in this._files) {
        this.dumpFile(name);
    }
};

/**
 * @param {String} name
 */
MapDump.prototype.dumpFile = function(name) {
    if(!(name in this._files)) {
        throw new Error(`Unknown filename ${name}`);
    }

    console.log(`Added ${name} into tmp folder`);

    WriteHelper.Write(path.join(this._path, name), this._files[name]);
};

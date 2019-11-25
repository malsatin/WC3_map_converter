"use strict";

const path = require('path');
const fs = require('fs');
const StormLib = require('../stormlib/stormlib');

module.exports = MPQ_stormlib;

/**
 * Handles interaction with StormLib
 * @param {String} path_
 * @param {Number} max_file_count
 * @constructor
 */
function MPQ_stormlib(path_, max_file_count = 100) {
    this._path = path_;
    this._handle = new StormLib.VoidPtr();

    if(!StormLib.SFileCreateArchive(path_, 0, max_file_count, this._handle)) {
        const errno = StormLib.GetLastError();
        throw new Error(`StormLib error ${errno}`);
    }
}

/**
 * @param {String} path_
 * @param {String} name
 */
MPQ_stormlib.prototype.addFile = function(path_, name = null) {
    if(!name) {
        name = path_;
    }

    if(!StormLib.SFileAddFileEx(this._handle, path_, name, 0, 0, 0)) {
        const errno = StormLib.GetLastError();
        throw new Error(`StormLib error ${errno}`);
    }
};

/**
 * @param {String} path_
 * @param {String} name
 */
MPQ_stormlib.prototype.addDirectory = function(path_, name = null) {
    let files = fs.readdirSync(path_);

    for(let file of files) {
        this.addFile(path.join(path_, file), path.join(name, file));
    }
};

MPQ_stormlib.prototype.flush = function() {
    if(!StormLib.SFileFlushArchive(this._handle)) {
        const errno = StormLib.GetLastError();
        throw new Error(`StormLib error ${errno}`);
    }
};

MPQ_stormlib.prototype.close = function() {
    if(!StormLib.SFileCloseArchive(this._handle)) {
        const errno = StormLib.GetLastError();
        throw new Error(`StormLib error ${errno}`);
    }

    this._handle.delete();
};

"use strict";

const path = require('path');
const fs = require('fs');
const exec = require('child_process');

module.exports = MPQ;

/**
 * @param {String} absolutePath
 * @constructor
 */
function MPQ(absolutePath) {
    this._path = absolutePath;
}

MPQ.prototype.addFile = function(path_, name = null) {
    let abs = path.resolve(path_);

    MPQ.execute('a', [this._path, abs, name]);
};

MPQ.prototype.addDirectory = function(path_) {
    let files = fs.readdirSync(path_);

    for(let file of files) {
        this.addFile(path.join(path_, file), file);
    }
};

MPQ.create = function(path_) {
    let abs = path.resolve(path_);

    MPQ.execute('n', abs);

    return new MPQ(abs);
};

MPQ.execute = function(cmd, args) {
    if(!Array.isArray(args)) {
        args = [args];
    }

    let line = [cmd, args.join(' ')].join(' ');
    let consoleCmd = _mpqPath('mpqe.exe') + ' /console script';

    fs.writeFileSync(_mpqPath('script'), line, {flag: 'w+'});
    exec.execSync(consoleCmd);
    fs.unlinkSync(_mpqPath('script'));
};

function _mpqPath(path_) {
    return path.resolve('./mpq/' + path_);
}

"use strict";

const path = require('path');
const fs = require('fs');
const exec = require('child_process');

module.exports = MPQ;

/**
 * @param {String} absolutePath
 * @param {Array<String>} commands
 * @constructor
 */
function MPQ(absolutePath, commands = []) {
    this._path = absolutePath;
    this._cmd = commands;
}

MPQ.prototype.addFile = function(path_, name = null) {
    let abs = path.resolve(path_);

    this.addCommand('a', [this._path, abs, name]);
};

MPQ.prototype.addDirectory = function(path_) {
    let files = fs.readdirSync(path_);

    for(let file of files) {
        this.addFile(path.join(path_, file), file);
    }
};

MPQ.prototype.addCommand = function(cmd, args) {
    this._cmd.push(MPQ.buildCommand(cmd, args));
};

MPQ.prototype.flush = function() {
    let cmdList = this._cmd.join('\n');
    this._cmd = [];

    MPQ.execute(cmdList);
};

MPQ.create = function(path_) {
    let abs = path.resolve(path_);

    if(fs.existsSync(abs)) {
        fs.unlinkSync(abs);
    }

    return new MPQ(abs, [MPQ.buildCommand('n', abs)]);
};

MPQ.buildCommand = function(cmd, args) {
    if(!Array.isArray(args)) {
        args = [args];
    }

    return [cmd, args.join(' ')].join(' ');
};

MPQ.execute = function(commands) {
    const scriptPath = _mpqPath('script');
    const mpqePath = _mpqPath('mpqe.exe');

    let consoleCmd = mpqePath + ' /console ' + scriptPath;

    fs.writeFileSync(scriptPath, commands, {flag: 'w+'});
    exec.execSync(consoleCmd);
    fs.unlinkSync(scriptPath);
};

function _mpqPath(path_) {
    return path.resolve('./mpq/' + path_);
}

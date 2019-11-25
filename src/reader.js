"use strict";

const fs = require('fs');

module.exports = {
    readRaw,
};

/**
 * @param {String} name
 * @returns {String}
 */
function readRaw(name) {
    return fs.readFileSync(_inputPath(name), {encoding: 'utf8'});
}

/**
 * @param {String} path
 * @return {String}
 * @private
 */
function _inputPath(path) {
    return './data/input/' + path;
}

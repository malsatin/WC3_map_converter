"use strict";

const Constants = require('../constants');

module.exports = RawMap;

/**
 * Raw presentation of the map in our own format
 * @constructor
 */
function RawMap() {
    this.width = 0;
    this.height = 0;

    this.tiles = [];
    this.heights = [];
    this.objects = [];
}

/**
 * @param {String} input
 */
RawMap.prototype.parseObjects = function(input) {
    input = input.trim();

    //console.log(input);
    let lines = input.split('\n').map(l => l.trim());

    this.height = lines.length;
    this.width = lines[0].length;

    for(let line of lines) {
        for(let char of line) {
            this.objects.push(char);
        }
    }
};

RawMap.prototype.getCords = function(idx) {
    let x = idx % this.width;
    let y = Math.floor(idx / this.width);

    return {x, y};
};

"use strict";

module.exports = RawMap;

/**
 * Raw presentation of the map in our own format
 * @constructor
 */
function RawMap() {
    this.name = null;

    this.width = 0;
    this.heigh = 0;

    this.tiles = [];
    this.heights = [];
    this.objects = [];
}

/**
 * @param {String} input
 */
RawMap.prototype.parseObjects = function(input) {
    // todo
    // get width/height
    // process all units
};

// todo:

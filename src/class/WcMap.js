"use strict";

module.exports = WcMap;

/**
 * Map representation used directly in wc3maptranslator
 * @param {String} name
 * @constructor
 */
function WcMap(name) {
    this.name = name;

    this.units = null;
    this.doodads = null;
    this.terrain = null;

    this.doodads = [
        {
            id: 0,
            type: 'ATtr',                           // type of tree - see lookup
            variation: 0,                           // (optional) variation number
            position: [100, 100, 100],              // x,y,z coords
            angle: 0,                               // (optional) in radians
            scale: [1, 1, 1],                       // x,y,z scaling factor - 1 is normal size
            life: 100,                              // % health
            flags: {
                visible: true,
                solid: false
            }
        }
    ];
}

/**
 * @param {RawMap} map
 */
WcMap.prototype.parse = function(map) {
    this._raw = map;

    // todo: raw to internal objects
};

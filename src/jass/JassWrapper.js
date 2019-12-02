"use strict";

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

module.exports = JassWrapper;

/**
 * @constructor
 */
function JassWrapper() {
    this._data = {
        map: null,
        camera: null,
        players: [],
        nBuildings: [],
        nUnits: [],
    };
    this._mainTemplate = null;

    this._loadTemplates();
}

JassWrapper.prototype.setInfo = function(info) {
    this.setMapInfo(info.map);
    this.setCameraInfo(info.camera);
};

JassWrapper.prototype.setMapInfo = function(map) {
    this._data.map = map;
};

JassWrapper.prototype.setCameraInfo = function(cam) {
    this._data.camera = cam.bounds.map(this._prepareFloat);
};

JassWrapper.prototype.addPlayer = function(player) {
    this._data.players.push({
        id: player.playerNum,
        pos: {
            x: this._prepareFloat(player.startingPos.x),
            y: this._prepareFloat(player.startingPos.y),
        },
        control: this._mapControl(player.type),
        race: this._racePref(player.race),
    });
};

JassWrapper.prototype.addNeutralBuilding = function(unit) {
    this._data.nBuildings.push({
        type: unit.type,
        pos: this._preparePos3(unit.position),
        gold: unit.gold,
    });
};

JassWrapper.prototype.addNeutralHostile = function(unit) {
    this._data.nUnits.push({
        type: unit.type,
        pos: this._preparePos3(unit.position),
    });
};

JassWrapper.prototype.render = function() {
    return this._mainTemplate(this._data);
};

JassWrapper.prototype._loadTemplates = function() {
    const baseTemplate = 'base';
    const partialTemplates = [
        'building',
        'unit',
        'player_slot',
        'player_config',
    ];

    for(let name of partialTemplates) {
        Handlebars.registerPartial(name, this._readTemplate(name));
    }

    this._mainTemplate = Handlebars.compile(this._readTemplate(baseTemplate));
};

JassWrapper.prototype._readTemplate = function(name) {
    let folder = './templates';
    let fullName = name + '.hb';

    let path_ = path.resolve(__dirname, folder, fullName);

    return fs.readFileSync(path_, {encoding: "utf8"});
};

JassWrapper.prototype._preparePos3 = function(pos) {
    return {
        x: this._prepareFloat(pos[0]),
        y: this._prepareFloat(pos[1]),
        z: this._prepareFloat(pos[2]),
    };
};

JassWrapper.prototype._prepareFloat = function(num) {
    return String(num.toFixed(1)).replace('-', '- ');
};

JassWrapper.prototype._racePref = function(num) {
    const types = {
        1: 'RACE_PREF_HUMAN',
        2: 'RACE_PREF_ORC',
        3: 'RACE_PREF_NIGHTELF',
        4: 'RACE_PREF_UNDEAD',
    };

    return types[num];
};

JassWrapper.prototype._mapControl = function(num) {
    const types = {
        1: 'MAP_CONTROL_USER',
        2: 'MAP_CONTROL_COMPUTER',
    };

    return types[num];
};

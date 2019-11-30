"use strict";

const merge = require('merge');

const Constants = require('../constants');
const UnitType = require('./wc/UnitType');

const DefaultInfo = {
    "saves": 1,
    "editorVersion": 6059,
    "map": {
        "name": "map name",
        "author": "_",
        "description": "WarCraft III Map",
        "recommendedPlayers": "Any",
        "playableArea": {
            "width": 32,
            "height": 32,
        },
        "flags": {
            "hideMinimapInPreview": false,
            "modifyAllyPriorities": false,
            "isMeleeMap": false,
            "maskedPartiallyVisible": true,
            "fixedPlayerSetting": false,
            "useCustomForces": false,
            "useCustomTechtree": false,
            "useCustomAbilities": false,
            "useCustomUpgrades": false,
            "waterWavesOnCliffShores": true,
            "waterWavesOnRollingShores": true
        },
        "mainTileType": 'L'
    },
    "loadingScreen": {
        "background": -1,
        "path": "",
        "text": "",
        "title": "",
        "subtitle": ""
    },
    "prologue": {
        "path": "",
        "text": "",
        "title": "",
        "subtitle": ""
    },
    "fog": {
        "type": 0,
        "startHeight": 3000,
        "endHeight": 5000,
        "density": 0.4,
        "color": [0, 0, 0, 255]
    },
    "globalWeather": '0000',
    "customSoundEnvironment": '',
    "customLightEnv": '0',
    "water": [255, 255, 255, 255],
    "camera": {
        "bounds": [-768, -1280, 768, 768, -768, 768, 768, -1280],
        "complements": [6, 6, 4, 8]
    },
    "players": [],
    "forces": [],
};

module.exports = WcMap;

/**
 * Map representation used directly in wc3maptranslator
 * @param {String} name
 * @constructor
 */
function WcMap(name) {
    this.name = name;

    this.mapSize = 0;
    this.wcMapSize = 0;

    this.units = [];
    this.doodads = [];
    this.terrain = [];
    this.info = {};
    this.strings = {};
}

/**
 * @param {RawMap} map
 */
WcMap.prototype.parse = function(map) {
    this._raw = map;

    this.setupInfo();
    this.setupTerrain();
    this.addTmp();

    for(let i in map.objects) {
        let v = map.objects[i];
        let {x, y} = this._preparePosition(map.getCords(i));

        switch(v) {
            case 'B':
                this.addBase(x, y);
                break;
            case 'G':
                this.addGold(x, y);
                break;
            case 'F':
            case 'T':
                this.addTree(x, y);
                break;
            case 'W':
                this.addWater(x, y);
                break;
            case 'H':
                this.addHeroesShop(x, y);
                break;
            case 'I':
                this.addItemsShop(x, y);
                break;
            case 'N':
                this.addNeutrals(x, y);
                break;
        }
    }
};

WcMap.prototype.setupInfo = function() {
    if(this._raw.width !== this._raw.height) {
        throw new Error("Only square maps supported");
    }

    this.mapSize = this._raw.width;
    this.wcMapSize = this.mapSize / 2;

    let maxPos = this._getMaxPos();

    this.info = merge.recursive(DefaultInfo, {
        "map": {
            "name": this.name,
            "author": "Malsa",
            "description": "Procedurally generated WarСraft III map",
            "playableArea": {
                "width": this.wcMapSize,
                "height": this.wcMapSize,
            },
        },
        "camera": {
            "bounds": [
                -maxPos, -maxPos,
                +maxPos, +maxPos,
                -maxPos, +maxPos,
                +maxPos, -maxPos
            ],
            "complements": [6, 6, 4, 8]
        },
    });
};

WcMap.prototype.setupTerrain = function() {
    this.terrain = {
        "tileset": "L",
        "customtileset": false,
        "tilepalette": [
            "Ldrt",
            "Ldro",
            "Ldrg",
            "Lrok",
            "Lgrs",
            "Lgrd"
        ],
        "clifftilepalette": [
            "CLdi",
            "CLgr"
        ],
        "map": {
            "width": this.wcMapSize,
            "height": this.wcMapSize,
            "offset": {
                "x": -this._getMaxPos(),
                "y": -this._getMaxPos(),
            }
        },
        "tiles": [],
    };

    let tiles = [];
    for(let i = 0; i < this.wcMapSize + 1; i++) {
        let line = [];

        for(let j = 0; j < this.wcMapSize + 1; j++) {
            line.push(this._createGroundTile());
        }

        tiles.push(line);
    }

    this.terrain.tiles = tiles;
};

WcMap.prototype.addTmp = function() {
    this.doodads.push({
        id: 90,
        type: UnitType.AshenvalTree,                           // type of tree - see lookup
        variation: 0,                           // (optional) variation number
        position: [0, 0, 0],              // x,y,z coords
        angle: 0,                               // (optional) in radians
        scale: [1, 1, 1],                       // x,y,z scaling factor - 1 is normal size
        life: 100,                              // % health
        flags: {
            visible: true,
            solid: true
        }
    });

    this.units.push({
        id: 91,
        type: UnitType.Footman, // Unit type - lookup
        position: [300, 300, 0], // x,y,z coords
        rotation: 36, // in degrees
        scale: [1, 1, 1],
        player: 0, // belongs to player red
        hitpoints: 210,
        mana: 0,
        gold: 0,
        targetAcquisition: 0,
        hero: {
            "level": 1,
            "str": 1,
            "agi": 1,
            "int": 1
        },
        inventory: [],
        abilities: []
    });
};

WcMap.prototype.addBase = function(x, y) {
    let pk = this._getPlayerPk();

    this.info.players.push({
        "type": pk === 0 ? 1 : 2,
        "race": _randInt(1, 4),
        "playerNum": pk,
        "name": "Player " + pk,
        "startingPos": {
            "x": x,
            "y": y,
        }
    });

    let unit = this._createUnit(this._getUnitPk(), UnitType.PlayerBase, x, y);
    unit.player = pk;

    this.units.push(unit);
};

WcMap.prototype.addGold = function(x, y) {
    // todo
};

WcMap.prototype.addTree = function(x, y) {
    // todo
};

WcMap.prototype.addWater = function(x, y) {
    this._setTile(x, y, this._createWaterTile());
};

WcMap.prototype.addHeroesShop = function(x, y) {
    // todo
};

WcMap.prototype.addItemsShop = function(x, y) {
    // todo
};

WcMap.prototype.addNeutrals = function(x, y) {
    // todo
};

WcMap.prototype._setTile = function(x, y, tile) {
    // todo
    // this.terrain.tiles[y * this.size.width + x] = tile;
};

WcMap.prototype._createUnit = function(id, type, x, y) {
    return {
        "hero": {"level": 0, "str": 0, "agi": 0, "int": 0},
        "inventory": [],
        "abilities": [],
        "type": type,
        "variation": 0,
        "position": [x, y, 0],
        "rotation": 0,
        "scale": [1, 1, 1],
        "player": 0,
        "hitpoints": 0,
        "mana": 0,
        "gold": 0,
        "targetAcquisition": 0,
        "color": -1,
        "id": id
    }
};

WcMap.prototype._createWaterTile = function() {
    return {
        "groundHeight": 8192,
        "waterHeight": 8192,
        "boundaryFlag": false,
        "flags": 64,
        "groundTexture": 0,
        "groundVariation": 8,
        "cliffVariation": 4,
        "cliffTexture": 16,
        "layerHeight": 1
    }
};

WcMap.prototype._createGroundTile = function() {
    return {
        "groundHeight": 8192,
        "waterHeight": 8192,
        "boundaryFlag": false,
        "flags": 0,
        "groundTexture": 0,
        "groundVariation": 16,
        "cliffVariation": 0,
        "cliffTexture": 240,
        "layerHeight": 2
    }
};

WcMap.prototype._getUnitPk = function() {
    return this.units.length;
};

WcMap.prototype._getPlayerPk = function() {
    return this.info.players.length;
};

WcMap.prototype._getMaxPos = function() {
    return this.wcMapSize * Constants.TILE_SIZE;
};

WcMap.prototype._preparePosition = function(o) {
    let offset = this.wcMapSize;

    let x = (o.x - offset) * Constants.TILE_SIZE;
    let y = (o.y - offset) * Constants.TILE_SIZE;

    return {x, y};
};

function _randInt(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

"use strict";

const merge = require('merge');
const Constants = require('../constants');

const DefaultInfo = {
    "saves": 0,
    "editorVersion": 0,
    "map": {
        "name": "map name goes here",
        "author": "chiefofgxbxl",
        "description": "Just Another WarCraft III Map",
        "recommendedPlayers": "Any",
        "playableArea": {
            "width": 52,
            "height": 52
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
        "mainTileType": "L"
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
        "type": 1,
        "startHeight": 3000,
        "endHeight": 5000,
        "density": 0,
        "color": [0, 0, 0]
    },
    "globalWeather": "NONE",
    "customSoundEnvironment": "",
    "customLightEnv": "",
    "water": [0, 0, 0],
    "camera": {
        "bounds": [-3200, -3200, 3200, 3200, -3200, 3200, 3200, -3200],
        "complements": [6, 6, 4, 8]
    },
    "players": [
        {
            "type": 1,
            "race": 1,
            "playerNum": 0,
            "name": "Frodo Baggins",
            "startingPos": {"x": 2368, "y": 256},
            "priorities": {
                "low": 0,
                "high": 0
            }
        },
        {
            "type": 2,
            "race": 3,
            "playerNum": 10,
            "name": "Smeagul",
            "startingPos": {"x": 2368, "y": 256}
        }
    ],
    "forces": [
        {
            "name": "Force 1",
            "players": [0],
            "flags": {
                "allied": false,
                "alliedVictory": false,
                "shareVision": false,
                "shareUnitControl": false,
                "shareAdvUnitControl": false
            }
        }
    ]
};

module.exports = WcMap;

/**
 * Map representation used directly in wc3maptranslator
 * @param {String} name
 * @constructor
 */
function WcMap(name) {
    this.name = name;

    this.size = {
        width: 0,
        height: 0,
    };

    this.units = [];
    this.doodads = [];
    this.terrain = [];
    this.info = {};
    this.strings = {};

    this.doodads = [
        {
            id: 0,
            type: 'ATtr',                           // type of tree - see lookup
            variation: 0,                           // (optional) variation number
            position: [-2000, -2000, 100],              // x,y,z coords
            angle: 0,                               // (optional) in radians
            scale: [1, 1, 1],                       // x,y,z scaling factor - 1 is normal size
            life: 100,                              // % health
            flags: {
                visible: true,
                solid: true
            }
        }
    ];

    this.units = [
        {
            id: 1,
            type: 'hfoo', // Unit type - lookup
            position: [1000, 1000, 100], // x,y,z coords
            rotation: 36, // in degrees
            scale: [1, 1, 1],
            player: 0, // belongs to player red
            hitpoints: 210,
            mana: 0,
            gold: 0,
            targetAcquisition: 0,
            "hero": {
                "level": 1,
                "str": 1,
                "agi": 1,
                "int": 1
            },
            inventory: [],
            abilities: []
        }
    ];

    //this.terrain = require('../../data/input/terrain.json');
}

/**
 * @param {RawMap} map
 */
WcMap.prototype.parse = function(map) {
    this._raw = map;

    this.setupInfo();
    this.setupTerrain();

    for(let i in map.objects) {
        let v = map.objects[i];
        let {x, y} = _preparePosition(map.getCords(i), this.size);

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
                //this.addWater(x, y);
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
    this.size = {
        width: this._raw.width,
        height: this._raw.height
    };

    this.info = merge.recursive(DefaultInfo, {
        "map": {
            "name": this.name,
            "author": "malsa",
            "description": "Procedurally generated Warcraft III map",
            "playableArea": this.size,
        },
    });
    this.info["players"] = [];
    this.info["forces"] = [];
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
            "width": this.size.width,
            "height": this.size.height,
            "offset": {
                "x": this.size.width * Constants.TILE_SIZE,
                "y": this.size.height * Constants.TILE_SIZE,
            }
        },
        "tiles": [],
    };

    // let tiles = [];
    // for(let i = 0; i < this.size.width * this.size.height; i++) {
    //     tiles.push(this._createGroundTile());
    // }
    //
    // this.terrain.tiles = tiles;
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

    let unit = this._createUnit(this._getUnitPk(), "sloc", x, y);
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
    this.terrain.tiles[y * this.size.width + x] = this._createWaterTile();
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
    let pixels = [];

    for(let i = 0; i < Constants.TILE_SIZE; i++) {
        pixels.push({
            "groundHeight": 8192,
            "waterHeight": 8192,
            "boundaryFlag": false,
            "flags": 64,
            "groundTexture": 0,
            "groundVariation": 80,
            "cliffVariation": 0,
            "cliffTexture": 16,
            "layerHeight": 1
        });
    }

    return pixels;
};

WcMap.prototype._createGroundTile = function() {
    let pixels = [];

    for(let i = 0; i < Constants.TILE_SIZE; i++) {
        pixels.push({
            "groundHeight": 8192,
            "waterHeight": 24576,
            "boundaryFlag": true,
            "flags": 0,
            "groundTexture": 0,
            "groundVariation": 0,
            "cliffVariation": 0,
            "cliffTexture": 240,
            "layerHeight": 2
        });
    }

    return pixels;
};

WcMap.prototype._getUnitPk = function() {
    return this.units.length;
};

WcMap.prototype._getPlayerPk = function() {
    return this.info.players.length;
};

function _preparePosition(o, size) {
    let x = (o.x - size.width) * Constants.TILE_SIZE;
    let y = (o.y - size.height) * Constants.TILE_SIZE;

    return {x, y};
}

function _randInt(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

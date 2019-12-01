"use strict";

const merge = require('merge');

const Rand = require('./Random');
const DefaultObjects = require('../wc/DefaultObjects');
const MapConfig = require('../wc/MapConfig');
const UnitType = require('../wc/UnitType');
const JassHelper = require('../jass/JassWrapper');

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
    this.jass = new JassHelper();
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

    this.info = merge.recursive(DefaultObjects.Info, {
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

    this.strings = {
        1: this.info.map.name,
        2: this.info.map.description,
    };

    // todo: setup camera bounds in JASS
    // todo: add trigger strings to JASS
};

WcMap.prototype.setupTerrain = function() {
    this.terrain = merge.recursive(DefaultObjects.Terrain, {
        "map": {
            "width": this.wcMapSize,
            "height": this.wcMapSize,
            "offset": {
                "x": -this._getMaxPos(),
                "y": -this._getMaxPos(),
            }
        },
    });

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

WcMap.prototype.addBase = function(x, y) {
    let pk = this._getPlayerPk();
    let player = this._createPlayer(pk, x, y);

    this.info.players.push(player);

    let unit = this._createUnit(UnitType.PlayerBase, x, y);
    unit.player = pk;

    this.units.push(unit);

    // todo: add user info to JASS
};

WcMap.prototype.addGold = function(x, y) {
    let unit = this._createUnit(UnitType.GoldMine, x, y);
    unit.gold = 10000;

    this.units.push(unit);

    // todo: add passive building to JASS
};

WcMap.prototype.addTree = function(x, y) {
    let treeType = Rand.array([UnitType.FelwoodTree, UnitType.AshenvalTree]);

    let tree = this._createDoodad(treeType, x, y);

    let scale = Rand.float(0.7, 1.2);
    tree.scale = [scale, scale, scale];

    this.doodads.push(tree);
};

WcMap.prototype.addWater = function(x, y) {
    let tile = this._createWaterTile(Rand.bool());

    this._setTile(x, y, tile);
};

WcMap.prototype.addHeroesShop = function(x, y) {
    let unit = this._createUnit(UnitType.HeroShop, x, y);

    this.units.push(unit);

    // todo: add passive building to JASS
};

WcMap.prototype.addItemsShop = function(x, y) {
    let unit = this._createUnit(UnitType.ItemShop, x, y);

    this.units.push(unit);

    // todo: add passive building to JASS
};

WcMap.prototype.addNeutrals = function(x, y) {
    let unitType = Rand.array([UnitType.TrollRegular, UnitType.TrollBerserk, UnitType.TrollShaman, UnitType.TrollBoss]);

    let unit = this._createUnit(unitType, x, y);

    this.units.push(unit);

    // todo: add passive hostile to JASS
};

WcMap.prototype._setTile = function(x, y, tile) {
    let {i, j} = this._returnTile({x, y});

    i = Math.round(i / 2);
    j = Math.round(j / 2);

    this.terrain.tiles[this.wcMapSize - i][j] = tile;
};

WcMap.prototype._createPlayer = function(id, x, y) {
    return {
        "type": id === 0 ? 1 : 2,
        "race": Rand.int(1, 4),
        "playerNum": id,
        "name": "Player " + id,
        "startingPos": {
            "x": x,
            "y": y,
        }
    };
};

WcMap.prototype._createUnit = function(type, x, y) {
    return {
        "id": this._getUnitPk(),
        "hero": {"level": 0, "str": 0, "agi": 0, "int": 0},
        "inventory": [],
        "abilities": [],
        "type": type,
        "variation": 0,
        "position": [x, y, 0],
        "rotation": 0,
        "scale": [1, 1, 1],
        "player": 15,
        "hitpoints": 0,
        "mana": 0,
        "gold": 0,
        "targetAcquisition": 0,
        "color": -1,
    }
};

WcMap.prototype._createDoodad = function(type, x, y) {
    return {
        "id": this._getDoodadPk(),
        "type": type,
        "variation": 1,
        "position": [x, y, 0],
        "angle": 0,
        "scale": [1, 1, 1],
        "flags": {
            "visible": true,
            "solid": true
        },
        "life": 100,
    }
};

WcMap.prototype._createWaterTile = function(deep = false) {
    let ct = MapConfig.CLIFF_GRASS ? 16 : 0;

    return {
        "groundHeight": 8192,
        "waterHeight": 8192,
        "boundaryFlag": false,
        "flags": 64,
        "groundTexture": Rand.int(0, 2),
        "groundVariation": Rand.array([40, 48, 64, 72]),
        "cliffVariation": Rand.array([0, 4, 5]),
        "cliffTexture": ct,
        "layerHeight": deep ? 0 : 1
    }
};

WcMap.prototype._createGroundTile = function() {
    let ct = MapConfig.CLIFF_GRASS ? 240 : 0;

    return {
        "groundHeight": 8192,
        "waterHeight": 8192,
        "boundaryFlag": false,
        "flags": 0,
        "groundTexture": Rand.prob({0: 0.95, 1: 0.03, 2: 0.05}),
        "groundVariation": Rand.prob({0: 0.70, 8: 0.10, 16: 0.10, 20: 0.10}),
        "cliffVariation": Rand.prob({0: 0.70, 4: 0.15, 5: 0.15}),
        "cliffTexture": ct,
        "layerHeight": 2
    }
};

WcMap.prototype._getUnitPk = function() {
    return this.units.length;
};

WcMap.prototype._getDoodadPk = function() {
    return this.doodads.length;
};

WcMap.prototype._getPlayerPk = function() {
    return this.info.players.length;
};

WcMap.prototype._getMaxPos = function() {
    return this.wcMapSize * MapConfig.TILE_SIZE;
};

WcMap.prototype._preparePosition = function(o) {
    let offset = this.wcMapSize;

    let x = (o.x - offset) * MapConfig.TILE_SIZE;
    let y = (o.y - offset) * MapConfig.TILE_SIZE;

    return {x, y};
};

WcMap.prototype._returnTile = function(o) {
    let offset = this.wcMapSize;

    let j = Math.round(o.x / MapConfig.TILE_SIZE + offset);
    let i = Math.round(o.y / MapConfig.TILE_SIZE + offset);

    return {i, j};
};

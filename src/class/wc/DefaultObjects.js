"use strict";

const Info = {
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

const Terrain = {
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
        "width": 32,
        "height": 32,
        "offset": {
            "x": -1920,
            "y": -1920,
        }
    },
    "tiles": [],
};

module.exports = {
    Info,
    Terrain,
};

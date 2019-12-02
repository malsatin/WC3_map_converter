# WC3 map files generator
This project was created to produce Warcraft 3 map files from procedurally generated prototypes, 
produced by [WC3_Map_Generator](https://github.com/KN878/WC3_Map_Generator).

## Implemented Parts

* Terrain generation (regular tiles and water)
* Doodads placement (trees)
* Neutral units and neutral buildings
* Players bases addition
* Map file generation (full pipeline)

## Install / Execute

* Install NodeJS
* Clone this project on your machine
* Install dependencies: `npm install`
* Clone sample input file: `cp ./data/samples/input/input.txt ./data/input/input.txt`
* Run script: `node index.js` or `node index.js "absolute_path_to_destination_folder"`

## Limitations

* MPQ archive step works only on Windows (`MPQeditor.exe` CLI interface limitation)
* Creates files in WC 1.29 protocol version (`wc3maptranslator` limitation)
* Supports only `64x64` input maps (for implementation simplicity)
* Not able to generate minimap images (no modules for that purpose found)

## How you can use it?

I don't think that you would use it to generate actual WC3 maps, but you can find here
useful examples of working build pipeline for working WC3 maps from scratch.

This project also shows how we could generate JASS code procedurally and many other information.

## Related links
https://xgm.guru/p/wc3/w3-file-format
https://xgm.guru/p/wc3/w3-file-format

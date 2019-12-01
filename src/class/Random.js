"use strict";

module.exports = {
    int: _randInt,
    float: _randFloat,
    bool: _randBool,
    array: _randArray,
    prob: _randProb,
};

function _randInt(min, max) {
    return Math.ceil(_randFloat(min, max));
}

function _randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

function _randBool() {
    return Math.random() > 0.5;
}

function _randArray(arr) {
    let rand = Math.floor(Math.random() * arr.length);

    return arr[rand];
}

function _randProb(obj) {
    let rnd = Math.random();
    let s = 0;

    for(let k in obj) {
        let v = obj[k];

        s += v;
        if(rnd < s) {
            return k;
        }
    }

    return obj[Object.keys(obj)[-1]];
}

const util    = require('util');
const fs = require('fs');

var rawdata = fs.readFileSync('data.json');
var FOODS = JSON.parse(rawdata);

console.log(FOODS);

function map
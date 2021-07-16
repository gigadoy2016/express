const util    = require('util');
const fs = require('fs');

var rawdata = fs.readFileSync('data.json');
var FOODS = JSON.parse(rawdata);

//console.log(FOODS);
let items = FOODS.datas;

const filteredItem = items.filter((item)=>{
  return item.id == 29;
});
const foundItem = items.find((item)=>{
  return item.id === 29;
});

const hasHighCalories = items.some((item)=>{
  return item.cal >= 500; 
});
console.log(hasHighCalories);
//console.log(foundItem);
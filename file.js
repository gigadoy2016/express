const fs = require('fs');

var sourceFile = 'D:/11_Conda/darknet/data2/logs/log.txt';

const readPrediction = async function(source){  
  let txt ='No data.';
  try {
      var data =await fs.readFileSync(source, 'utf8');
      var dictionary = data.toString().split("\r\n");
      //console.log(dictionary);
      convertJSON(dictionary);
  } catch(e) {
      console.log('Error:', e.stack);
  }
  return txt;
}
const convertJSON = function(datas){
  let obj = [];
  for(let i=0;i < datas.length;i++){
    let data = datas[i];
    if(data.indexOf('%') >0) {
      label = data.split(":");
      a = {id:label[0],a:label[1]};
      obj.push(a);
    }
  }
  console.log(obj);
}

readPrediction(sourceFile);
const express = require("express"); 
const path      = require('path');
const multer    = require('multer');
const util    = require('util');
const fs = require('fs');
const exec    = util.promisify(require('child_process').exec);

const destinationLogPath = 'D:/11_Conda/darknet/data2/logs/';

const app     = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
const PORT    = 3000;
var fileName  = "";
var dateFormat = require('dateformat');
var rootFile='[app.js]';

var pythonRouter = require('./route/python');
var rawdata = fs.readFileSync('data.json');
var FOODS = JSON.parse(rawdata);

app.use(express.static(path.join(__dirname,'view')));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './view');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './view/uploads');
  },
  filename: (req, file, cb) => {
      console.log(file);
      fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
      
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });

//app.use(multer());
app.use('/python',pythonRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/test", (req, res) => {
  res.render('uploadDemo');
});

app.listen(PORT, () => {
    console.log('Server Listen At 3000')
    console.log(path.join(__dirname,'view'));
});

app.get('/new', (req, res) => {
  res.render('upload');
});

//Upload route
app.post('/upload', upload.single('image'),async function(req, res, next){
  let fileNameFullPath = './view/uploads/'+fileName;
  //console.log(fileName);

  try {
      if(await callDasknet(fileNameFullPath)){
        let datas = await readPrediction(destinationLogPath+'/log.txt');
        //console.log(FOODS);
        let foodSet = await findFoods(datas);
        let foodDatas = await findFoodData(foodSet);
        console.log(foodDatas);
        let html = await getDisplayHTML(foodDatas);
        return res.status(200).render('result',  {'file':fileName,'myTable':html});        
      }else{
        return res.status(201).json({message: 'File uploded Fail'});
      }
  } catch (error) {
      console.error(error);
  }
});
const txtLog = function(message){
  let date = dateFormat(Date.now(),"yyyy-mm-dd h:MM:ss");
  let txt = date+":"+rootFile+">"+message;
  //console.log(txt);
  console.log("----------------------------------------------------------------------");
  return txt;
}

const callDasknet =async function(fullPathFileName){
  const darknetPath = 'D:\\11_Conda\\darknet\\data2\\';
  txtLog("Call Python >"+fullPathFileName);

  const { stdout, stderr } = await exec('darknet detector test D:/11_Conda/darknet/data2/obj.data D:/11_Conda/darknet/data2/yolov4-class84.cfg D:/11_Conda/darknet/data2/backup/yolov4-class84_last.weights '+fullPathFileName+' -dont_show -thresh 0.5 > '+destinationLogPath+'log.txt');
  //console.log('stdout:', stdout);
  console.error('stderr:', stderr);
  return true;
}


// - ---- Function Read File. -------
const readPrediction = async function(source){  
  let txt ='No data.';
  try {
      let data =await fs.readFileSync(source, 'utf8');      
      let dictionary = data.toString().split("\r\n");
      txt =await convertJSON(dictionary);
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
  return obj;
}

const findFoods =async function(datas){
  let items = datas.map((item)=>{
    return item.id;
  });
  return items;
}
const findFoodData = function(foodId){
  let out =[];
  let foods = FOODS.datas;
  //console.log(foods);
  for(let i=0;i < foodId.length;i++){
    let id = foodId[i];
    let food = foods.find((item)=>{
      return item.id == id;
    });
    out.push(food);
  }
  return out;
}

const getDisplayHTML = function(items){
  let tagTR ='';
  for(let i=0; i<items.length; i++){
    let item = items[i];
    tagTR += '<tr><td>'+item.id+'.</td><td>'+item.name+'</td><td class="a-r">'+item.cal+'</td><td><input type="checkbox" id="'+item.id+'"></td></tr>';
  }
  let html=  '<table><tr><th>id</th><th>name</th><th class="a-r">Calories(KCal.)</th><th><input type="checkbox">All</th></tr>';
    html += tagTR;
    html += '<tr><td colspan="2" style="text-align: right;">รวม</td><td class="a-r">610</td><td></td></tr></table>';
  return html;
}
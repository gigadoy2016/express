const express = require("express"); 
var path      = require('path');
var multer    = require('multer');

const app     = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
const PORT    = 3000;
var fileName  = "";
var dateFormat = require('dateformat');
var rootFile='[app.js]';

var pythonRouter = require('./route/python');

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(path.join(__dirname,'view')));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads');
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

app.listen(PORT, () => {
    console.log('Server Listen At 3000')
});

app.get('/new', (req, res) => {
  res.render('upload');
});

//Upload route
app.post('/upload', upload.single('image'),async function(req, res, next){
  console.log(fileName);
  try {
      if(await callPython(fileName)){
        return res.status(201).json({message: 'File uploded successfully'});
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
  console.log(txt);
  console.log("----------------------------------------------------------------------");
  return txt;
}

const callPython =async function(fullPathFileName){
  txtLog("Call Python >"+fullPathFileName);
  const { spawn } = require('child_process');
    const pyProg = spawn('ls', ['./conda.py']);

    await pyProg.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
  return true;
}
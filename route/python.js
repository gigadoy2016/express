var express = require('express');
var path    = require('path');
var router = express.Router();
var dateFormat = require('dateformat');
var rootFile='[python.js]';

const txtLog = function(message){
    let date = dateFormat(Date.now(),"yyyy-mm-dd h:MM:ss");
    let txt = date+":"+rootFile+">"+message;
    console.log(txt);
    console.log("----------------------------------------------------------------------");
    return txt;
  }


router.get('/',function(req,res){
    txtLog('Get All');
    //res.status(200).json('{status:OK}');
    const { spawn } = require('child_process');
    const pyProg = spawn('python', ['./conda.py']);

    pyProg.stdout.on('data', function(data) {
        console.log(data.toString());
        res.write(data);
        res.end('end');
    });
});





module.exports =router;
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('darknet detector test D:/11_Conda/darknet/data2/obj.data D:/11_Conda/darknet/data2/yolov4-class84.cfg D:/11_Conda/darknet/data2/backup/yolov4-class84_last.weights D:/11_Conda/darknet/data2/obj/A001/A001_7.jpg -dont_show -thresh 0.5 > D:/11_Conda/darknet/data2/logs/log.txt');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('node -v');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
lsExample();
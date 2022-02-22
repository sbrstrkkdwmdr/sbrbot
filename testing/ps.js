/*const execSync = require('child_process').execSync;
// import { execSync } from 'child_process';  // replace ^ if using ES modules

const output = execSync('echo penis', { encoding: 'utf-8' });  // the default is 'buffer'
execSync('@ECHO ON', { encoding: 'utf-8'})
execSync('@echo penis', { encoding: 'utf-8' }); 
execSync('npm list')
//execSync('echo penis', { encoding: 'utf-8' }); 
//console.log('Output was:\n', output);
*/
function exec(cmd, handler = function(error, stdout, stderr){console.log(stdout);if(error !== null){console.log(stderr)}})
{
    const childfork = require('child_process');
    return childfork.exec(cmd, handler);
}
exec('echo test');
exec('npm list')
exec(`C:/Users/saber/Desktop/danser-go-dev/danser-go-dev-OTHERS/danser.exe -skip -settings=bluebudgie -r="C:/Users/saber/Desktop/kusa/bot/sbrbot/files/replay.osr" -record`)
exec('echo ok')
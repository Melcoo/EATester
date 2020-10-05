/////////////////////////////////////////////////////
///  Python handler
/////////////////////////////////////////////////////
const path = require('path');


exports.spawnPyApp = (app, onStdOut, onClose, ...args) => {
    const { spawn } = require('child_process');
    let pyOutput = '';

    // // For built app
    // const pyApp = spawn(`"` + path.join(__dirname, '..\\..\\..\\..') + `\\app\\pyapp\\EATesterPy\\Tester\\dist\\${app}"`, args, {shell:true});
    // // For running app
    console.log(args);
    const pyApp = spawn(`"` + __dirname + `\\..\\pyapp\\EATesterPy\\Tester\\dist\\${app}"`, args, { shell:true });
    // const pyApp = await spawn('cmd', ['"' + __dirname + "\\..\\pyapp\\EATesterPy\\Tester\\dist\\eatester.exe" + '"', args], {shell:true});
 
    pyApp.stdout.on('data', (data) => { 
        onStdOut(data, pyApp);
    });
    pyApp.stderr.on('data', (data) => {
        console.log(`Python: stderr: ${data}`);
    });
    pyApp.on('close', (code) => {
        onClose(code);
      });
}

/////////////////////////////////////////////////////
///  Python handler
/////////////////////////////////////////////////////
const path = require('path');


exports.spawnPyApp = (app, onStdOut, onClose, ...args) => {
    const { spawn } = require('child_process');
    const { builtApp } = require('./app');
    let pyApp = '';

    if (builtApp() == true) {
        // For built app
        pyApp = spawn(`"` + path.join(__dirname, '..\\..\\..\\..') + `\\app\\pyapp\\EATesterPy\\Tester\\dist\\${app}"`, args, {shell:true});
    } else {
        // For running app
        pyApp = spawn(`"` + __dirname + `\\..\\pyapp\\EATesterPy\\Tester\\dist\\${app}"`, args, { shell:true });
    }
    console.log(args);

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

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


//// Playing with PythonShell
let { PythonShell } = require('python-shell');

PythonShell.defaultOptions = {
    mode: 'text',
    pythonPath: 'C:\\Python3\\python.exe',
    scriptPath: `${__dirname}`
};

const testPythonShell = async() => {
    let pyOutput = '';
    let pyData;
    let PyShell = await new PythonShell('pyapp\\dist\\pyapp.exe');
    PyShell.on('message', pyData => {
        let date = new Date();
        pyOutput += `<p>${pyData}, JS time: ${date.getMinutes()}:${date.getSeconds()}</p>`;
            
        document.querySelector('.div-text').innerHTML = pyOutput;
    });
}

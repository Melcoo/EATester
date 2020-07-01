const { ipcRenderer, shell } = require('electron');
let { PythonShell } = require('python-shell');
const path = require('path');


ipcRenderer.on('ev1', (event, content) => {
    console.log(`Here is event ev1 with content ${content}`);
})

document.getElementById('py-templ-btn').addEventListener('click', () =>{
    spawnPyApp('templ');
});

document.getElementById('py-eatester-btn').addEventListener('click', () =>{
    spawnPyApp('eatester');
});

document.getElementById('py-report-btn').addEventListener('click', () =>{
    spawnPyApp('reports');
});

document.getElementById('py-clear-btn').addEventListener('click', () =>{
    pyOutput = '';
    document.querySelector('.div-text').innerHTML = '';
});

document.getElementById('quit-btn').addEventListener('click', () =>{
    // Close the Electon application
    ipcRenderer.send('ev_app_quit');
});

let pyOutput = '';
async function spawnPyApp(app, args=[]) {
    const { spawn } = require('child_process');

    // For built app
    const pyApp = await spawn(`"` + path.join(__dirname, '..\\..\\..') + `\\app\\pyapp\\EATesterPy\\Tester\\dist\\${app}.exe"`, args, {shell:true});
    // For running app
    // const pyApp = await spawn(`"` + __dirname + `\\pyapp\\EATesterPy\\Tester\\dist\\${app}.exe"`, args, {shell:true});
 
    pyApp.stdout.on('data', (data) => {
        pyOutput += `<p>${data}</p>`;
        document.querySelector('.div-text').innerHTML = pyOutput;
    });
    
    pyApp.stderr.on('data', (data) => {
        console.error(`Python: stderr: ${data}`);
    });
}


PythonShell.defaultOptions = {
    mode: 'text',
    pythonPath: 'C:\\Python3\\python.exe',
    scriptPath: `${__dirname}`
};

async function testPythonShell() {
    let pyOutput = '';
    let pyData;
    let PyShell = await new PythonShell('pyapp\\dist\\pyapp.exe');
    PyShell.on('message', pyData => {
        let date = new Date();
        pyOutput += `<p>${pyData}, JS time: ${date.getMinutes()}:${date.getSeconds()}</p>`;
            
        document.querySelector('.div-text').innerHTML = pyOutput;
    });
}


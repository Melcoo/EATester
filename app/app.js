const { ipcRenderer, process } = require('electron');
let { PythonShell } = require('python-shell');
const path = require('path');



ipcRenderer.on('ev1', (event, content) => {
    console.log(`Here is event ev1 with content ${content}`);
})

document.getElementById('py-templ-btn').addEventListener('click', () =>{
    spawnPyApp('templ', '');
});

document.getElementById('py-eatester-btn').addEventListener('click', () =>{
    spawnPyApp('eatester', '');
});

document.getElementById('py-report-btn').addEventListener('click', () =>{
    spawnPyApp('reports', '');
});

document.getElementById('py-clear-btn').addEventListener('click', () =>{
    pyOutput = '';
    document.querySelector('.div-text').innerHTML = '';
});

document.getElementById('quit-btn').addEventListener('click', () =>{
    // Close the Electon application
    ipcRenderer.send('ev_app_quit');
});


async function spawnPyApp(app, args) {
    let pyOutput = '';
    const { spawn } = require('child_process');

    // Python spawn - careful at python application location
    // For built app
    // const pyApp = await spawn(path.join(__dirname, '..\\..\\..', `\\pyapp\\EATesterPy\\Tester\\dist\\${app}.exe`), [args]);
    // For running app
    // const pyApp = await spawn('cmd', ['/c', path.join(__dirname, `\\pyapp\\EATesterPy\\Tester\\dist\\templ.exe`), args]);
    const pyApp = await spawn(path.join(__dirname, `\\pyapp\\EATesterPy\\Tester\\dist\\${app}.exe`), [args]);

    pyApp.stdout.on('data', (data) => {
        pyOutput += `<p>${data}</p>`;
        document.querySelector('.div-text').innerHTML = pyOutput;
    });
    
    pyApp.stderr.on('data', (data) => {
        console.error(`Python: stderr: ${data}`);
    });
    
    pyApp.on('exit', (code) => {
        console.log(`Python: child process exited with code ${code}`);
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


const { ipcRenderer, shell } = require('electron');
let mt4Path = '';


// DOM elements



//// Minimize and close buttons
document.getElementById('window__btn--close').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:close');
});

document.getElementById('window__btn--minimize').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:minimize');
});


//// Get MT4 folder path
document.getElementById('ea__mt4path--file').onchange = (() => {
    const terminalPath = document.getElementById('ea__mt4path--file').files[0].path;

    // Update text area with area
    if(terminalPath.substr(-12) == 'terminal.exe') {
        document.getElementById('ea__mt4path--path').value = terminalPath;
        mt4Path = terminalPath.replace('terminal.exe', '');
    } else {
        document.getElementById('ea__mt4path--path').value = 'Path to "terminal.exe" is not correct!';
    }
    
}); 

//// Display EA options


//// Get selected EA option


//// Change opacity of "Continue" button
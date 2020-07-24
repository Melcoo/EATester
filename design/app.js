const { ipcRenderer, shell } = require('electron');


//// Minimize and close buttons
document.getElementById('window__btn--close').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:close');
});

document.getElementById('window__btn--minimize').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:minimize');
});


//// Get MT4 folder path


//// Display EA options


//// Get selected EA option
const { ipcRenderer, shell } = require('electron');

document.getElementById('btn-close').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:close');
});

document.getElementById('btn-minimize').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:minimize');
});

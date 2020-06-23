const electron = require('electron');
const electronReload = require('electron-reload');
const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;


// Automatically reload app content
electronReload(__dirname);

app.on('ready', () =>  {
    mainWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
        width: 500,
        height: 500
    });
    mainWindow.loadURL(`file://${__dirname}/app/main.html`);
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit()
    });
});

ipcMain.on('ev_app_quit', (event, content) => {
    app.quit();
});


if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'Developer',
        submenu: [
            {
                role: 'reload'                  // This is a shortcut for being able to reload our code
            },
            {                   
                label: 'Toggle Developer Tools',
                accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Control+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    })
}
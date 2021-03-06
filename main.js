const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const updater = require('./updater.js');


/////////////////////////////////////////////////////
///  Main Window
/////////////////////////////////////////////////////
let mainWindow;
app.on('ready', () =>  {
    mainWindow = new BrowserWindow({
        webPreferences:{   
            nodeIntegration: true,
            enableRemoteModule: true },
        width: 1280,
        height: 800,
        resizable: false,
        frame: false
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadURL(`file://${__dirname}/app/main.html`);
    // mainWindow.webContents.openDevTools();
    // Check for updates 10 seconds after launch
    setTimeout(updater, 10000);

    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit()
    });
});

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
  })


/////////////////////////////////////////////////////
///  IPC handlers
/////////////////////////////////////////////////////

ipcMain.on('ev_app_quit', (event, content) => {
    app.quit();
});

ipcMain.on('ev:close', () => {
    app.quit();
});

ipcMain.on('ev:minimize', () => {
    mainWindow.minimize();
});

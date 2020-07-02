const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
// require('electron-reload')(__dirname);
const updater = require('./updater.js');


let mainWindow;
app.on('ready', () =>  {
    mainWindow = new BrowserWindow({
        webPreferences: { nodeIntegration: true },
        width: 500,
        height: 500
    });
    mainWindow.loadURL(`file://${__dirname}/app/main.html`);
    // TODO: Remove for production
    // mainWindow.webContents.openDevTools();
    // Check for updates 10 seconds after launch
    setTimeout(updater, 10000);
    
    mainWindow.on('closed', () => {
        mainWindow = null;
        app.quit()
    });
});

ipcMain.on('ev_app_quit', (event, content) => {
    app.quit();
});


// Create a Menu template with one array element(our app has only one dropdown menu)
const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Submenu',
                click() {
                    console.log('Clicked on File -> Submenu');
                }
            }
        ]
    }
];

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
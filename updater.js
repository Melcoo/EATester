const { autoUpdater } = require("electron-updater");
const { dialog } = require("electron");

// Configure log debugging
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "debug";

// Disable auto downloading of updates
// autoUpdater.autoDownload = false;

// Single export to check for and apply any avaiable updates
module.exports = () => {
    autoUpdater.checkForUpdates();

    /*  
    autoUpdater.on('update-available', () => {
        // Prompt the user to download or postpone the update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version of EA Tester is avaiable. Would you like to update now?',
            buttons: ['Update', 'No']
        }, buttonIndex => {
            // If button = 0 (Update), start downloading the update
            if (buttonIndex === 0) 
            {
                autoUpdater.downloadUpdate()
            } else {
                autoUpdater.downloadUpdate()
            }
        });
    });
    */

    // Listen for the download being ready
    autoUpdater.on('update-downloaded', () => {
        // Prompt the user to install the update
        dialog.showMessageBox({
            type: 'info',
            title: 'Update downloaded',
            message: 'A new version of EA Tester was downloaded and will be installed after you quit the application.',
            buttons: ['Ok']
        });
    })
}

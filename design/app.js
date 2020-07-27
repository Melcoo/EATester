const { ipcRenderer, shell } = require('electron');
const fs = require('fs');


// DOM elements


// Global variables
let mt4Path = '';
let ea = '';
const selectTag = document.querySelector('.ea__ealist--select');



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

        // Display EAs inside \MQL4\Experts\
        displayEAOptions();
    } else {
        document.getElementById('ea__mt4path--path').value = 'Path to "terminal.exe" is not correct!';
        continueBtnToggle(false);
        selectTag.textContent = '';
    }
}); 

//// Display EA options
function displayEAOptions() {
    const files = fs.readdirSync(mt4Path + '\\MQL4\\Experts\\');

    selectTag.textContent = '';
    files.forEach(el => {
        let option = document.createElement('option');

        if (el.substr(-4) == '.ex4') {
            option.text = el.replace('.ex4', '');
            selectTag.add(option);
        }
    });

    ea = selectTag.options[0].text;
    continueBtnToggle(true);
}

//// Get selected EA option
selectTag.onchange = (() => {
    ea = selectTag.options[selectTag.selectedIndex].text;
});

//// Change opacity of "Continue" button
function continueBtnToggle(on) {
    const btn = document.querySelector('.ea__getparams');
    if(on === false) {
        btn.classList.add('nonactive');
    } else if(on === true) {
        if (btn.classList.contains('nonactive')) {
            btn.classList.remove('nonactive');
        }
    }
}
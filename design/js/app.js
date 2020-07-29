const { ipcRenderer, shell } = require('electron');
const fs = require('fs');


// DOM elements


// Global variables
let mt4Path = '';
let eaToRun = '';

const pages = [
    {
        name: 'ea',
        url: 'html\\ea.html',
        initFn: runEaPage,
        btnEl: 'nav__btn--ea'
    },
    {
        name: 'params',
        url: 'html\\params.html',
        initFn: runParamsPage,
        btnEl: 'nav__btn--param'
    },
    {
        name: 'results',
        url: 'html\\results.html',
        initFn: runResultsPage,
        btnEl: 'nav__btn--res'
    }
];


const topDiv = document.querySelector('.top');

/////////////////////////////////////////////////////
///  Init
/////////////////////////////////////////////////////
loadPage(pages[1]);


/////////////////////////////////////////////////////
///  Menu Bar
/////////////////////////////////////////////////////
/**
  * @param {String} url - address for the HTML to fetch
  * @return {String} the resulting HTML string fragment
  */
async function fetchHtmlAsText(url) {
    const response = await fetch(url);
    return await response.text();
}

async function loadPage(page) {
    topDiv.innerHTML = await fetchHtmlAsText(page.url);
    // Activate menu bar button
    menuBtnActivate(page);

    page.initFn();
}

//// Minimize and close buttons
document.getElementById('window__btn--close').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:close');
});

document.getElementById('window__btn--minimize').addEventListener('click', () => {
    let evResp = ipcRenderer.send('ev:minimize');
});

//// Change pages using menu buttons
document.getElementById('nav__btn--ea').addEventListener('click', () => {
    loadPage(pages[0]);
});

document.getElementById('nav__btn--param').addEventListener('click', () => {
    loadPage(pages[1]);
});

document.getElementById('nav__btn--res').addEventListener('click', () => {
    loadPage(pages[2]);
});
    

//// Change style for Menu bar buttons
function menuBtnActivate(page) {
    const btn = document.getElementById(page.btnEl);
    pages.forEach(el => {
        document.getElementById(el.btnEl).classList.remove('menubtnactive');
    });

    btn.classList.add('menubtnactive');
}

/////////////////////////////////////////////////////
///  Page1: EA
/////////////////////////////////////////////////////
let selectEaEl = '';

// Run EA Page code
function runEaPage() {
    selectEaEl = document.querySelector('.ea__ealist--select');

    // Display old data stored before leaving EA page
    if (mt4Path) { 
        document.getElementById('ea__mt4path--path').value = mt4Path + 'terminal.exe';
        listEAOptions();
    };

    //// Get MT4 folder path
    document.getElementById('ea__mt4path--file').addEventListener('change', () => {
        const terminalPath = document.getElementById('ea__mt4path--file').files[0].path;
    
        // Update text area with area
        if(terminalPath.substr(-12) == 'terminal.exe') {
            document.getElementById('ea__mt4path--path').value = terminalPath;
            mt4Path = terminalPath.replace('terminal.exe', '');
    
            // Display EAs inside \MQL4\Experts\
            listEAOptions();
        } else {
            document.getElementById('ea__mt4path--path').value = 'Path to "terminal.exe" is not correct!';
            mt4Path = '';
            selectEaEl.textContent = '';
            continueBtnToggle(false);   
        }
    });

    //// Get selected EA option
    selectEaEl.onchange = (() => {
        eaToRun = selectEaEl.options[selectEaEl.selectedIndex].text;
    });

    //// Handle "Continue" button - move on to Params page
    document.getElementById('ea__continue--btn').addEventListener('click', () => {
        if (isContinueBtnActive()) { loadPage(pages[1]) };
    }); 
}

//// Display EA options
function listEAOptions() {
    const files = fs.readdirSync(mt4Path + '\\MQL4\\Experts\\');

    selectEaEl.textContent = '';
    files.forEach(el => {
        let option = document.createElement('option');

        if (el.substr(-4) == '.ex4') {
            option.text = el.replace('.ex4', '');
            selectEaEl.add(option);
        }
    });

    eaToRun = selectEaEl.options[0].text;
    continueBtnToggle(true);
}

//// Change opacity of "Continue" button
function continueBtnToggle(on) {
    const btn = document.querySelector('.ea__continue');
    if(on === false) {
        btn.classList.add('nonactive');
    } else if(on === true) {
        if (btn.classList.contains('nonactive')) {
            btn.classList.remove('nonactive');
        }
    }
}

function isContinueBtnActive() {
    const btn = document.querySelector('.ea__continue');
    return !(btn.classList.contains('nonactive'));
}


/////////////////////////////////////////////////////
///  Page2: PARAMS
/////////////////////////////////////////////////////
function runParamsPage() {

}


/////////////////////////////////////////////////////
///  Page2: RESULTS
/////////////////////////////////////////////////////
function runResultsPage() {

}

const { ipcRenderer, remote } = require('electron');
const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const Ea = require('./ea');
const Params = require('./params');
const Results = require('./results');
const { getElements } = require('./base');


let elements = '';
const STARTPAGE = 0;
const BUILT_APP = true;


/////////////////////////////////////////////////////
///  Menu Bar
/////////////////////////////////////////////////////
const fetchHtmlAsText = async(url) => {
    const response = await fetch(url);
    return await response.text();
}

//// Load one of the 3 pages [0, 1, 2]
const loadPage = async(pageNo) => {
    elements.top.innerHTML = await fetchHtmlAsText(pages[pageNo].url);
    // Activate menu bar button
    menuBtnActivate(pages[pageNo]);

    pages[pageNo].initFn();
    state.activePage = pageNo;
    handleBtns();
}

const menuBtnHandler = () => {
    elements.closeBtn.addEventListener('click', () => { let evResp = ipcRenderer.send('ev:close') });
    elements.minBtn.addEventListener('click', () => { let evResp = ipcRenderer.send('ev:minimize') });
    elements.eaBtn.addEventListener('click', () => { loadPage(0) });
    elements.paramBtn.addEventListener('click', () => { loadPage(1) });
    elements.resultBtn.addEventListener('click', () => { loadPage(2) });
}
    
//// Change style for Menu bar buttons
const menuBtnActivate = (page) => {
    const btn = document.getElementById(page.btnEl);
    pages.forEach(el => {
        document.getElementById(el.btnEl).classList.remove('menubtnactive');
    });

    btn.classList.add('menubtnactive');
}

//// Save state variable into json.cfg
const saveConfig = () => {
    const dialogOptions = {
        title: 'Save configuration',
        filters: [{
            name: 'EA Tester config file', 
            extensions: ['eat']
        }]
    }; 

    const cfgPath = remote.dialog.showSaveDialogSync(dialogOptions);
    if (cfgPath) {
        fs.writeFile(path.resolve(cfgPath), JSON.stringify(state), (err) => {
            if (err) {
              return console.log(err);
            }
        });
    }
}

//// Load state variable from json.cfg
const loadConfig = () => {   
    const dialogOptions = {
        title: 'Load configuration',
        filters: [{
            name: 'EA Tester config file', 
            extensions: ['eat']
        }],
        properties: ['openFile']
    };
    
    const cfgPath = remote.dialog.showOpenDialogSync(dialogOptions);
    if (cfgPath) {
        state = JSON.parse(fs.readFileSync(cfgPath[0]));
        state.btnCfg = {
            continueBtn: false,
            runBtn: false,
            pauseBtn: false
        }
        loadPage(state.activePage);
    } 
}

//// Change text and add/remove 'nonactive' for Continue Btn on EA page
const setContinueBtn = (cfg) => {
    state.btnCfg.continueBtn = cfg;
    handleBtns();
}

//// Change text and add/remove 'nonactive' for Run Btn on PARAMS page
const setRunBtn = (cfg) => {
    state.btnCfg.runBtn = cfg;
    handleBtns();
}

//// Change text and add/remove 'nonactive' for Pause Btn on RESULTS page
const setPauseBtn = (cfg) => {
    state.btnCfg.pauseBtn = cfg;
    handleBtns();
    if (cfg == false) {
        mt4RunningEv.emit('run');
    }
}

const handleBtns = () => {
    let btnEl = '';
    let textActive = '';
    let textInactive = '';
    let btnCfg = '';
    switch (state.activePage){
        case 0:
            btnEl = getElements().ea.continueBtn;
            textActive = 'Get default settings';
            textInactive = 'Get default settings';
            btnCfg = state.btnCfg.continueBtn;

            break;
        case 1:
            btnEl = getElements().params.runBtn;
            textActive = 'Run';
            textInactive = 'Running';
            btnCfg = state.btnCfg.runBtn;

            break;
        case 2:
            btnEl = getElements().results.pauseBtn;
            textActive = 'Pause';
            textInactive = 'Resume';
            btnCfg = state.btnCfg.pauseBtn;

            break;                         
    }

    btnEl.textContent = textActive;
    if (btnCfg == true) {
        btnEl.classList.add('nonactive');
        btnEl.textContent = textInactive;
    } else if ((btnCfg == false) && (btnEl.classList.contains('nonactive'))){
        btnEl.classList.remove('nonactive');
    }
}

const getBtnCfg = () => state.btnCfg;
const mt4RunningEv = new EventEmitter();
const clearParamsCfg = () => {
    state.paramsCfg = {};
}
const builtApp = () => BUILT_APP;


exports.builtApp = builtApp;
exports.loadPage = loadPage;
exports.saveConfig = saveConfig;
exports.loadConfig = loadConfig;
exports.getBtnCfg = getBtnCfg;
exports.setContinueBtn = setContinueBtn;
exports.setRunBtn = setRunBtn;
exports.handleBtns = handleBtns;
exports.setPauseBtn = setPauseBtn;
exports.mt4RunningEv = mt4RunningEv;
exports.clearParamsCfg = clearParamsCfg;


/////////////////////////////////////////////////////
///  Page 0: EA
/////////////////////////////////////////////////////
let selectEaEl = '';

//// Run EA Page code
const initEa = () => {
    const ea = new Ea(state.eaCfg, pages);

    // Display old data stored before leaving EA page
    ea.restoreOldData();
}


/////////////////////////////////////////////////////
///  Page 1: PARAMS
/////////////////////////////////////////////////////
const initParams = () => {
    const params = new Params(state.eaCfg.eaName, state.paramsCfg);

    // Display param names and values based on .json template 
    params.renderParams();

    // Listen to button events on this page
    params.btnHandler(state.eaCfg);
}


/////////////////////////////////////////////////////
///  Page 2: RESULTS
/////////////////////////////////////////////////////
const initResults = () => {
    const results = new Results(state.eaCfg.eaName, state.resultsCfg);

    // Display columns with param names based on report.json and state.paramsCfg array values
    results.renderParamNames(state.paramsCfg);

    // Listen to button events on this page
    results.btnHandler();

    results.renderResults();
}


/////////////////////////////////////////////////////
///  Init
/////////////////////////////////////////////////////
/** Global state of the app
 *  - Ea object
 *  - Params object
 *  - Results obejct
 */
let state = {
    activePage: '',
    eaCfg: {
        mt4path: '',
        eaName: '',
        symbol: '',
        period: '',
        spread: '',
        fromDate: '',
        toDate: ''
    },
    paramsCfg: {},
    resultsCfg: {},
    btnCfg: {
        continueBtn: true,
        runBtn: false,
        pauseBtn: false
    }
}

const pages = [
    {
        name: 'ea',
        url: 'html\\ea.html',
        initFn: initEa,
        btnEl: 'nav__btn--ea'
    },
    {
        name: 'params',
        url: 'html\\params.html',
        initFn: initParams,
        btnEl: 'nav__btn--param'
    },
    {
        name: 'results',
        url: 'html\\results.html',
        initFn: initResults,
        btnEl: 'nav__btn--res'
    }
];

const initApp = () => {
    // Will be set after loading prvious config
    state.activePage = STARTPAGE;
    elements = getElements().main;

    menuBtnHandler();
    loadPage(state.activePage);

    mt4RunningEv.on('run', () => console.log('Pausing MT4 Run'));

    // First time after app is installed, display info
    setTimeout(() => { 
        showInfo();
    }, 3000);
}

initApp();


/////////////////////////////////////////////////////
///  Debugging and messages
/////////////////////////////////////////////////////

remote.globalShortcut.register('CommandOrControl+Shift+K', () => {
    remote.BrowserWindow.getFocusedWindow().webContents.openDevTools()
  })
  
  window.addEventListener('beforeunload', () => {
    remote.globalShortcut.unregisterAll()
  })

const showInfo = () => {
    const Store = require('electron-store');
    const store = new Store();
    let showMsg = false;

    switch(store.get('noOfAppRuns')) {
        case 2:
            // No need to display any message
            break;
        case 1:
            store.set('noOfAppRuns', 2);
            showMsg = true;
            break;
        case undefined:
            store.set('noOfAppRuns', 1);
            showMsg = true;
            break;
        default: 
            break;
    }

    if (showMsg) {
        const { dialog } = require('electron').remote;
        
        dialog.showMessageBoxSync({
            type: 'info',
            title: 'Before using this app',
            message: 'Make sure you run MT4 terminal at least one time in "portable" mode and you are logged in.\n\nMake sure you have Expert Advisors in "..\\MQL4\\Experts" folder.',
            buttons: ['Ok']
        });
    }
};

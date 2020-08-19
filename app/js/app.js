const { ipcRenderer, shell, remote } = require('electron');
const path = require('path');
const fs = require('fs');
const Ea = require('./ea');
const Params = require('./params');
const Results = require('./results');
const { getElements } = require('./base');


let elements = '';


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
}

const btnHandler = () => {
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
        fs.writeFile(path.resolve(cfgPath), JSON.stringify(state), (err,data) => {
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
        loadPage(state.activePage);
    }    
}

exports.loadPage = loadPage;
exports.saveConfig = saveConfig;
exports.loadConfig = loadConfig;

/////////////////////////////////////////////////////
///  Page 0: EA
/////////////////////////////////////////////////////
let selectEaEl = '';

//// Run EA Page code
const controlEa = () => {
    const ea = new Ea(state.eaCfg, pages);

    // Display old data stored before leaving EA page
    ea.restoreOldData();
}


/////////////////////////////////////////////////////
///  Page 1: PARAMS
/////////////////////////////////////////////////////
const controlParams = () => {
    const params = new Params(state.eaCfg.eaName, state.paramsCfg);

    // Display param names and values based on .json template 
    params.renderParams();

    // Listen to button events on this page
    params.btnHandler();
}


/////////////////////////////////////////////////////
///  Page 2: RESULTS
/////////////////////////////////////////////////////
const controlResults = () => {
    const results = new Results(state.eaCfg.eaName, state.resultsCfg);

    // Listen to button events on this page
    results.btnHandler()    
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
    resultsCfg: {}
}

const pages = [
    {
        name: 'ea',
        url: 'html\\ea.html',
        initFn: controlEa,
        btnEl: 'nav__btn--ea'
    },
    {
        name: 'params',
        url: 'html\\params.html',
        initFn: controlParams,
        btnEl: 'nav__btn--param'
    },
    {
        name: 'results',
        url: 'html\\results.html',
        initFn: controlResults,
        btnEl: 'nav__btn--res'
    }
];

const initApp = () => {
    // Will be set after loading prvious config
    state.activePage = 2;
    elements = getElements().main;

    btnHandler();
    loadPage(state.activePage);
}

initApp();



const { ipcRenderer, shell } = require('electron');
const Ea = require('./ea');
const Params = require('./params');
const { spawnPyApp } = require('./py');
const { getElements } = require('./base');

let elements = '';


/////////////////////////////////////////////////////
///  Menu Bar
/////////////////////////////////////////////////////
const fetchHtmlAsText = async(url) => {
    const response = await fetch(url);
    return await response.text();
}

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

exports.loadPage = loadPage;

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
    state.activePage = 0;

    elements = getElements().main;

    btnHandler();

    loadPage(state.activePage);
}

initApp();



const { ipcRenderer, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const Ea = require('./ea');
const Params = require('./params');
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
exports.loadPage = loadPage;

const btnHandler = () => {
    elements.closeBtn.addEventListener('click', () => {
        let evResp = ipcRenderer.send('ev:close');
    });

    elements.minBtn.addEventListener('click', () => {
        let evResp = ipcRenderer.send('ev:minimize');
    });

    elements.eaBtn.addEventListener('click', () => {
        loadPage(0);
    });

    elements.paramBtn.addEventListener('click', () => {
        loadPage(1);
    });

    elements.resultBtn.addEventListener('click', () => {
        loadPage(2);
    });
}

    
//// Change style for Menu bar buttons
const menuBtnActivate = (page) => {
    const btn = document.getElementById(page.btnEl);
    pages.forEach(el => {
        document.getElementById(el.btnEl).classList.remove('menubtnactive');
    });

    btn.classList.add('menubtnactive');
}

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
///  Python handler
/////////////////////////////////////////////////////
const spawnPyApp = async(app, args=[]) => {
    const { spawn } = require('child_process');
    let pyOutput = '';

    // For built app
    const pyApp = await spawn(`"` + path.join(__dirname, '..\\..\\..\\..') + `\\app\\pyapp\\EATesterPy\\Tester\\dist\\${app}.exe"`, args, {shell:true});
    // For running app
    // const pyApp = await spawn(`"` + __dirname + `\\pyapp\\EATesterPy\\Tester\\dist\\${app}.exe"`, args, {shell:true});
 
    pyApp.stdout.on('data', (data) => {
        pyOutput += `<p>${data}</p>`;
        document.querySelector('.div-text').innerHTML = pyOutput;
    });
    
    pyApp.stderr.on('data', (data) => {
        console.error(`Python: stderr: ${data}`);
    });
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
    paramsCfg: {

    },
    resultsCfg: {

    }
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
    state.activePage = 1;

    elements = getElements().main;

    btnHandler();

    loadPage(state.activePage);
}

initApp();


/////////////////////////////////////////////////////
///  Test code
/////////////////////////////////////////////////////

//// Sample code for sync scrolling

/*
var ignoreScrollEvents = false
function syncScroll(element1, element2) {
  element1.scroll(function (e) {
    var ignore = ignoreScrollEvents
    ignoreScrollEvents = false
    if (ignore) return

    ignoreScrollEvents = true
    element2.scrollTop(element1.scrollTop())
  })
}
syncScroll($("#div1"), $("#div2"))
syncScroll($("#div2"), $("#div1"))
*/

/* <div id="div1" style="float:left;overflow:auto;height:100px;width:200px;">
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
</div>

<div id="div2" style="float:right;overflow:auto;height:100px;width:200px;">
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
</div> */


////// Sample code for image link opening outside Electron
/* 
https://stackoverflow.com/questions/50519346/external-image-links-in-electron-do-not-open-in-an-external-browser
*/

//// Playing with PythonShell
let { PythonShell } = require('python-shell');

PythonShell.defaultOptions = {
    mode: 'text',
    pythonPath: 'C:\\Python3\\python.exe',
    scriptPath: `${__dirname}`
};

const testPythonShell = async() => {
    let pyOutput = '';
    let pyData;
    let PyShell = await new PythonShell('pyapp\\dist\\pyapp.exe');
    PyShell.on('message', pyData => {
        let date = new Date();
        pyOutput += `<p>${pyData}, JS time: ${date.getMinutes()}:${date.getSeconds()}</p>`;
            
        document.querySelector('.div-text').innerHTML = pyOutput;
    });
}


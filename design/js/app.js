const { ipcRenderer, shell } = require('electron');
const fs = require('fs');
const path = require("path");


/** Global state of the app
 *  - Ea object
 *  - Params object
 *  - Results obejct
 */
const state = {};


// Global variables
let mt4Path = '';
let stSettings = {
    eaName: '',
    symbol: '',
    period: '',
    spread: '',
    fromDate: '',
    toDate: ''
}


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
///  Page 0: EA
/////////////////////////////////////////////////////
let selectEaEl = '';

//// Run EA Page code
function runEaPage() {
    selectEaEl = document.getElementById('ea__ealist--select');

    // Display old data stored before leaving EA page
    restoreOldData_EA();

    //// Get MT4 folder path
    document.getElementById('ea__mt4path--file').addEventListener('change', () => {
        const terminalPath = document.getElementById('ea__mt4path--file').files[0].path;
    
        // Update text area with area
        if(terminalPath.substr(-12) == 'terminal.exe') {
            document.getElementById('ea__mt4path--path').value = terminalPath;
            mt4Path = terminalPath.replace('terminal.exe', '');
    
            enableEA();
        } else {
            mt4Path = '';
            selectEaEl.textContent = '';

            document.getElementById('ea__mt4path--path').value = 'Path to "terminal.exe" is not correct!';
            document.querySelectorAll('input[name="ea__to_disable"]').forEach(el => {
                el.setAttribute("disabled");
            });

            continueBtnToggle(false);   
        }
    });

    //// Handle "Continue" button - move on to Params page
    document.getElementById('ea__continue--btn').addEventListener('click', continueBtnHandle);
}

//// Display EA options
function enableEA() {
    const files = fs.readdirSync(mt4Path + '\\MQL4\\Experts\\');

    selectEaEl.textContent = '';
    files.forEach(el => {
        let option = document.createElement('option');

        if (el.substr(-4) == '.ex4') {
            option.text = el.replace('.ex4', '');
            selectEaEl.add(option);
        }
    });

    stSettings.eaName = selectEaEl.options[0].text;

    document.querySelectorAll('[name*="ea__to_disable"]').forEach(el => {
        el.removeAttribute("disabled");
    });

    continueBtnToggle(true);
}

//// Restore old data before leaving the page
function restoreOldData_EA() {
    if (mt4Path) { 
        document.getElementById('ea__mt4path--path').value = mt4Path + 'terminal.exe';
        document.getElementById("ea__easymbol--text").value = stSettings.symbol;
        document.getElementById("ea__eaperiod--select").value = stSettings.period;
        document.getElementById("ea__easpread--select").value = stSettings.spread;
        document.getElementById("ea__eafrom--date").value = stSettings.fromDate.replace(/\./g, '-');
        document.getElementById("ea__eato--date").value = stSettings.toDate.replace(/\./g, '-');

        enableEA();
    };
}

//// handle Continue button
function continueBtnHandle() {
    if (isContinueBtnActive()) {
        eaSymbol = document.getElementById("ea__easymbol--text").value;

        (eaSymbol) ? stSettings.symbol = eaSymbol : stSettings.symbol = 'eurusd';
        stSettings.eaName = selectEaEl.options[selectEaEl.selectedIndex].text;
        stSettings.period = document.getElementById("ea__eaperiod--select").value;
        stSettings.spread = document.getElementById("ea__easpread--select").value;
        stSettings.fromDate = document.getElementById("ea__eafrom--date").value.replace(/-/g, '.');
        stSettings.toDate = document.getElementById("ea__eato--date").value.replace(/-/g, '.'); 

        loadPage(pages[1]);
    };
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

//// Check if Continue Button is active
function isContinueBtnActive() {
    const btn = document.querySelector('.ea__continue');
    return !(btn.classList.contains('nonactive'));
}


/////////////////////////////////////////////////////
///  Page 1: PARAMS
/////////////////////////////////////////////////////
const renderParam = (param) => {
    const markup = `
    <div class="params__row clearfix">
        <div class="params__pname" id="params__pname--${param.no}">${param.name}</div>
        
        <textarea class="params__pval" id="params__pvalue--${param.no}_${param.value.no}" cols="11" rows="1">${param.value.val}</textarea>

        <div class="params__add">
            <button class="params__addrembtn icon__btn" id="params__padd--${param.no}_${param.value.no}"><ion-icon src="css\\remove-circle-outline.svg"></ion-icon></button>
            <button class="params__addrembtn icon__btn" id="params__padd--${param.no}_${param.value.no}"><ion-icon src="css\\add-circle-outline.svg"></ion-icon></button>
        </div>
        <hr>
    </div>
    `;

    document.querySelector('.params__bottom').insertAdjacentHTML('beforeend', markup);
}

function runParamsPage() {
    document.getElementById('params__run--btn').addEventListener('click', () => {
        loadPage(pages[2]);
    });

    document.getElementById('params__save--btn').addEventListener('click', () => {
        console.log('Saving');
    });

    document.getElementById('params__load--btn').addEventListener('click', () => {
        console.log('Loading');
    });

    const paramDefaultSettings = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\app\\pyapp\\EATesterPy\\Templ\\ea_settings_templ.json'))); 
    Object.keys(paramDefaultSettings).forEach(key => {
        const param = new Object();
        param.no = 1;
        param.name = key;
        param.value = new Object();
        param.value.no = 1;
        param.value.val = paramDefaultSettings[key];
        renderParam(param); 
    });
}


/////////////////////////////////////////////////////
///  Page 2: RESULTS
/////////////////////////////////////////////////////
function runResultsPage() {

}


//////////////////// Sample code for sync scrolling
// var ignoreScrollEvents = false
// function syncScroll(element1, element2) {
//   element1.scroll(function (e) {
//     var ignore = ignoreScrollEvents
//     ignoreScrollEvents = false
//     if (ignore) return

//     ignoreScrollEvents = true
//     element2.scrollTop(element1.scrollTop())
//   })
// }
// syncScroll($("#div1"), $("#div2"))
// syncScroll($("#div2"), $("#div1"))

{/* <div id="div1" style="float:left;overflow:auto;height:100px;width:200px;">
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
</div> */}


////// Sample code for image link opening outside Electron
// https://stackoverflow.com/questions/50519346/external-image-links-in-electron-do-not-open-in-an-external-browser
/////////////////////////////////////////////////////
///  Page 1: PARAMS
/////////////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
const { getElements } = require('./base');
const { spawnPyApp } = require('./py');

class Params {
    constructor(eaName, paramsCfg) {
        eaName == '' ? this.eaName = 'EA Tester' : this.eaName = eaName;
        this.paramsCfg = paramsCfg;
        // Get DOM elements
        this.elements = getElements().params;

        // Display EA name as title
        this.elements.title.textContent = this.eaName;
    }

    renderParams() {   
        let paramsConfig = '';
        // Check if object is empty
        if (Object.keys(this.paramsCfg).length !== 0)
        {
            // Parse paramsCfg and display parameter names and set of values  
            paramsConfig = this.paramsCfg;
        } else {
            // Parse ea_settings_templ.json and get EA param names and default values
            // For built app
            // paramsConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '..\\..\\..\\..') + '\\app\\pyapp\\EATesterPy\\Templ\\ea_settings_templ.json')); 
            // For running app
            paramsConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\pyapp\\EATesterPy\\Templ\\ea_settings_templ.json'))); 
            for(var prop in paramsConfig) {
                this.paramsCfg[prop] = paramsConfig[prop];
            }
        }
        Object.keys(paramsConfig).forEach((key, idx) => {
            const param = {
                no: idx,
                name: key,
                value: valToArray(paramsConfig[key])
            }

            this.elements.params.insertAdjacentHTML('beforeend', renderOneParam(param));
        });
        
    }

    btnHandler(eaCfg) {
        const { loadPage, saveConfig, loadConfig } = require('./app');

        // this.elements.addRemBtns.addEventListener('click', event => addRemoveVal.bind(this));
        document.querySelectorAll('.params__addrembtn').forEach(el => {
            el.addEventListener('click', (event) => this.addRemHandler(event));
        })
        
        this.elements.runBtn.addEventListener('click', () => this.handleRunBtn(eaCfg));
        this.elements.saveBtn.addEventListener('click', () => saveConfig());
        this.elements.loadBtn.addEventListener('click', () => loadConfig());
    }

    handleRunBtn(eaCfg) {
        // Create usr_settings.json
        createUsrSettings(eaCfg, this.paramsCfg);

        // Start eatester.py to run MT4
        const mt4path = '"' + eaCfg.mt4path.slice(0, -1) +'"';
        spawnPyApp('eatester.exe', runBtn_OnStdOut, runBtn_OnClose, mt4path);
    }

    addRemHandler(event) {
        const btnId = event.currentTarget.id;
        const paramNo = btnId.split('--')[1];
        const prevEl = event.currentTarget.parentNode.previousElementSibling;
        
        if (btnId.includes('params__prem')) {
            // Update state.paramsCfg.param with removed value
            this.paramsCfg[Object.keys(this.paramsCfg)[paramNo]] = handleRemBtn(prevEl, this.paramsCfg[Object.keys(this.paramsCfg)[paramNo]]);
        } else if (btnId.includes('params__padd')) {
            // Update state.paramsCfg.param with added value
            this.paramsCfg[Object.keys(this.paramsCfg)[paramNo]] = handleAddBtn(prevEl, paramNo, this.paramsCfg[Object.keys(this.paramsCfg)[paramNo]]);
        }
    }
}

const renderOneParam = (param) => {
    return (`
    <div class="params__row clearfix">
        <div class="params__pname" id="params__pname--${param.no}">${param.name}</div>
        
        ${param.value.map(el => renderOneVal(param.no, el)).join('')}

        <div class="params__add">
            <button class="params__addrembtn icon__btn" id="params__prem--${param.no}"><ion-icon src="css\\remove-circle-outline.svg"></ion-icon></button>
            <button class="params__addrembtn icon__btn" id="params__padd--${param.no}"><ion-icon src="css\\add-circle-outline.svg"></ion-icon></button>
        </div>
        <hr>
    </div>
    `);
}

const renderOneVal = (paramNo, paramVal) => `
    <textarea class="params__pval" id="params__pvalue--${paramNo}_${paramVal.no}" cols="11" rows="1">${paramVal.val}</textarea>
`;

const handleAddBtn = (prevEl, paramNo, value) => {
    const paramVal = { no: '', val: '' };
    // If value is already an array, add another element; 
    // if not, turn it into an array and add the second element
    if (Array.isArray(value)) {
        // Maximum array size is 6 (no of displayed param values)
        if (value.length > 5) { return value }
        paramVal.no = value.length;
        paramVal.val = value[value.length - 1];
        value.push(paramVal.val);
    } else {
        paramVal.no = 1;
        paramVal.val = value;
        value = [paramVal.val, paramVal.val];
    }
    prevEl.insertAdjacentHTML('afterend', renderOneVal(paramNo, paramVal));

    return value;
}

const handleRemBtn = (prevEl, value) => {
    if (Array.isArray(value)) {
        value.pop();
        if (value.length == 1) { value = value[0] }

        prevEl.parentNode.removeChild(prevEl);
    }

    return value;
}

const valToArray = (value) => {
    if (Array.isArray(value)) {
        return (
            value.map((el, idx) => {
            return {
                no: idx, 
                val: el 
                }
            })
        )
    } else {
        return (
            [{
                no: 0,
                val: value
            }]
        )
    }
};

const runBtn_OnStdOut = (data, child) => {
    const { loadPage, updateResults, getMt4Path } = require('./app');
    const { spawnPyApp } = require('./py');

    console.log("runBtn_OnStdOut: " + data);
    if (data.toString().includes("EaTester: [Info] Run 1 ended.")) loadPage(2);
    if (data.toString().includes("Continue? (y/n):")) {
        // Read Run state - Run, Stop and respond to eatester.py with "y" or "n"
        child.stdin.write("y\n");
        
        // Call reports.py to update report.json
        const resultsPath = '"' + getMt4Path() + "reports\\AutomatedTesting_EURUSD" + '"';
        spawnPyApp('reports.exe', runEatester_onStdOut, updateResults, resultsPath);
    }
}

const runBtn_OnClose = (data) => {
    const { getElements } = require('./base');
    if (data == 0) {
        if (getElements().params.runBtn != null) getElements().params.runBtn.textContent = 'Run';
        if (getElements().results.pauseBtn != null) getElements().results.pauseBtn.textContent = 'Run';
    }
}

const runEatester_onStdOut = (data) => {
    console.log("runEatester_onStdOut: " + data);
}

//// Create usr_settings.json
const createUsrSettings = (eaCfg, paramsCfg) => {
    // Path to usr_settings.json is fixed
}

module.exports = Params;
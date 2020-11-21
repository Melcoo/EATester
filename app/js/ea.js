/////////////////////////////////////////////////////
///  Page 0: EA
/////////////////////////////////////////////////////
const fs = require('fs');
const { getElements } = require('./base');
const { spawnPyApp } = require('./py');
 

class Ea {
    constructor(eaCfg, pages) {
        this.eaCfg = eaCfg;
        this.pages = pages;

        // Get DOM elements
        this.elements = getElements().ea;
        this.selectEa = '';

        this.initEa();
    }

    async initEa() {
        this.selectEa = document.getElementById('ea__ealist--select');

        this.elements.browse.addEventListener('change', this.handleMt4Path.bind(this));
        this.elements.continueBtn.addEventListener('click', this.handleContinueBtn.bind(this));
    }

    //// Restore old data before leaving the page
    restoreOldData() {
        if (this.eaCfg.mt4path) { 
            this.elements.mt4path.value = this.eaCfg.mt4path + 'terminal.exe';
            this.elements.eaSymbol.value = this.eaCfg.symbol;
            this.elements.eaPeriod.value = this.eaCfg.period;
            this.elements.eaSpread.value = this.eaCfg.spread;
            this.elements.eaDateFrom.value = this.eaCfg.fromDate.replace(/\./g, '-');
            this.elements.eaDateTo.value = this.eaCfg.toDate.replace(/\./g, '-');
    
            this.enableEa();
            this.elements.eaList.value = this.eaCfg.eaName;
        };
    }

    handleMt4Path() {
        const { setContinueBtn } = require('./app')
        const terminalPath = this.elements.browse.files[0].path;

        // Update text area with area
        if(terminalPath.substr(-12) == 'terminal.exe') {
            this.elements.mt4path.value = terminalPath;
            this.eaCfg.mt4path = terminalPath.replace('terminal.exe', '');
    
            this.enableEa();
            this.eaCfg.eaName = this.selectEa.options[0].text;

            setContinueBtn(false);
        } else {
            this.eaCfg.mt4path = '';
            this.selectEa.textContent = '';

            this.elements.mt4path.value = 'Path to "terminal.exe" is not correct!';
            document.querySelectorAll('input[name="ea__to_disable"]').forEach(el => {
                el.setAttribute("disabled", "");
            });

            setContinueBtn(true);
        }
    }

    //// Display EA options
    enableEa() {
        const { setContinueBtn } = require('./app');
        let files;

        if (!fs.existsSync(this.eaCfg.mt4path + '\\reports')){
            try {
                fs.mkdirSync(this.eaCfg.mt4path + '\\reports');
            } catch {
                this.elements.mt4path.value = this.eaCfg.mt4path + "\\reports\ does not exist!";
                document.querySelectorAll('input[name="ea__to_disable"]').forEach(el => {
                    el.setAttribute("disabled", "");
                });
    
                setContinueBtn(true);
            }    
        }

        if (fs.existsSync(this.eaCfg.mt4path + '\\MQL4\\Experts')) {
            files = fs.readdirSync(this.eaCfg.mt4path + '\\MQL4\\Experts');
        } else {
            this.elements.mt4path.value = this.eaCfg.mt4path + '\MQL4\\Experts\ does not exist!';
            document.querySelectorAll('input[name="ea__to_disable"]').forEach(el => {
                el.setAttribute("disabled", "");
            });

            setContinueBtn(true);
        }

        this.selectEa.textContent = '';
        files.forEach(el => {
            let option = document.createElement('option');

            if (el.substr(-4) == '.ex4') {
                option.text = el.replace('.ex4', '');
                this.selectEa.add(option);
            }
        });

        document.querySelectorAll('[name*="ea__to_disable"]').forEach(el => {
            el.removeAttribute("disabled");
        });
    }

    //// Handle Continue button
    handleContinueBtn() {
        const { getBtnCfg, setContinueBtn } = require('./app')
        if (getBtnCfg()) {
            const eaSymbol = this.elements.eaSymbol.value;

            (eaSymbol) ? this.eaCfg.symbol = eaSymbol : this.eaCfg.symbol = 'eurusd';
            this.eaCfg.eaName = this.selectEa.options[this.selectEa.selectedIndex].text;
            this.eaCfg.period = this.elements.eaPeriod.value;
            this.eaCfg.spread = this.elements.eaSpread.value;
            this.eaCfg.fromDate = this.elements.eaDateFrom.value.replace(/-/g, '.');
            this.eaCfg.toDate = this.elements.eaDateTo.value.replace(/-/g, '.'); 

            setContinueBtn(true);
            this.elements.continueBtn.textContent = 'Getting default settings...';

            const mt4path = '"' + this.eaCfg.mt4path.slice(0, -1) +'"';
            const eaName = '"' + this.eaCfg.eaName + '"';
            spawnPyApp('templ.exe', templ_OnStdOut, templ_OnClose, mt4path, eaName);
        };
    }

}

const templ_OnStdOut = (data, child) => {
    console.log(data.toString());
}

const templ_OnClose = (data) => {
    const { loadPage, setContinueBtn, clearParamsCfg } = require('./app');

    if (data == 0) {
        setContinueBtn(false);
        clearParamsCfg();
        loadPage(1);
    }
}

module.exports = Ea;



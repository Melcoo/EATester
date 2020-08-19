/////////////////////////////////////////////////////
///  Page 0: EA
/////////////////////////////////////////////////////
const path = require('path');
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
            this.eaCfg.eaName = 'sdfsdfsdfs';
        };
    }

    handleMt4Path() {
        const terminalPath = this.elements.browse.files[0].path;
    
        // Update text area with area
        if(terminalPath.substr(-12) == 'terminal.exe') {
            this.elements.mt4path.value = terminalPath;
            this.eaCfg.mt4path = terminalPath.replace('terminal.exe', '');
    
            this.enableEa();
            this.eaCfg.eaName = this.selectEa.options[0].text;
        } else {
            this.eaCfg.mt4path = '';
            this.selectEa.textContent = '';

            this.elements.mt4path.value = 'Path to "terminal.exe" is not correct!';
            document.querySelectorAll('input[name="ea__to_disable"]').forEach(el => {
                el.setAttribute("disabled", "");
            });

            continueBtnToggle(false);   
        }
    }

    //// Display EA options
    enableEa() {
        const files = fs.readdirSync(this.eaCfg.mt4path + '\\MQL4\\Experts\\');

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

        continueBtnToggle(true);
    }

    //// Handle Continue button
    handleContinueBtn() {
        if (isContinueBtnActive()) {
            const { loadPage, runPy } = require('./app');
            const eaSymbol = this.elements.eaSymbol.value;

            (eaSymbol) ? this.eaCfg.symbol = eaSymbol : this.eaCfg.symbol = 'eurusd';
            this.eaCfg.eaName = this.selectEa.options[this.selectEa.selectedIndex].text;
            this.eaCfg.period = this.elements.eaPeriod.value;
            this.eaCfg.spread = this.elements.eaSpread.value;
            this.eaCfg.fromDate = this.elements.eaDateFrom.value.replace(/-/g, '.');
            this.eaCfg.toDate = this.elements.eaDateTo.value.replace(/-/g, '.'); 

            this.elements.continueBtn.textContent = 'Getting default settings...';
            continueBtnToggle(false);

            // TODO: replace loadPage(1) with spawnPyApp()
            loadPage(1);
            // spawnPyApp('templ', continueBtnOnStdOut, continueBtnOnClose.bind(this), this.eaCfg.mt4path, this.eaCfg.eaName);
        };
    }

}

//// Change opacity of "Continue" button
const continueBtnToggle = (on) => {
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
const isContinueBtnActive = () => {
    const btn = document.querySelector('.ea__continue');
    return !(btn.classList.contains('nonactive'));
}

const continueBtnOnStdOut = (data) => {
    console.log(data.toString());
}

const continueBtnOnClose = (data) => {
    const { loadPage } = require('./app');
    const { getElements } = require('./base');

    if (data == 0) {
        getElements().ea.continueBtn.textContent = 'Get default settings';
        continueBtnToggle(true);
        loadPage(1);
    }
}

module.exports = Ea;



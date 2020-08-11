/////////////////////////////////////////////////////
///  Page 0: EA
/////////////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
const { getElements } = require('./base');

class Ea {


    constructor(state, pages) {
        this.state = state;
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
        if (this.state.mt4path) { 
            this.elements.mt4path.value = this.state.mt4path + 'terminal.exe';
            this.elements.eaSymbol.value = this.state.stSettings.symbol;
            this.elements.eaPeriod.value = this.state.stSettings.period;
            this.elements.eaSpread.value = this.state.stSettings.spread;
            this.elements.eaDateFrom.value = this.state.stSettings.fromDate.replace(/\./g, '-');
            this.elements.eaDateTo.value = this.state.stSettings.toDate.replace(/\./g, '-');
    
            this.enableEa();
            this.elements.eaList.value = this.state.stSettings.eaName;
        };
    }

    handleMt4Path() {
        const terminalPath = this.elements.browse.files[0].path;
    
        // Update text area with area
        if(terminalPath.substr(-12) == 'terminal.exe') {
            this.elements.mt4path.value = terminalPath;
            this.state.mt4path = terminalPath.replace('terminal.exe', '');
    
            this.enableEa();
            this.state.stSettings.eaName = this.selectEa.options[0].text;
        } else {
            this.state.mt4path = '';
            this.selectEa.textContent = '';

            this.elements.mt4path.value = 'Path to "terminal.exe" is not correct!';
            document.querySelectorAll('input[name="ea__to_disable"]').forEach(el => {
                el.setAttribute("disabled", "");
            });

            this.continueBtnToggle(false);   
        }
    }

    //// Display EA options
    enableEa() {
        const files = fs.readdirSync(this.state.mt4path + '\\MQL4\\Experts\\');

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

        this.continueBtnToggle(true);
    }

    //// Handle Continue button
    handleContinueBtn() {
        if (this.isContinueBtnActive()) {
            const { loadPage } = require('./app');
            const eaSymbol = this.elements.eaSymbol.value;

            (eaSymbol) ? this.state.stSettings.symbol = eaSymbol : this.state.stSettings.symbol = 'eurusd';
            this.state.stSettings.eaName = this.selectEa.options[this.selectEa.selectedIndex].text;
            this.state.stSettings.period = this.elements.eaPeriod.value;
            this.state.stSettings.spread = this.elements.eaSpread.value;
            this.state.stSettings.fromDate = this.elements.eaDateFrom.value.replace(/-/g, '.');
            this.state.stSettings.toDate = this.elements.eaDateTo.value.replace(/-/g, '.'); 

            loadPage(1);
        };
    }

    //// Change opacity of "Continue" button
    continueBtnToggle(on) {
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
    isContinueBtnActive() {
        const btn = document.querySelector('.ea__continue');
        return !(btn.classList.contains('nonactive'));
    }
}

module.exports = Ea;



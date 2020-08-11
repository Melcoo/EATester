/////////////////////////////////////////////////////
///  Page 1: PARAMS
/////////////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
const { getElements } = require('./base');
const { loadPage } = require('./app');

class Params {
    constructor() {
        // Get DOM elements
        this.elements = getElements().params;
    }

    renderParams() {    
        // Parse ea_settings_templ.json and get EA param names and default values
        const paramDefaultSettings = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\pyapp\\EATesterPy\\Templ\\ea_settings_templ.json'))); 
        Object.keys(paramDefaultSettings).forEach(key => {
            const param = new Object();
            param.no = 1;
            param.name = key;
            param.value = new Object();
            param.value.no = 1;
            param.value.val = paramDefaultSettings[key];
            this.renderOneParam(param); 
        });
    }

    btnHandler() {
        this.elements.runBtn.addEventListener('click', () => {
            loadPage(2);
        });
    
        this.elements.saveBtn.addEventListener('click', () => {
            console.log('Saving');
        });
    
        this.elements.loadBtn.addEventListener('click', () => {
            console.log('Loading');
        });
    }

    renderOneParam(param) {
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
    
        this.elements.params.insertAdjacentHTML('beforeend', markup);
    }
}




module.exports = Params;
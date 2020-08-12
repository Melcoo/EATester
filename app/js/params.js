/////////////////////////////////////////////////////
///  Page 1: PARAMS
/////////////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
const { getElements } = require('./base');
const { loadPage } = require('./app');

class Params {
    constructor(eaName, paramsCfg) {
        this.eaName = eaName;
        this.paramsCfg = paramsCfg;
        // Get DOM elements
        this.elements = getElements().params;

        // Display EA name as title
        this.elements.title.textContent = this.eaName;
    }

    renderParams() {   
        // Check if object is empty
        if (Object.keys(this.paramsCfg).length !== 0)
        {
            // Parse paramsCfg and display parameter names and set of values  
            
        } else {
            // Parse ea_settings_templ.json and get EA param names and default values
            const paramDefaultSettings = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\pyapp\\EATesterPy\\Templ\\ea_settings_templ.json'))); 
            Object.keys(paramDefaultSettings).forEach((key, idx) => {
                const param = {
                    no: idx,
                    name: key,
                    value: valToArray(paramDefaultSettings[key])
                }

                this.renderOneParam(param); 
            });
        }
        
    }

    renderOneParam(param) {
        const markup = `
        <div class="params__row clearfix">
            <div class="params__pname" id="params__pname--${param.no}">${param.name}</div>
            
            ${param.value.map(el => this.oneParamVal(param.no, el)).join('')}
    
            <div class="params__add">
                <button class="params__addrembtn icon__btn" id="params__padd--${param.no}}"><ion-icon src="css\\remove-circle-outline.svg"></ion-icon></button>
                <button class="params__addrembtn icon__btn" id="params__padd--${param.no}}"><ion-icon src="css\\add-circle-outline.svg"></ion-icon></button>
            </div>
            <hr>
        </div>
        `;
    
        this.elements.params.insertAdjacentHTML('beforeend', markup);
    }

    oneParamVal = (paramNo, paramVal) => `
        <textarea class="params__pval" id="params__pvalue--${paramNo}_${paramVal.no}" cols="11" rows="1">${paramVal.val}</textarea>
    `;

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


module.exports = Params;
/////////////////////////////////////////////////////
///  DOM elements
/////////////////////////////////////////////////////

exports.getElements = () => { 
    return {
        main: {
            top: document.querySelector('.top'),
            minBtn: document.getElementById('window__btn--minimize'),
            closeBtn: document.getElementById('window__btn--close'),
            eaBtn: document.getElementById('nav__btn--ea'),
            paramBtn: document.getElementById('nav__btn--param'),
            resultBtn: document.getElementById('nav__btn--res')
        },
        ea: {
            browse: document.getElementById('ea__mt4path--file'),
            mt4path: document.getElementById('ea__mt4path--path'),
            eaList: document.getElementById('ea__ealist--select'),
            eaSymbol: document.getElementById("ea__easymbol--text"),
            eaPeriod: document.getElementById("ea__eaperiod--select"),
            eaSpread: document.getElementById("ea__easpread--select"),
            eaDateFrom: document.getElementById("ea__eafrom--date"),
            eaDateTo: document.getElementById("ea__eato--date"),
            continueBtn: document.getElementById('ea__continue--btn'),
            disable: document.querySelectorAll('input[name="ea__to_disable"]')    
        },
        params: {
            title: document.getElementById('params--title'),
            params: document.querySelector('.params__bottom'),
            runBtn: document.getElementById('params__run--btn'),
            saveBtn: document.getElementById('params__save--btn'),
            loadBtn: document.getElementById('params__load--btn')
        },
        results: {
            title: document.getElementById('results--title'),
            saveBtn: document.getElementById('results__save--btn'),
            loadBtn: document.getElementById('results__load--btn'),
            pauseBtn: document.getElementById('results__pause--btn'),
            paramList: document.querySelector('.results__paramlist'),
            graphs: document.querySelector('.results__graphlist'),
            addBtn: document.getElementById('results__add--btn'),
            remBtn: document.getElementById('results__rem--btn')
        }
    }
};

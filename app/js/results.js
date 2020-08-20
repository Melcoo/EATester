/////////////////////////////////////////////////////
///  Page 2: RESULTS
/////////////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
const { getElements } = require('./base');

const visibleParams = [
  "Total net profit",
  "Absolute drawdown",
  "Maximal drawdown"
];

class Results {
  constructor(eaName, resultsCfg) {
    eaName == '' ? this.eaName = 'EA Tester' : this.eaName = eaName;
    this.resultsCfg = resultsCfg;
    this.finalReport = '';
    // Get DOM elements
    this.elements = getElements().results;

    // Display EA name as title
    this.elements.title.textContent = this.eaName;

    // Add: Total Net Profit, Maximal Drawdown to visible columns
    this.resultsCfg.visibleParams = visibleParams;
  }

  renderParamNames(paramsCfg) {    
    // Add as options list of params from report.json
    this.finalReport = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\pyapp\\EATesterPy\\Reports\\report.json'))); 
    
    // Add as options lsit parameters from report.json
    if (this.finalReport.length > 0) {
      // Remove "Parameters", "Graph", "Report" fom array
      this.resultsCfg.params = Object.keys(this.finalReport[0]).filter(el => ((el != "Parameters") && (el != "Graph") && (el != "Report")));
    }

    // Read parameter list from Param page and find array parameters
    if (paramsCfg) {
      // Add them to the visible params columns
      Object.keys(paramsCfg).map((el) => {
        if (Array.isArray(paramsCfg[el])) this.resultsCfg.visibleParams.push(el)
      });
      // Add as options list all parameters from params Page
      this.resultsCfg.params.push(...Object.keys(paramsCfg)); 
    }

    // Create columns for each one and display param names in the dropdown lists
    this.resultsCfg.visibleParams.forEach(el => {
      this.elements.paramList.insertAdjacentHTML('beforeend', renderParams(this.resultsCfg.params, el));
    });
  }

  renderResults() {
    // Get list of params from report.json; if missing, return!
    if (this.finalReport.length == 0) return;

    // Read array size (reportSize) from report.json
    let params = Object.keys(this.finalReport[0]);

    // Loop through latest elements until this.resultsCfg.noOfResults equals reportSize

      // Render each line filling columns with param value and graph

    this.syncScroll();
  }

  btnHandler() {
    const { saveConfig, loadConfig } = require('./app');

    this.elements.saveBtn.addEventListener('click', () => saveConfig());
    this.elements.loadBtn.addEventListener('click', () => loadConfig());
    this.elements.graphsBtn.addEventListener('click', () => this.toggleGraphsOnly());
    
  }

  addRemHandler(event) {

  }

  toggleGraphsOnly() {

  }

  syncScroll() {
    // this.elements.graphs.scrollTop = this.elements.paramList.scrollTop;
    // this.elements.paramList.scrollTop = this.elements.graphs.scrollTop;
    this.elements.graphs.addEventListener('scroll', () => {
      this.elements.paramList.scrollTop = this.elements.graphs.scrollTop;
    });
  }
}

const renderParams = (params, curParam) => {
  return (`
    <div class="results__column">
      <div class="results__paramdata">
          <select class="results__param__select">
          <option disabled selected hidden>${curParam}</option>
              ${params.map(el => '<option>' + el +'</option>').join('')}
          </select>

          <div class="results__param__values">
              <div class="results__param__pvalue"><p>1.10000000</p><hr></div>
              <div class="results__param__pvalue"><p>1.10000000</p><hr></div>
          </div>
      </div>

      <button class="results__param__filter icon__btn" id="results__filter--btn_1"><ion-icon src="css\\filter-outline.svg"></ion-icon></button>
      <div class="vl"></div>
    </div>
  `);
}

const renderOneResult = (val) => {
  return (`<div class="results__param__pvalue"><p>${val}</p><hr></div>`);
}

const handleRemBtn = () => {

}

const handleAddBtn = () => {

}


module.exports = Results;



////// Sample code for image link opening outside Electron
/*
https://stackoverflow.com/questions/50519346/external-image-links-in-electron-do-not-open-in-an-external-browser
*/

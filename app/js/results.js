/////////////////////////////////////////////////////
///  Page 2: RESULTS
/////////////////////////////////////////////////////
const { getElements } = require('./base');

class Results {
  constructor(eaName, resultsCfg, paramsCfg) {
    eaName == '' ? this.eaName = 'EA Tester' : this.eaName = eaName;
    this.resultsCfg = resultsCfg;
    this.paramsCfg = paramsCfg;
    // Get DOM elements
    this.elements = getElements().results;

    // Display EA name as title
    this.elements.title.textContent = this.eaName;
  }

  renderParamNames() {
    // Get list of params from report.json; if missing, return!

    // Select: Total Net Profit, Maximal Drawdown and array parameters from paramCfg

    // Create columns for each one and display param names in the dropdown lists

  }

  renderResults() {
    // Read array size (reportSize) from report.json

    // Loop through latest elements until this.resultsCfg.noOfResults equals reportSize

      // Render each line filling columns with param value and graph

    this.syncScroll();
  }

  renderOneResult() {

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

const handleRemBtn = () => {

}

const handleAddBtn = () => {

}


module.exports = Results;



////// Sample code for image link opening outside Electron
/*
https://stackoverflow.com/questions/50519346/external-image-links-in-electron-do-not-open-in-an-external-browser
*/

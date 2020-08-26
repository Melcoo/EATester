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
    this.noOfResults = 0;
    this.sortedParam = '';
    
    // Get DOM elements
    this.elements = getElements().results;

    // Display EA name as title
    this.elements.title.textContent = this.eaName;

    // Add as options list of params from report.json
    if (!this.resultsCfg.fullReport) {
      this.resultsCfg.fullReport = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..\\pyapp\\EATesterPy\\Reports\\report.json')));
    }

    // Add: Total Net Profit, Maximal Drawdown to visible columns
    if (!this.resultsCfg.visibleParams) this.resultsCfg.visibleParams = visibleParams;
  }

  //// Create columns for all visible parameters
  renderParamNames(paramsCfg) {       
    // Add as options lsit parameters from report.json
    if (this.resultsCfg.fullReport.length > 0) {
      // Remove "Parameters", "Graph", "Report" fom array
      this.resultsCfg.params = Object.keys(this.resultsCfg.fullReport[0]).filter(el => ((el != "Parameters") && (el != "Graph") && (el != "Report")));
    }

    // Read parameter list from Param page and find array parameters
    if (paramsCfg) {
      // Add them to the visible params columns
      Object.keys(paramsCfg).map((el) => {
        if (Array.isArray(paramsCfg[el]) && (!this.resultsCfg.visibleParams.includes(el))) {
          this.resultsCfg.visibleParams.push(el);
        }
      });
      // Add as options list all parameters from params Page
      this.resultsCfg.params.push(...Object.keys(paramsCfg)); 
    }

    // Create columns for each one and display param names in the dropdown lists
    this.resultsCfg.visibleParams.forEach(el => {
      this.elements.paramList.insertAdjacentHTML('beforeend', renderParams(this.resultsCfg.params, el));
    });

    // Add event listener to rerender param values and graphs if visible options change
    this.handleOptions();
    // Hanle Filter button
    this.hanldeFilterBtn();
  }

  //// Handler for dropdown options
  handleOptions() {
    document.querySelectorAll('.results__param__select').forEach((el, idx) => {
      el.addEventListener('change', (event) => {
        this.resultsCfg.visibleParams[idx] = event.srcElement[event.srcElement.selectedIndex].value;
        event.target.nextSibling.nextElementSibling.id = `results__value--${event.srcElement[event.srcElement.selectedIndex].value}`;
        this.clearAllVisible();
        this.renderResults();
      });
    })
  }

  //// Reset view
  clearAllVisible = () => {
    document.querySelectorAll('.results__param__values').forEach(el => {
      el.textContent = '';
    })
    document.querySelector('.results__graphlist').textContent = '';
    this.noOfResults = 0;
  }

  //// When Filter button is clicked, order column values descendingly/ascendingly
  hanldeFilterBtn() {
    document.querySelectorAll('.results__param__filter').forEach(el => {
      el.addEventListener('click', event => {
        // Get selected option from id of the div located(in html) above the button
        const paramName = event.currentTarget.previousElementSibling.lastElementChild.id.split('--')[1];

        // If param has already been sorted, sort the other way
        this.rearangeFullReport(paramName, (paramName === this.sortedParam));
        this.clearAllVisible();
        this.renderResults();
      });
    });
  }

  //// Sort state.resultsCfg.fullReport based on one parameter
  rearangeFullReport(paramName, ascending = false) {
      let tempReport = [];
      this.resultsCfg.fullReport.forEach((el, idx) => {
        if (idx === 0) {
          tempReport[idx] = el;
        } else {
          
          let i = 0;
          for (let j in tempReport) {
            // Descendent sorting - highest value spliced/added first
            if ((ascending == false) && (parseInt(tempReport[j][paramName]) > parseInt(el[paramName]))) i++;
            // Ascending order - lowest value spliced/added first
            if ((ascending == true) && (parseInt(tempReport[j][paramName]) < parseInt(el[paramName]))) i++;
          }
          tempReport.splice(i, 0, el);
        }
      });

      this.resultsCfg.fullReport = tempReport;
      // Next time the sorting is performed, do it in the opposite way
      this.sortedParam === paramName ? this.sortedParam = '' : this.sortedParam = paramName;
  }

  ////  Create rows on each param column with values from state.resultsCfg.fullReport
  renderResults() {
    if ((this.resultsCfg.fullReport.length == 0) || (!this.resultsCfg.visibleParams)) return;

    // Read array size (reportSize) from report.json
    let results = this.resultsCfg.fullReport;    
    let graphsRendered = false;

    // Loop through all visible params (all displayes columns)
    this.resultsCfg.visibleParams.forEach(el => {
      if (Object.keys(results[0]).includes(el)) {
        // Loop through latest elements until noOfResults equals reportSize
        for (let idx = this.noOfResults; idx < results.length; idx++) {
          // Render each line filling columns with param value and graph
          document.getElementById(`results__value--${el}`).insertAdjacentHTML('beforeend', renderOneVal(results[idx][el]));
          // Only render graphs once (not for all param value columns)
          if (!graphsRendered) {
            document.querySelector('.results__graphlist').insertAdjacentHTML('beforeend', renderOneGraph(results[idx]["Report"], results[idx]["Graph"]));
          } 
        }
        graphsRendered = true;
      }
    });

    this.noOfResults = results.length;
    this.syncScroll();
    this.openGraphsExternal();
  }

  //// General button handler for static elements 
  btnHandler() {
    const { saveConfig, loadConfig } = require('./app');

    this.elements.saveBtn.addEventListener('click', () => saveConfig());
    this.elements.loadBtn.addEventListener('click', () => loadConfig());
    this.elements.pauseBtn.addEventListener('click', () => console.log('Pause python script'));
    this.elements.addBtn.addEventListener('click', () => console.log('Add param to Results'));
    this.elements.remBtn.addEventListener('click', () => console.log('Remove param from Results'));
  }

  addRemHandler(event) {

  }

  //// Sync hidden scroll of param columns with visible scrollbar graphs column
  syncScroll() {
    this.elements.graphs.addEventListener('scroll', () => {
      document.querySelectorAll('.results__param__values').forEach(el => {
        el.scrollTop = this.elements.graphs.scrollTop;
      })
    });

    document.querySelectorAll('.results__param__values').forEach(el => {
      el.addEventListener('wheel', (event) => {
        this.elements.graphs.scrollTop += event.deltaY;
      })
    });
  }

  //// Open href (.htm file) associated with each .gif in OS's browser (externally)
  openGraphsExternal() {
    document.querySelectorAll('.results__graphlist a').forEach(el => {
      el.addEventListener('click', event => {
        if (event.target) {
          event.preventDefault();
          let link = event.currentTarget.href;
          const{ shell } = require('electron');
          shell.openExternal(link);
        }
      })
    });
  }

}

//// Markup for one param column 
const renderParams = (params, curParam) => {
  return (`
    <div class="results__column">
      <div class="results__paramdata">
          <select class="results__param__select">
          <option disabled selected hidden>${curParam}</option>
              ${params.map(el => '<option>' + el +'</option>').join('')}
          </select>

          <div class="results__param__values" id="results__value--${curParam}">

          </div>
      </div>

      <button class="results__param__filter icon__btn"><ion-icon src="css\\filter-outline.svg"></ion-icon></button>
      <div class="vl"></div>
    </div>
  `);
}

//// Markup for one row(one value) inside one param column
const renderOneVal = (val) => {
  return (`<div class="results__param__pvalue"><p>${val}</p><hr></div>`);
}

//// Markup for one row graph
const renderOneGraph = (href, img) => {
  return (`
  <a href="${href}" target="_blank">
    <img src="${img}" alt="${img}">
  </a>
  `);
}

const handleRemBtn = () => {

}

const handleAddBtn = () => {

}


module.exports = Results;

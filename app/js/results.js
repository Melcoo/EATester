
/////////////////////////////////////////////////////
///  Page 2: RESULTS
/////////////////////////////////////////////////////




/////////////////////////////////////////////////////
///  Test code
/////////////////////////////////////////////////////

//// Sample code for sync scrolling

/*
var ignoreScrollEvents = false
function syncScroll(element1, element2) {
  element1.scroll(function (e) {
    var ignore = ignoreScrollEvents
    ignoreScrollEvents = false
    if (ignore) return

    ignoreScrollEvents = true
    element2.scrollTop(element1.scrollTop())
  })
}
syncScroll($("#div1"), $("#div2"))
syncScroll($("#div2"), $("#div1"))
*/

/* <div id="div1" style="float:left;overflow:auto;height:100px;width:200px;">
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
</div>

<div id="div2" style="float:right;overflow:auto;height:100px;width:200px;">
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
  <p>lulz</p>
</div> */


////// Sample code for image link opening outside Electron
/* 
https://stackoverflow.com/questions/50519346/external-image-links-in-electron-do-not-open-in-an-external-browser
*/

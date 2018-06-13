// ==UserScript==
// @name         File Preview
// @namespace    com.ibm
// @version      0.0.1
// @description  Insert link to a file when no preview is available
// @author       Brian Gleeson
// @match        *://apps.na.collabserv.com/files/*
// @grant        none
// ==/UserScript==

// utility function to let us wait for a specific element of the page to load...
var waitFor = function(callback, elXpath, elXpathRoot, maxInter, waitTime) {
  if(!maxInter) maxInter = 3000; // number of intervals before expiring
  if(!waitTime) waitTime = 10; // 1000=1 second
  if(!elXpath) return;
  var waitInter = 0; // current interval
  var intId = setInterval( function(){
    if(typeof(dojo) == "undefined") return;
    if(!elXpathRoot) var elXpathRoot = dojo.body();
    if(++waitInter<maxInter && !dojo.query(elXpath,elXpathRoot).length) return;

    clearInterval(intId);
    if( waitInter >= maxInter) {
      console.log("**** WAITFOR ["+elXpath+"] WATCH EXPIRED!!! interval "+waitInter+" (max:"+maxInter+")");
    } else {
      console.log("**** WAITFOR ["+elXpath+"] WATCH TRIPPED AT interval "+waitInter+" (max:"+maxInter+")");
      callback();
    }
  }, waitTime);
};

// here we use waitFor to wait on the .lotusMain element
// before we proceed to customize the page...
waitFor( function() {
  var fileCardBack = dojo.query(".lconnFilesGridItem .card-back");
  fileCardBack.onclick(function(node) {
    waitFor( function() {
        var previewText = dojo.query(".ics-viewer-icon-preview > div > div > span")[0];
        if (!!previewText) {
          previewText.textContent="";
          var downloadLink = dojo.query(".ics-viewer-toolbar .ics-viewer-action-download > div > a")[0];
          dojo.place("<div id='file-link'>" +
                     "<span>Preview unavailable. <a href='" + downloadLink.href + "'>Download the file</a></span>" +
                     "</div>", previewText, "replace");
        }

    }, ".ics-viewer .ics-viewer-content");
  });
}, ".lotusMain .filesListFilled");

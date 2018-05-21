// ==UserScript==
// @copyright    Copyright IBM Corp. 2018
// @name         Box Widget
// @version      0.1
// @description  *** PROTOTYPE CODE *** inject Box Widget using Customizer
// @namespace    http://ibm.com
// @author       Brian Gleeson
// @include      *://apps.na.collabserv.com/homepage/*
// @exclude
// @run-at       document-end
//
// ==/UserScript==

// utility function to let us wait for a specific element of the page to load...
var waitFor = function(callback, elXpath, maxInter, waitTime) {
  if (!maxInter) var maxInter = 300;  // number of intervals before expiring
  if (!waitTime) var waitTime = 100;  // 1000=1 second
  var waitInter = 0;  // current interval
  var intId = setInterval( function() {
    if (++waitInter >= maxInter) return;
    if (typeof(dojo) == "undefined") return;
    if (!dojo.query(elXpath, dojo.body()).length) return;
    clearInterval(intId);
    if (waitInter < maxInter) {
      callback();
    }
  }, waitTime);
};

var generateGuid = function() {
  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// here we use waitFor to wait on the .lotusStreamTopLoading div.loaderMain.lotusHidden element
// before we proceed to customize the page...
// Specific folder: <iframe src="https://ibm.ent.box.com/embed/s/613gw0e3d7mr3vawxc9szs6bpttj0di4" width="500" height="400" frameborder="0" allowfullscreen webkitallowfullscreen msallowfullscreen></iframe>
// User root folder: https://ibm.ent.box.com/embed_widget/files/0/f/0
var containerLocator = ".lotusColRight .dojoDndContainer";
waitFor(
  function() {
    // wait until the "loading..." node has been hidden
    // indicating that we have loaded content.
    var uuid = generateGuid();
    var rightColumn = dojo.query(containerLocator)[0];
    var boxWidgetSmall = "<div class='lotusSection2 homepage-widget' role='complementary' aria-labelledby='" + uuid + "heading'" +
        "id='" + uuid + "_container' widgetid='" + uuid + "'>" +
        "<div class='lotusSectionHeader'>" +
        "<div class='lotusInner'>" +
        "<h2 class='lotusHeading' id='" + uuid + "heading' dojoattachpoint='titleBar'>Box Files</h2>" +
        "</div></div>" +
        "<div class='lotusSectionBody'>" +
        "<div id='_" + uuid + "_root'>" +
        "<iframe src='https://ibm.ent.box.com/embed/s/613gw0e3d7mr3vawxc9szs6bpttj0di4?partner_id=314' width='375' height='400' frameborder='0'" +
        "allowfullscreen webkitallowfullscreen msallowfullscreen>" +
        "</iframe>" +
        "</div></div>";
    dojo.place(boxWidgetSmall, rightColumn, "first");

    /*
    var content = dojo.query(".lotusContent")[0];
    var boxWidgetLarge = "<div class='lotusStream' id='boxWidgetLarge' widgetid='boxWidgetLarge' style='margin-bottom:20px;'>" +
        "<div class='lotusWidgetBody' id='boxWidgetLargeMain'>" +
        "<iframe src='https://ibm.ent.box.com/embed_widget/files/0/f/0?theme=gray&partner_id=314' width='100%' height='400' frameborder='0'" +
        "allowfullscreen webkitallowfullscreen msallowfullscreen>" +
        "</iframe>" +
        "</div></div>";
        dojo.place(boxWidgetLarge, content, "first");
    */
  }, containerLocator);

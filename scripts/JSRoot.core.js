(function (factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) : factory({});

})((function (exports) {

'use strict';

function core_import() {
   return import('../modules/core.mjs');
}

exports.httpRequest = function(...args) {
   return core_import().then(handle => handle.httpRequest(...args));
}

let jsrp = null; // old JSROOT.Painter handle

/** try to emulate JSROOT v6 require */
function require_v6(need) {
   if (!need)
      return Promise.resolve(null);

   if (typeof need == "string") need = need.split(";");

   need.forEach((name,indx) => {
      if ((name.indexOf("load:")==0) || (name.indexOf("user:")==0))
         need[indx] = name.substr(5);
      else if (name == "2d")
         need[indx] = "painter";
      else if ((name == "jq2d") || (name == "jq"))
         need[indx] = "hierarchy";
      else if (name == "v6")
         need[indx] = "gpad";
      else if (name == "v7")
         need[indx] = "v7gpad";
   });

   let arr = [];

   need.forEach(name => {
      if (name == "hist")
         arr.push(import("../modules/hist.mjs"));
      else if (name == "hist3d")
         arr.push(import("../modules/hist3d.mjs"));
      else if (name == "more")
         arr.push(import("../modules/more.mjs"));
      else if (name == "gpad")
         arr.push(import("../modules/gpad.mjs"));
      else if (name == "io")
         arr.push(import("../modules/io.mjs"));
      else if (name == "tree")
         arr.push(import("../modules/tree.mjs"));
      else if (name == "geobase")
         arr.push(import("../modules/geobase.mjs"));
      else if (name == "geom")
         arr.push(import("../modules/geom.mjs"));
      else if (name == "math")
         arr.push(import("../modules/math.mjs"));
      else if (name == "latex")
         arr.push(import("../modules/latex.mjs"));
      else if (name == "painter") {
         arr.push(jsrp ? jsrp : Promise.all([import('../modules/painter.mjs'), import('../modules/draw.mjs')]).then(res => {
            jsrp = {};
            Object.assign(jsrp, res[0], res[1]);
            globalThis.JSROOT.Painter = jsrp;
            globalThis.JSROOT.ObjectPainter = res[0].ObjectPainter;
            globalThis.JSROOT.BasePainter = res[0].BasePainter;
            return jsrp;
         }));
      } else if (name == "base3d")
         arr.push(import("../modules/base3d.mjs"));
      else if (name == "interactive")
         arr.push(import("../modules/interactive.mjs"));
      else if (name == "hierarchy")
         arr.push(import("../modules/hierarchy.mjs"));
      else if (name == "v7hist")
         arr.push(import("../modules/v7hist.mjs"));
      else if (name == "v7hist3d")
         arr.push(import("../modules/v7hist3d.mjs"));
      else if (name == "v7more")
         arr.push(import("../modules/v7more.mjs"));
      else if (name == "v7gpad")
         arr.push(import("../modules/v7gpad.mjs"))
      else if (name == "openui5")
         arr.push(import("../modules/openui5.mjs").then(handle => handle.doUi5Loading()));
      else
         arr.push(core_import().then(handle => handle.loadScript(name)));
   });

   if (arr.length == 1)
      return arr[0];

   return Promise.all(arr);
}

exports.require = require_v6;

exports.define = function(req, factoryFunc) {
   return require_v6(req).then(arr => req.length < 2 ? factoryFunc(arr) : factoryFunc(...arr));
}

exports.decodeUrl = function(...args) {
   return core_import().then(handle => handle.decodeUrl(...args));
}

exports.buildGUI = function(...args) {
   return core_import().then(handle => handle.buildGUI(...args));
}

exports.openFile= function(...args) {
   return core_import().then(handle => handle.openFile(...args));
}


// try to define global JSROOT
if (typeof globalThis !== "undefined") {
   globalThis.JSROOT = exports;
   // copy all methods - even when asynchrone
}


//openuicfg // DO NOT DELETE, used to configure openui5 usage like _.openui5src = "nojsroot";

}));

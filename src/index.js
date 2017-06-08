
Mura=require('Mura');

/*
mura = Mura
m = Mura;
Mura.displayObject = Mura.DisplayObject;
validateForm = Mura.validateForm;
*/
require('loader.js');
require('core.js');
require('cache.js');
require('domselection.js');
require('entity.js');
require('entitycollection.js');
require('feed.js');
require('ui.js');
require('form');

//require('shadowbox');
//require('templates');

var Handlebars=require('handlebars/runtime');
Mura.Handlebars=Handlebars.create();
Mura.templatesLoaded=false;
Handlebars.noConflict();

if(typeof window != 'undefined'){

  window.Shadowbox=require('shadowbox');

  window.m=Mura;
  window.mura=Mura;
  window.Mura=Mura;

  window.Element && function(ElementPrototype) {
    ElementPrototype.matchesSelector = ElementPrototype.matchesSelector ||
    ElementPrototype.mozMatchesSelector ||
    ElementPrototype.msMatchesSelector ||
    ElementPrototype.oMatchesSelector ||
    ElementPrototype.webkitMatchesSelector ||
    function (selector) {
      var node = this, nodes = (node.parentNode || node.document).querySelectorAll(selector), i = -1;

      while (nodes[++i] && nodes[i] != node);

      return !!nodes[i];
    }
  }(Element.prototype);

  function ready(event) {
    if (ready.interval && this.document.body) {
      ready.interval = clearInterval(ready.interval);

      document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
    }
  }

  ready.interval = setInterval(ready, 1);

  window.addEventListener("load", ready);

}

module.exports=Mura;

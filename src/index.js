
var Mura=require('Mura');

require('loader.js');
require('core.js');
require('cache.js');
require('domselection.js');
require('entity.js');
require('entitycollection.js');
require('feed.js');
require('templates.js');
require('ui.js');
require('form');
require('shadowbox');
require('handlebars/runtime');

Mura.datacache=new Mura.Cache();
Mura.Handlebars=Handlebars.create();
Mura.templatesLoaded=false;
Handlebars.noConflict();

modules.exports=Mura;

if (typeof window !== 'undefined') {
  window.mura = Mura
  window.Mura = Mura
  window.m = Mura;
  Mura.displayObject = Mura.DisplayObject;
  window.validateForm = validateForm;

  function ready(event) {
    if (ready.interval && document.body) {
      ready.interval = clearInterval(ready.interval);

      document.dispatchEvent(new CustomEvent("DOMContentLoaded"));
    }
  }

  ready.interval = setInterval(ready, 1);

  window.addEventListener("load", ready);
}

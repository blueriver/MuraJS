
Mura=require('Mura');

require('loader.js');
require('core.js');
require('cache.js');
require('domselection.js');
require('entity.js');
require('entitycollection.js');
require('feed.js');
require('ui.js');
require('form');

var Handlebars=require('handlebars/runtime');
Mura.Handlebars=Handlebars.create();
Mura.templatesLoaded=false;
Handlebars.noConflict();

Mura.templates=Mura.templates || {};
Mura.templates['meta']=function(context){

  if(context.label){
    return '<div class="mura-object-meta"><h3>' + Mura.escapeHTML(context.label) + '</h3></div>';
  } else {
      return '';
  }
}
Mura.templates['content']=function(context){
  context.html=context.html || context.content || context.source || '';

    return '<div class="mura-object-content">' + context.html + '</div>';
}
Mura.templates['text']=function(context){
  context=context || {};
  context.source=context.source || '<p>This object has not been configured.</p>';
  return context.source;
}
Mura.templates['embed']=function(context){
  context=context || {};
  context.source=context.source || '<p>This object has not been configured.</p>';
  return context.source;
}

require('templates');

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

}

module.exports=Mura;

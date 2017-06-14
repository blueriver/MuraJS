
Mura=require('./core/core');

require('./core/object.js');
require('./core/request.js');
require('./core/RequestContext.js');
require('./core/cache.js');
require('./core/entity.js');
require('./core/entitycollection.js');
require('./core/feed.js');

Mura._requestcontext=new Mura.RequestContext();

if(!Mura.isInNode()){
  require('./core/loader.js');
  require('./core/domselection.js');
  require('./core/ui.js');
  require('./core/form');
  require('./core/templates');

  window.m=Mura;
  window.mura=Mura;
  window.Mura=Mura;

  window.validateForm=Mura.validateForm;
  window.setHTMLEditor=Mura.setHTMLEditor;
  window.createCookie=Mura.createCookie;
  window.readCookie=Mura.readCookie;
  window.addLoadEvent=Mura.addLoadEvent;
  window.noSpam=Mura.noSpam;
  window.initMura=Mura.init;

}

module.exports=Mura;


Mura=require('./core/core');

require('./core/object.js');
require('./core/req_instance.js');
require('./core/req_context.js');
require('./core/cache.js');
require('./core/entity.js');
require('./core/content.js');
require('./core/entitycollection.js');
require('./core/feed.js');

if(Mura.isInNode()){
  Mura._request=require('request');
} else {
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


Mura=require('core/core');

require('core/loader.js');
require('core/object.js');
require('core/cache.js');
require('core/domselection.js');
require('core/entity.js');
require('core/entitycollection.js');
require('core/feed.js');
require('core/ui.js');
require('core/form');
require('core/templates');

if(typeof window != 'undefined'){

  window.Shadowbox=require('core/shadowbox');

  window.m=Mura;
  window.mura=Mura;
  window.Mura=Mura;
}

module.exports=Mura;

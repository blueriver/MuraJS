window = global || window;

Mura=require('./core/core');

require('./core/object.js');
require('./core/req_instance.js');
require('./core/req_context.js');
require('./core/cache.js');
require('./core/entity.js');
require('./core/content.js');
require('./core/entitycollection.js');
require('./core/feed.js');
require('./core/loader.js');
require('./core/domselection.js');
require('./core/ui.js');
require('./core/form');
require('./core/text');
require('./core/embed');
require('./core/templates');

if(Mura.isInNode()){
	/*
		This is an attempt to hide the require('request') from webpack
		It's also ignored in the webpack.config.js
	*/
	Mura._request=eval("require('request')");
} else {

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

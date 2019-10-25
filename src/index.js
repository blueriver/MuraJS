if(!(typeof process !== 'undefined' && {}.toString.call(process) === '[object process]' || typeof document =='undefined')){
require("./core/polyfill");
}

const Mura=require('./core/core.js');

require('./core/object.js');
require('./core/req-instance.js');
require('./core/req-context.js');
require('./core/cache.js');
require('./core/entity.js');
require('./core/content.js');
require('./core/user.js');
require('./core/entitycollection.js');
require('./core/feed.js');
require('./core/loader.js');
require('./core/domselection.js');
require('./core/ui.js');
require('./core/ui.form');
require('./core/ui.text');
require('./core/ui.hr');
require('./core/ui.embed');
require('./core/ui.image');
require('./core/ui.collection');
require('./core/templates');

if(Mura.isInNode()){
	/*
		This is an attempt to hide the require('request') from webpack
		It's also ignored in the webpack.config.js
	*/
	Mura._request=eval("require('request')");
} else if (typeof window != 'undefined'){

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

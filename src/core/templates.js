
var Mura=require('./core');
var Handlebars=require('handlebars/runtime');
Mura.Handlebars=Handlebars.create();
Mura.templatesLoaded=false;
Handlebars.noConflict();

Mura.templates=Mura.templates || {};
Mura.templates['meta']=function(context){
	if(context.label){
		return '<div class="mura-object-meta-wrapper"><div class="mura-object-meta"><h2>' + Mura.escapeHTML(context.label) + '</h2></div></div>';
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
	if(context.label){
		context.source=context.source || '';
	} else {
		context.source=context.source || '';
	}
	return context.source;
}
Mura.templates['embed']=function(context){
	context=context || {};
	if(context.label){
		context.source=context.source || '';
	} else {
		context.source=context.source || '';
	}
	return context.source;
}

require('./templates-handlebars');

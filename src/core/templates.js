
var Mura=require('./core');
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

require('./templates.handlebars');

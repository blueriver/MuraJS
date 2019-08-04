
var Mura=require('./core');
var Handlebars=require('handlebars/runtime');
Mura.Handlebars=Handlebars.create();
Mura.templatesLoaded=false;
Handlebars.noConflict();

Mura.templates=Mura.templates || {};
Mura.templates['meta']=function(context){
	if(typeof context.labeltag == 'undefined' || !context.labeltag){
		context.labeltag='h2';
	}
	if(context.label){
		return '<div class="mura-object-meta-wrapper"><div class="mura-object-meta"><' + Mura.escapeHTML(context.labeltag) + '>' + Mura.escapeHTML(context.label) + '</' + Mura.escapeHTML(context.labeltag) + '></div></div>';
	} else {
		return '';
	}
}
Mura.templates['content']=function(context){
	context.html=context.html || context.content || context.source || '<p></p>';
	return '<div class="mura-object-content">' + context.html + '</div>';
}
Mura.templates['text']=function(context){
	context=context || {};
	if(context.label){
		context.source=context.source || '';
	} else {
		context.source=context.source || '<p></p>';
	}
	return context.source;
}
Mura.templates['embed']=function(context){
	context=context || {};
	if(context.label){
		context.source=context.source || '';
	} else {
		context.source=context.source || '<p></p>';
	}
	return context.source;
}

Mura.templates['image']=function(context){
	context=context || {};
	context.src=context.src||'';
	context.alt=context.alt||'';
	context.caption=context.caption||'';

	var source='';

	if(!context.src){
		return '';
	}

	source='<img src="' + Mura.escapeHTML(context.src) + '" alt="' + Mura.escapeHTML(context.alt) + '" />';
	if(context.caption && context.caption != '<p></p>'){
		source+='<figcaption>' + context.caption + '</figcaption>';
	}
	source='<figure>' + source + '</figure>';

	return source;
}

require('./templates-handlebars');

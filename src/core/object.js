
var Mura=require('./core');

/**
* Creates a new Mura.Core
* @class {class} Mura.Core
* @classdesc Abstract class representing a Mura core object.
*/

function core(){
	this.init.apply(this,arguments);
	return this;
}

/** @lends Mura.Core.prototype */

core.prototype={
	init:function(){
	},
	trigger:function(eventName){
		eventName=eventName.toLowerCase();

		if(typeof this.prototype.handlers[eventName] != 'undefined'){
			var handlers=this.prototype.handlers[eventName];
			for(var handler in handlers){
				handler.call(this);
			}
		}

		return this;
	},
};

core.extend=function(properties){
	var self=this;
	return Mura.extend(Mura.extendClass(self,properties),{extend:self.extend,handlers:[]});
};

Mura.Core=core;

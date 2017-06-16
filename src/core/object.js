
var Mura=require('./core');

/**
* Creates a new Mura.Core

* @name  Mura.Core
* @memberof {class}  Mura
*/

/**
 * Core - initiliazes instance
 * @name Mura.Core
 * @param  {object} properties Object containing values to set into object
 * @return {Mura.Core}
 * @constructs
 */

function Core(){
	this.init.apply(this,arguments);
	return this;
}

Core.prototype=
	/** @lends Mura.Core.prototype */
	{
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

Core.extend=function(properties){
	var self=this;
	return Mura.extend(Mura.extendClass(self,properties),{extend:self.extend,handlers:[]});
};

Mura.Core=Core;

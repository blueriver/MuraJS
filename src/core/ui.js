
var Mura =require("./core");

/**
 * Creates a new Mura.UI instance
 * @name Mura.UI
 * @class
 * @extends  Mura.Core
 * @memberof Mura
 */

Mura.UI=Mura.Core.extend(
  /** @lends Mura.UI.prototype */
  {
	rb:{},
	context:{},
	onAfterRender:function(){},
	onBeforeRender:function(){},
	trigger:function(eventName){
		var $eventName=eventName.toLowerCase();
		if(typeof this.context.targetEl != 'undefined'){
			var obj=mura(this.context.targetEl).closest('.mura-object');
			if(obj.length && typeof obj.node != 'undefined'){
				if(typeof this.handlers[$eventName] != 'undefined'){
					var $handlers=this.handlers[$eventName];
					for(var i=0;i < $handlers.length;i++){
						$handlers[i].call(this);
					}
				}

				if(typeof this[eventName] == 'function'){
					this[eventName].call(this);
				}
				var fnName='on' + eventName.substring(0,1).toUpperCase() + eventName.substring(1,eventName.length);

				if(typeof this[fnName] == 'function'){
					this[fnName].call(this);
				}
			}
		}

		return this;
	},

	render:function(){
		mura(this.context.targetEl).html(Mura.templates[context.object](this.context));
		this.trigger('afterRender');
		return this;
	},

	init:function(args){
		this.context=args;
		this.registerHelpers();
		this.trigger('beforeRender');
		this.render();
		return this;
	},

	registerHelpers:function(){

	}
});

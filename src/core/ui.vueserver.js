import Vue from 'vue'
Mura=require('mura.js')

require('mura.js/src/core/ui.vue')
require('mura.js/src/core/ui.serverutils')

/**
 * Creates a new Mura.UI.VueServer
 * @name  Mura.UI.VueServer
 * @class
 * @extends Mura.UI.Vue
 * @memberof  Mura
 */

Mura.UI.VueServer=Mura.UI.Vue.extend(
/** @lends Mura.UI.VueServer.prototype */
{
	renderServer:function(){
		return this.renderer.renderToString(this.$vm())
	},

	hydrate:function(){
		const container=Mura(this.context.targetEl)
		if(container.length && container.node.innerHTML){
			container.node.firstChild.setAttribute('id','mc' + this.context.instanceid)
			this.$vm().$mount('#mc' + this.context.instanceid,true)
			this.trigger('afterRender');
		}
	},

	registerHelpers:function(){
		if(Mura.isInNode()){
			this.renderer = eval("require('vue-server-renderer')").createRenderer(this.rendererOptions)
		}
	},

	renderer:null,

	rendererOptions:{}

});

import Vue from 'vue';
import { createRenderer } from 'vue-server-renderer'

const Mura=require('./core');

require('./ui.vue')

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
		async _renderServer(){
			return this.renderer.renderToString(this.vm()).then((html) => {
				return html
			})
		}

		return await _renderServer()
	},

	hydrate:function(){
		const container=Mura(this.context.targetEl)
		if(!container.attr('id')){
			container.attr('id','mc' + this.context.instanceid);
		}
		this.$vm().$mount('#' + container.attr('id'),true)
		this.trigger('afterRender');
	},

	registerHelpers:function(){
		this.renderer = createRenderer(this.rendererOptions)
	},

	renderer:null,

	rendererOptions:{}

});

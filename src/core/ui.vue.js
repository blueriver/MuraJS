import Vue from 'vue'
const Mura=require('./core');


/**
 * Creates a new Mura.UI.Vue
 * @name  Mura.UI.Vue
 * @class
 * @extends Mura.UI
 * @memberof  Mura
 */

Mura.UI.Vue=Mura.UI.extend(
/** @lends Mura.UI.Vue.prototype */
{
	vm:function(){

		return new Vue(
			Object.assign({},
				this.component,
				{
					propsData:{ context: this.context }
				})
		)
	},

	renderClient:function(){
		const container=Mura(this.context.targetEl)
		if(!container.attr('id')){
			container.attr('id','mc' + this.context.instanceid);
		}
		this.vm().$mount('#' + container.attr('id'))
		this.trigger('afterRender');
	}

});

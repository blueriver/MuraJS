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
		if(!container.node.firstChild){
			container.node.appendChild(document.createElement('DIV'));
		}
		container.node.firstChild.setAttribute('id','mc' + this.context.instanceid)
		this.vm().$mount('#mc' + this.context.instanceid)
		this.trigger('afterRender');
	},

	destroy:function(){

	}

});
